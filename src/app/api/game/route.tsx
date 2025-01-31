import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import GameS from "../../../../models/game_model";

import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const id = req.nextUrl.searchParams.get('id')
    await dbConnect();
    const game = await GameS.findById(id);
    return NextResponse.json(game);
}