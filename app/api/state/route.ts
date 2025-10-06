import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/state/store';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const store = getStore();
    const state = await store.read();
    
    return NextResponse.json(state, {
      status: 200,
      headers: {
        'Cache-Control': 's-maxage=5, stale-while-revalidate',
      },
    });
  } catch (error) {
    console.error('Failed to get state:', error);
    return NextResponse.json(
      { error: 'Failed to get state' },
      { status: 500 }
    );
  }
}
