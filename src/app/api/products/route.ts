import { NextResponse } from 'next/server';
import { ProductsTable } from '@/lib/db-tables';
import { getCatalogDataAsync, saveCatalogDataAsync } from '@/lib/storage';
import { Product } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const catalog = await getCatalogDataAsync();
    return NextResponse.json({ products: catalog.products || [] });
  } catch (error) {
    console.error('API GET /api/products error:', error);
    return NextResponse.json({ error: 'Failed to retrieve products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const product: Product = await request.json();
    if (!product || !product.id || !product.name) {
      return NextResponse.json({ error: 'Product name and id are required' }, { status: 400 });
    }

    // 1. Save to MongoDB Products table
    if (!(await ProductsTable.upsert(product))) {
      return NextResponse.json({ error: 'Database is unavailable' }, { status: 503 });
    }

    // 2. Keep composite catalog and disk in sync
    const catalog = await getCatalogDataAsync();
    const idx = catalog.products.findIndex((p) => p.id === product.id);
    const updatedProducts = [...catalog.products];
    if (idx >= 0) {
      updatedProducts[idx] = product;
    } else {
      updatedProducts.push(product);
    }
    await saveCatalogDataAsync({ ...catalog, products: updatedProducts });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('API POST /api/products error:', error);
    return NextResponse.json({ error: 'Failed to save product' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Product id parameter is required' }, { status: 400 });
    }

    if (!(await ProductsTable.delete(id))) {
      return NextResponse.json({ error: 'Product was not deleted from the database' }, { status: 503 });
    }

    const catalog = await getCatalogDataAsync();
    const updatedProducts = catalog.products.filter((p) => p.id !== id);
    await saveCatalogDataAsync({ ...catalog, products: updatedProducts });

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error('API DELETE /api/products error:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
