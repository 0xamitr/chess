import dbConnect from "./../../../../lib/dbConnect";
import GameS from "./../../../../models/game_model";
import User from "./../../../../models/users";
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    await dbConnect();
    const games = await GameS.find();
    return NextResponse.json({ success: false }, { status: 200 });
}

export async function POST(req: Request) {
    await dbConnect();
    const body = await req.json();
    console.log("body", body);
    const game = await GameS.create({
        players: body.players,
        creation: body.creation,
        winner: body.winner,
        pgn: body.pgn,
        game_id: body.game_id
    });
    const winner = await User.findById(body.winner.id);
    const loser = await User.findById(body.players.filter((player: any) => player.id !== body.winner.id)[0].id);

    console.log("winner", winner);
    if (winner) {
        await User.findByIdAndUpdate(body.winner.id, { games: [...winner.games, { _id: game._id, winner: winner._id, creation: game.creation }] })
    }
    if (loser) {
        await User.findByIdAndUpdate(body.players.filter((player: any) => player.id !== body.winner.id)[0].id, { games: [...loser.games, { _id: game._id, winner: winner._id, creation: game.creation }] })
    }

    return NextResponse.json({ success: false }, { status: 200 });
}
