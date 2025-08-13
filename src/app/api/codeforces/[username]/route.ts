
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  const username = await params.username;

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://codeforces.com/api/user.info?handles=${username}`);
    
    if (!response.ok) {
      let errorBody = 'Failed to fetch data from Codeforces API.';
      try {
        // Codeforces API might return JSON with error details in 'comment'
        const cfError = await response.json();
        if (cfError && cfError.comment) {
          errorBody = `Codeforces API: ${cfError.comment}`;
        }
      } catch (e) {
        // If parsing error JSON fails, use the generic error
      }
      return NextResponse.json({ error: errorBody }, { status: response.status || 500 });
    }

    const data = await response.json();

    if (data.status === 'OK' && data.result && data.result.length > 0) {
      const user = data.result[0];
      // Rating and rank might be undefined for new or unrated users
      const rating = user.rating === undefined ? 'N/A' : user.rating;
      const rank = user.rank === undefined ? 'Unrated' : user.rank;
      
      return NextResponse.json({
        rating: rating,
        rank: rank,
      });
    } else if (data.comment) {
      // Handle cases like "handles: User with handle ... not found"
      return NextResponse.json({ error: `Codeforces: ${data.comment}` }, { status: 404 });
    } else {
      return NextResponse.json({ error: 'User not found or an unexpected error occurred with Codeforces API.' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching Codeforces data in API route:', error);
    return NextResponse.json({ error: 'Internal server error while fetching Codeforces data.' }, { status: 500 });
  }
}
