"use client"

import { useSession } from "next-auth/react"
import styles from "./header.module.css"

export default function Header(){
    const session = useSession()
    console.log(session)
    return(
        <header className={styles.header}>
            <h1><a href="/">CHESSY.Tech</a></h1>
            <div>
                {
                    session.status != "loading" ? session.data ?
                        <a href="/profile">Profile</a>:
                        <a href="/signin">Sign in</a>
                    : null
                }
            </div>
        </header>
    )
}