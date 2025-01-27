import { NextResponse } from 'next/server';
import dbConnect from "./../../../../lib/dbConnect";
import User from "./../../../../models/users";
import bcrypt from 'bcrypt';
import { getSession } from "next-auth/react";


export async function POST(req: Request) {
    await dbConnect();
    try {
        const body = await req.json();
        console.log(body, "Fdsaffds")
        const user = await User.findById(body[0]);
        await User.findByIdAndUpdate(body[0], {pendingfriends: [...user.pendingfriends, {id: body[2], name: body[1]}]});
        // const user = await User.create(data);
        return NextResponse.json({ success: true, data: user }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 400 });
    }
}