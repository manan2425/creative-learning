import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function ensureUploadDir(): string {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  return uploadDir;
}

function sanitizeFilename(originalName: string, mimeType?: string): string {
  const timestamp = Date.now();
  const rawExt = path.extname(originalName || '').toLowerCase();
  let ext = rawExt;
  if (!ext || ext === '.') {
    if (mimeType === 'application/pdf') ext = '.pdf';
    else if (mimeType?.includes('png')) ext = '.png';
    else if (mimeType?.includes('webp')) ext = '.webp';
    else ext = '.jpg';
  }
  const rawBase = path.basename(originalName || 'photo', rawExt);
  const baseName = rawBase.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 50) || 'upload';
  return `${timestamp}_${baseName}${ext}`;
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';

    // 1. JSON Payload with Base64 Data URL
    if (contentType.includes('application/json')) {
      const body = await request.json();
      const { fileData, fileName, name } = body;

      if (!fileData || typeof fileData !== 'string') {
        return NextResponse.json({ error: 'No image data provided' }, { status: 400 });
      }

      const match = fileData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (match) {
        const mimeType = match[1];
        const base64Data = match[2];
        const buffer = Buffer.from(base64Data, 'base64');
        const uploadDir = ensureUploadDir();
        const filename = sanitizeFilename(fileName || name || 'photo.jpg', mimeType);
        const filePath = path.join(uploadDir, filename);

        try {
          fs.writeFileSync(filePath, buffer);
          return NextResponse.json({
            success: true,
            url: `/uploads/${filename}`,
            name: filename,
            size: buffer.length,
            type: mimeType,
          });
        } catch (fsErr) {
          console.warn('Filesystem write failed in JSON upload:', fsErr);
          return NextResponse.json({
            success: true,
            url: fileData,
            name: fileName || name || 'photo.jpg',
            size: buffer.length,
            type: mimeType,
          });
        }
      }

      // If already a valid URL or plain string
      return NextResponse.json({ success: true, url: fileData });
    }

    // 2. Multipart Form Data (Single or Multiple files)
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const files = formData.getAll('files') as File[];

    const targetFiles = file ? [file] : files.filter(Boolean);

    if (targetFiles.length === 0) {
      return NextResponse.json({ error: 'No file received.' }, { status: 400 });
    }

    const uploadDir = ensureUploadDir();
    const results = [];

    for (const item of targetFiles) {
      if (!item || typeof item.arrayBuffer !== 'function') continue;
      const arrayBuffer = await item.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const filename = sanitizeFilename(item.name, item.type);
      const filePath = path.join(uploadDir, filename);

      try {
        fs.writeFileSync(filePath, buffer);
        results.push({
          success: true,
          url: `/uploads/${filename}`,
          name: item.name,
          size: item.size,
          type: item.type,
        });
      } catch (fsErr) {
        console.warn('Filesystem write fallback to data URL:', fsErr);
        const mimeType = item.type || (filename.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg');
        const base64 = buffer.toString('base64');
        results.push({
          success: true,
          url: `data:${mimeType};base64,${base64}`,
          name: item.name,
          size: item.size,
          type: item.type,
        });
      }
    }

    if (results.length === 1) {
      return NextResponse.json(results[0]);
    }

    return NextResponse.json({
      success: true,
      urls: results.map((r) => r.url),
      files: results,
    });
  } catch (error) {
    console.error('Error during file upload handler:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
