import { NextResponse } from 'next/server';
import dbConnect from "./../../../../lib/dbConnect";
import User from "./../../../../models/users";
import bcrypt from 'bcrypt';

export async function GET(req: Request) {
  await dbConnect();

  try {
    const url = new URL(req.url);
    const query = url.searchParams; 

    const param = query.get('username');

    const users = await User.find({name: param});
    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error:any) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });  }
}

export async function POST(req: Request) {
  await dbConnect();
  try {
    const body = await req.json();
    const data = {
      name: body.name,
      email: body.email,
      password: bcrypt.hashSync(body.password, 10),
      provider: "credentials"
    }
    const user = await User.create(data);
    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}