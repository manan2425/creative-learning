import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file received.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Clean file name and preserve extension
    const timestamp = Date.now();
    const originalName = file.name || 'upload.png';
    const ext = path.extname(originalName) || (file.type === 'application/pdf' ? '.pdf' : '.png');
    const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${timestamp}_${baseName}${ext}`;
    const filePath = path.join(uploadDir, filename);

    try {
      fs.writeFileSync(filePath, buffer);
      return NextResponse.json({
        success: true,
        url: `/uploads/${filename}`,
        name: file.name,
        size: file.size,
        type: file.type,
      });
    } catch (fsErr) {
      console.warn('Filesystem write failed, falling back to base64 Data URL:', fsErr);
      const mimeType = file.type || (ext === '.pdf' ? 'application/pdf' : 'image/png');
      const base64 = buffer.toString('base64');
      const dataUrl = `data:${mimeType};base64,${base64}`;
      return NextResponse.json({
        success: true,
        url: dataUrl,
        name: file.name,
        size: file.size,
        type: file.type,
      });
    }
  } catch (error) {
    console.error('Error during file upload:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}

