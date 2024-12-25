"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import styles from "./page.module.css";
export default function Profile(){
    const [games, setGames] = useState([])
    const session = useSession()
    useEffect(() => {
        if(session.data && session.data.user){
            console.log("u9")
            fetch(`/api/getGames?id=${session.data.user.id}`, {
                method: 'GET',
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setGames(data)
            })
        }
    }, [session])
    let x = 1
    return(
        <div>
            <h1>Profile</h1>
            <div>
                <p>Username: {session.data && session.data.user && session.data.user.name}</p>
                <p>Email: {session.data && session.data.user && session.data.user.email}</p>
            </div>
            {
                session.data && session.data.user && games && games.map((game: any) => (
                    <div className={styles.game} key={game._id}>
                        <p>{x++}.</p>
                        {game.winner == session.data.user.id ? <p>Win</p> : <p>Loss</p>}
                        <p>{game.moves} Moves</p>
                        <p>Creation: {game.creation}</p>
                    </div>
                ))
            }
        </div>
    )
}