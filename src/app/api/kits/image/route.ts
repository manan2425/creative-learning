import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getCachedImage, setCachedImage } from '@/lib/serverCache';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return new NextResponse('Missing kit ID', { status: 400 });
    }

    const cacheKey = `kit_img_${id}`;
    const cached = getCachedImage(cacheKey);

    if (cached) {
      const clientEtag = request.headers.get('if-none-match');
      if (clientEtag === cached.etag) {
        return new NextResponse(null, { status: 304 });
      }
      return new NextResponse(cached.buffer as any, {
        status: 200,
        headers: {
          'Content-Type': cached.mimeType,
          'Content-Length': cached.buffer.length.toString(),
          'Cache-Control': 'public, max-age=31536000, immutable',
          'ETag': cached.etag,
        },
      });
    }

    const { db } = await connectToDatabase();
    const doc = await db.collection('kits').findOne(
      { id: id },
      { projection: { image: 1, images: 1 } }
    );

    let rawImage = doc?.image;
    if (!rawImage && Array.isArray(doc?.images) && doc.images.length > 0) {
      rawImage = doc.images[0];
    }

    if (!rawImage) {
      return NextResponse.redirect(
        new URL('https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=700&q=80', request.url),
        307
      );
    }

    if (rawImage.startsWith('http://') || rawImage.startsWith('https://')) {
      return NextResponse.redirect(new URL(rawImage), {
        status: 307,
        headers: { 'Cache-Control': 'public, max-age=86400' },
      });
    }

    if (rawImage.startsWith('data:')) {
      const match = rawImage.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (match) {
        const mimeType = match[1];
        const base64Data = match[2];
        const buffer = Buffer.from(base64Data, 'base64');
        const etag = `W/"kit-${id}-${buffer.length}"`;

        setCachedImage(cacheKey, buffer, mimeType, etag);

        const clientEtag = request.headers.get('if-none-match');
        if (clientEtag === etag) {
          return new NextResponse(null, { status: 304 });
        }

        return new NextResponse(buffer as any, {
          status: 200,
          headers: {
            'Content-Type': mimeType,
            'Content-Length': buffer.length.toString(),
            'Cache-Control': 'public, max-age=31536000, immutable',
            'ETag': etag,
          },
        });
      }
    }

    return NextResponse.redirect(
      new URL('https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=700&q=80', request.url),
      307
    );
  } catch (error: any) {
    console.error('Kit image serve error:', error);
    return NextResponse.redirect(
      new URL('https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=700&q=80', request.url),
      307
    );
  }
}
