'use client';

import { useEffect, useState } from "react";
import ChessBoard from "../../../components/ChessBoard/chessboard"
import Game from "../../../functions/game/game";
import styles from "./page.module.css";
import { useSession } from "next-auth/react";
import { setGame } from "../../../functions/gamemanager";

export default function GameAnalysis() {
    const [isWhite, setIsWhite] = useState<boolean | null>(true);
    const [offgame, setOffgame] = useState<any | null>(null);
    const session = useSession()
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
                console.log(session)
                let iswhite
                if(session.data && session.data.user){
                    if(data.players[0].id == session.data.user.id){
                        console.log("hello1")
                        if(data.players[0].color == `white`)
                            iswhite = true
                            
                        else
                            iswhite = false
                    }
                    else{
                        console.log("hello2")
                        if(data.players[1].color == `white`)
                            iswhite = true
                        else
                            iswhite = false
                    }
                    setIsWhite(iswhite)
                    const g = new Game(null, null, iswhite, "", "", "", "", false, data)
                    setOffgame(g)
                    setGame(g)
                    if (isWhite) {
                        setBoardState([...g.board.map((row: string[]) => [...row])]); // Ensure deep copy of the board
                        return true
                    } else {
                        setBoardState(
                            [...g.board.map((row: string[]) => [...row].reverse())].reverse() // Reverse for black side
                        );
                        return true
                    }
                }
            })
    }, [session])
    return (
        <div>
            <h1>Game Analysis</h1>
            <div className={styles.home}>
                {
                    offgame && <ChessBoard color1={'grey'} color2={'white'} />
                }
            </div>
        </div>
    )
}