import { NextRequest, NextResponse } from "next/server";
import User from "../../../../models/users";
import dbConnect from "../../../../lib/dbConnect";

export async function PUT(req: NextRequest){
    console.log("what")
    const id1 = req.nextUrl.searchParams.get('id1');
    const id2 = req.nextUrl.searchParams.get('id2');
    await dbConnect()

    const user1 = await User.findById(id1)
    const user2 = await User.findById(id2)
    console.log("yo", user1.friends)
    await User.findByIdAndUpdate(id1, { friends: [...user1.friends]});
    await User.findByIdAndUpdate(id2, { friends: [...user2.friends]});

    

}