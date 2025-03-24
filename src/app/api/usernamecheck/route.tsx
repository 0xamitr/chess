import { NextRequest, NextResponse } from 'next/server';
import dbConnect from "./../../../../lib/dbConnect";
import User from "./../../../../models/users";

export async function POST(req: NextRequest) {
    const body  = await req.json();
    await dbConnect();

    const user = await User.findOne({name: body.username});
    if(user){
        console.log(user)
        return NextResponse.json({ success: true }, { status: 200 });
    }
    else    
        return NextResponse.json({ success: false }, { status: 409 });
}