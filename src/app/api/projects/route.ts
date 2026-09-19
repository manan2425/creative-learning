import { NextResponse } from 'next/server';
import { ProjectsTable } from '@/lib/db-tables';
import { getCatalogDataAsync, saveCatalogDataAsync } from '@/lib/storage';
import { Project } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const catalog = await getCatalogDataAsync();
    return NextResponse.json({ projects: catalog.projects || [] });
  } catch (error) {
    console.error('API GET /api/projects error:', error);
    return NextResponse.json({ error: 'Failed to retrieve projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const item: Project = await request.json();
    if (!item || !item.key || !item.title) {
      return NextResponse.json({ error: 'Project title and key are required' }, { status: 400 });
    }

    if (!(await ProjectsTable.upsert(item))) {
      return NextResponse.json({ error: 'Database is unavailable' }, { status: 503 });
    }

    const catalog = await getCatalogDataAsync();
    const idx = catalog.projects.findIndex((p) => p.key === item.key);
    const updated = [...catalog.projects];
    if (idx >= 0) {
      updated[idx] = item;
    } else {
      updated.push(item);
    }
    await saveCatalogDataAsync({ ...catalog, projects: updated });

    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error('API POST /api/projects error:', error);
    return NextResponse.json({ error: 'Failed to save project' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    if (!key) {
      return NextResponse.json({ error: 'Project key parameter is required' }, { status: 400 });
    }

    if (!(await ProjectsTable.delete(key))) {
      return NextResponse.json({ error: 'Project was not deleted from the database' }, { status: 503 });
    }

    const catalog = await getCatalogDataAsync();
    const updated = catalog.projects.filter((p) => p.key !== key);
    await saveCatalogDataAsync({ ...catalog, projects: updated });

    return NextResponse.json({ success: true, deletedKey: key });
  } catch (error) {
    console.error('API DELETE /api/projects error:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
