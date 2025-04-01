import { NextRequest, NextResponse } from "next/server";
import User from "../../../../models/users";
import dbConnect from "../../../../lib/dbConnect";

export async function PUT(req: NextRequest){
    const id1 = req.nextUrl.searchParams.get('id1');
    const id2 = req.nextUrl.searchParams.get('id2');
    await dbConnect()

    const user1 = await User.findById(id1)
    const user2 = await User.findById(id2)
    if(!user1 || !user2){
        return NextResponse.json({data: "User not found"}, {status: 400})
    }

    const user1friends = user1.friends.filter((friend: any) => friend.id !== id2)
    const user2friends = user2.friends.filter((friend: any) => friend.id !== id1)

    await User.findByIdAndUpdate(id1, { friends: user1friends});
    await User.findByIdAndUpdate(id2, { friends: user2friends});
    
    return NextResponse.json({data: "Friend removed"}, {status: 200})

}