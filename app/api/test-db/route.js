import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb+srv://mishramanjeet2909:muskan3445@cluster0.r4e7m.mongodb.net/s3dashboard';

export async function GET() {
  try {
    console.log('Testing MongoDB connection...');
    
    const client = new MongoClient(uri);
    await client.connect();
    
    console.log('MongoDB connection successful');
    
    const db = client.db();
    const collections = await db.listCollections().toArray();
    
    await client.close();
    
    return NextResponse.json({
      message: 'MongoDB connection successful',
      collections: collections.map(col => col.name)
    });
    
  } catch (error) {
    console.error('MongoDB test error:', error);
    
    return NextResponse.json({
      message: 'MongoDB connection failed',
      error: error.message
    }, { status: 500 });
  }
}
