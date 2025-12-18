import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * Handles the POST request to clear the Firebase session cookie.
 * This is called by the client-side handleLogout action.
 */
export async function POST() {
  const cookieStore = await cookies();  
  cookieStore.delete('token');

  return NextResponse.json({ 
    status: 'success', 
    message: 'Session cookie cleared' 
  }, { status: 200 });
}