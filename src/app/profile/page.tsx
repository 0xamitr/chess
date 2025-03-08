"use client"

import Link from "next/link";
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import styles from "./page.module.css";
import AddFriend from "../../../components/addFriend/addFriend";
import Friends from "../../../components/friends/friends";

export default function Profile() {
    const [games, setGames] = useState([])
    const session = useSession()
    useEffect(() => {
        if (session.data && session.data.user) {
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
    return (
        <div className={styles.profile}>
            <h1>Profile</h1>
            <div>
                <p>Username: {session.data && session.data.user && session.data.user.name}</p>
                <p>Email: {session.data && session.data.user && session.data.user.email}</p>
            </div>
            {
                session.data && session.data.user && games && (
                    <div className={styles.games}>
                        <h2>Games</h2>
                        {games.map((game: any) => (
                            <Link href={`/analysis/${game._id}`} className={styles.game} key={game._id}>
                                <p>{x++}.</p>
                                {game.winner == null ? (
                                    <p>Draw</p>
                                ) : game.winner == session?.data?.user.id ? (
                                    <p>Win</p>
                                ) : (
                                    <p>Loss</p>
                                )}

                                <p>{game.moves} Moves</p>
                                <p>{(new Date (game.creation)).toLocaleString()}</p>
                            </Link>
                        ))}
                    </div>
                )}
            <div>
                <Link href="/newfriend">Add Friend</Link>
            </div>
            <AddFriend />
            <Friends />
        </div>
    )
}