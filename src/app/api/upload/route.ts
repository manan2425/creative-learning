import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const base64Input = formData.get('base64') as string | null;

    if (!file && !base64Input) {
      return NextResponse.json(
        { success: false, error: 'No image provided' },
        { status: 400 }
      );
    }

    let mimeType = 'image/jpeg';
    let base64Data = '';
    let buffer: Buffer | null = null;
    let originalName = 'upload';

    if (base64Input && base64Input.startsWith('data:')) {
      base64Data = base64Input;
      const match = base64Input.match(/^data:([a-zA-Z0-9.+/-]+);base64,(.+)$/);
      if (match) {
        mimeType = match[1];
        buffer = Buffer.from(match[2], 'base64');
      }
      if (file) {
        originalName = file.name;
      } else {
        originalName = mimeType.includes('pdf') ? 'document.pdf' : 'image.jpg';
      }
    } else if (file) {
      originalName = file.name;
      mimeType = file.type || (file.name.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/jpeg');
      const bytes = await file.arrayBuffer();
      buffer = Buffer.from(bytes);
      base64Data = `data:${mimeType};base64,${buffer.toString('base64')}`;
    }

    // Default safe response is base64 (universally supported on Vercel / Serverless & stored in MongoDB)
    let publicUrl = base64Data;

    // Detect serverless environment (e.g., Vercel, AWS Lambda) where /var/task filesystem is read-only
    const isServerless = Boolean(
      process.env.VERCEL || 
      process.env.AWS_LAMBDA_FUNCTION_NAME || 
      process.env.LAMBDA_TASK_ROOT ||
      process.env.NOW_REGION ||
      process.cwd().startsWith('/var/task')
    );

    // Only attempt local disk write if running in a traditional local development server
    if (!isServerless && buffer) {
      try {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const safeName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${Date.now()}_${safeName}`;
        const filePath = path.join(uploadDir, filename);

        fs.writeFileSync(filePath, buffer);
        publicUrl = `/uploads/${filename}`;
      } catch (fsError) {
        // Graceful fallback to base64 if filesystem is not writable
        console.warn('Filesystem write not allowed in this environment. Falling back to Base64 data URL.');
        publicUrl = base64Data;
      }
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      base64: base64Data,
      name: originalName,
      type: mimeType
    });
  } catch (error: any) {
    console.error('File upload handler error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to process upload' },
      { status: 500 }
    );
  }
}

