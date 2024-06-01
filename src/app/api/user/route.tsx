import { NextResponse } from 'next/server';
import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/users";

export async function GET(req: Request) {
  await dbConnect();

  try {
    const users = await User.find();
    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error:any) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });  }
}

export async function POST(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();
    const user = await User.create(body);
    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
