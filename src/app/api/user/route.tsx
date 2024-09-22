import { NextResponse } from 'next/server';
import dbConnect from "../../../../../lib/dbConnect";
import User from "../../../../../models/users";
import bcrypt from 'bcrypt'

export async function GET(req: Request) {
  console.log("not implemented")
}


export async function POST(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();
    const data = {
      name: body.name,
      email: body.email,
      password: bcrypt.hashSync(body.password, 10),
    }
    console.log(data)
    const user = await User.create(data);
    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
