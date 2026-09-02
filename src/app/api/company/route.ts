import { NextResponse } from 'next/server';
import { getCompanyData, saveCompanyData } from '@/lib/storage';
import { CompanyConfig } from '@/types';

export async function GET() {
  try {
    const data = getCompanyData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve company data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: CompanyConfig = await request.json();
    if (!body || !body.name) {
      return NextResponse.json({ error: 'Invalid company data' }, { status: 400 });
    }
    const success = saveCompanyData(body);
    if (success) {
      return NextResponse.json({ success: true, data: body });
    } else {
      return NextResponse.json({ error: 'Failed to save company data' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update company data' }, { status: 500 });
  }
}
