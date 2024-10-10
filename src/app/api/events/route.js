import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// This API route will handle reading the events.json file from the public directory
export async function GET() {
  const filePath = path.join(process.cwd(), 'public', 'events.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  const events = JSON.parse(jsonData);

  return NextResponse.json(events); // Return the JSON response
}
