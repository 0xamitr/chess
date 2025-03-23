"use client"

import Link from "next/link";
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import styles from "./page.module.css";
import AddFriend from "../../../components/addFriend/addFriend";
import Friends from "../../../components/friends/friends";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


export default function Profile() {
    const [games, setGames] = useState([])
    const session = useSession()
    useEffect(() => {
        if (session.data && session.data.user && !session.data.user.pending) {
            console.log(session.data.user.id)
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

        <div className="max-w-3xl ml-auto mr-auto" >
            <h1>Profile</h1>
            <div>
                <p>Username: {session.data && session.data.user && session.data.user.name}</p>
                <p>Email: {session.data && session.data.user && session.data.user.email}</p>
            </div>
            {
                session.data && session.data.user && games && (
                    <div className={styles.games}>
                        <h2>Games</h2>
                        <Table>
                            <TableCaption>Games</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>S.No.</TableHead>
                                    <TableHead>Result</TableHead>
                                    <TableHead>Moves</TableHead>
                                    <TableHead className="text-right">Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {games.map((game: any) => (
                                    <TableRow>
                                        <Link className="contents" href={`/analysis/${game._id}`} key={game._id}>
                                            <TableCell>{x++}</TableCell>
                                            <TableCell>
                                                {game.winner == null ? (
                                                    <p>Draw</p>
                                                ) : game.winner == session?.data?.user.id ? (
                                                    <p>Win</p>
                                                ) : (
                                                    <p>Loss</p>
                                                )}
                                            </TableCell>
                                            <TableCell>{game.moves}</TableCell>
                                            <TableCell className="text-right">{(new Date(game.creation)).toLocaleDateString()}</TableCell>
                                        </Link>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {/* <Link href={`/analysis/${game._id}`} className={styles.game} key={game._id}>
                            <p>{x++}.</p>

                            <p>{game.moves}</p>
                            <p>{(new Date(game.creation)).toLocaleString()}</p>
                        </Link>
                        ))} */}
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