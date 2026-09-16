import { NextResponse } from 'next/server';
import { getCompanyDataAsync, saveCompanyDataAsync } from '@/lib/storage';
import { CompanyConfig } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getCompanyDataAsync();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error retrieving company data:', error);
    return NextResponse.json({ error: 'Failed to retrieve company data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: CompanyConfig = await request.json();
    if (!body || !body.name) {
      return NextResponse.json({ error: 'Invalid company data' }, { status: 400 });
    }
    const success = await saveCompanyDataAsync(body);
    if (success) {
      return NextResponse.json({ success: true, data: body });
    } else {
      return NextResponse.json({ error: 'Failed to save company data' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error updating company data:', error);
    return NextResponse.json({ error: 'Failed to update company data' }, { status: 500 });
  }
}
