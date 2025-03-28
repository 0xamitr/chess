'use client';

import { useEffect, useState } from "react";
import ChessBoard from "../../../../components/ChessBoard/chessboard"
import Game from "../../../../functions/game/game";
import styles from "./page.module.css";
import { useSession } from "next-auth/react";

export default function GameAnalysis() {
    const [isWhite, setIsWhite] = useState<boolean | null>(true);
    const [offgame, setOffgame] = useState<any | null>(null);
    const session = useSession()

    useEffect(() => {
        fetch(`/api/game?id=${window.location.pathname.split('/')[2]}`, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                let iswhite
                if(session.data && session.data.user){
                    if(data.players[0].id == session.data.user.id){
                        if(data.players[0].color == `white`)
                            iswhite = true
                            
                        else
                            iswhite = false
                    }
                    else{
                        if(data.players[1].color == `white`)
                            iswhite = true
                        else
                            iswhite = false
                    }
                    setIsWhite(iswhite)
                    const g = new Game(null, null, iswhite, "", "", "", "", false, data)
                    setOffgame(g)
                }
            })
    }, [session])
    return (
        <div>
            <h1>Game Analysis</h1>
            <div className={styles.home}>
                {
                    offgame && <ChessBoard color1={'grey'} color2={'white'} offGame={offgame}/>
                }
            </div>
        </div>
    )
}