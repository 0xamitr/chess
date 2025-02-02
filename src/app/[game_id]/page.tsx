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