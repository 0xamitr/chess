'use client';

import { useEffect, useState } from "react";
import ChessBoard from "../../../components/ChessBoard/chessboard"
import Game from "../../../functions/game/game";

export default function GameAnalysis() {
    const [isWhite, setIsWhite] = useState<boolean | null>(true);
    const [offgame, setOffgame] = useState<any | null>(null);
    const [boardState, setBoardState] = useState([
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        ['.', '.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.', '.'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
    ]);

    const onMove = (from: string, to: string) => { 

    }

    useEffect(() => {
        console.log(window.location.pathname.split('/')[1])
        fetch(`/api/game?id=${window.location.pathname.split('/')[1]}`, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                console.log("data", data)
                const g = new Game(null, null, true, "name", "id", "names[index]", "userIds[index]", false, data)
                setOffgame(g)
                if (isWhite) {
                    setBoardState([...g.board.map((row: string[]) => [...row])]); // Ensure deep copy of the board
                    return true
                } else {
                    setBoardState(
                        [...g.board.map((row: string[]) => [...row].reverse())].reverse() // Reverse for black side
                    );
                    return true
                }
            })
    }, [])
    return (
        <div>
            <h1>Game Analysis</h1>
            {
                offgame && <ChessBoard color1={'grey'} color2={'white'} boardState={boardState} setboardState={setBoardState} onMove={onMove} isWhite={isWhite} game={offgame} />
            }
            
        </div>
    )
}