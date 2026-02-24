import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { filename, data } = (await request.json()) as {
      filename?: string;
      data?: unknown;
    };

    if (!filename || !data) {
      return NextResponse.json(
        { error: 'Filename and data are required' },
        { status: 400 }
      );
    }

    const safe = filename
      .trim()
      .replace(/\.json$/i, '')
      .replace(/[^a-zA-Z0-9-_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    if (!safe) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }

    const directoryPath = path.join(process.cwd(), 'public/data/tests');
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    const filePath = path.join(directoryPath, `${safe}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true, path: filePath });
  } catch (error) {
    console.error('Error saving test file:', error);
    return NextResponse.json(
      { error: 'Failed to save test file' },
      { status: 500 }
    );
  }
}

