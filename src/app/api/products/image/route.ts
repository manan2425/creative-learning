import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getCachedImage, setCachedImage } from '@/lib/serverCache';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const idxParam = searchParams.get('idx') ?? searchParams.get('index');
    const idx = idxParam !== null ? Math.max(0, parseInt(idxParam, 10) || 0) : 0;

    if (!id) {
      return new NextResponse('Missing product ID', { status: 400 });
    }

    const cacheKey = `prod_img_${id}_${idx}`;
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
    const doc = await db.collection('products').findOne(
      { id: id },
      { projection: { image: 1, images: 1 } }
    );

    let rawImage: string | undefined = undefined;
    if (Array.isArray(doc?.images) && doc.images.length > idx) {
      rawImage = doc.images[idx];
    }
    if (!rawImage && idx === 0) {
      rawImage = doc?.image;
    }
    if (!rawImage && Array.isArray(doc?.images) && doc.images.length > 0) {
      rawImage = doc.images[0];
    }

    if (!rawImage) {
      return NextResponse.redirect(
        new URL('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80', request.url),
        307
      );
    }

    // If it's an external URL (http / https)
    if (rawImage.startsWith('http://') || rawImage.startsWith('https://')) {
      return NextResponse.redirect(new URL(rawImage), {
        status: 307,
        headers: { 'Cache-Control': 'public, max-age=86400' },
      });
    }

    // If it's a data URL (e.g. data:image/jpeg;base64,...)
    if (rawImage.startsWith('data:')) {
      const match = rawImage.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (match) {
        const mimeType = match[1];
        const base64Data = match[2];
        const buffer = Buffer.from(base64Data, 'base64');
        const etag = `W/"prod-${id}-${idx}-${buffer.length}"`;

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

    // Default fallback
    return NextResponse.redirect(
      new URL('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80', request.url),
      307
    );
  } catch (error: any) {
    console.error('Product image serve error:', error);
    return NextResponse.redirect(
      new URL('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80', request.url),
      307
    );
  }
}
