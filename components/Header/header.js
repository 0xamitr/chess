"use client"

import { useSession } from "next-auth/react"
import styles from "./header.module.css"
import Link from "next/link"
export default function Header(){
    const session = useSession()
    return(
        <header className={styles.header}>
            <h1><Link href="/">CHESSY.Tech</Link></h1>
            <div>
                {
                    session.status != "loading" ? session.data ?
                        <Link href="/profile">Profile</Link>:
                        <Link href="/signin">Sign in</Link>
                    : null
                }
            </div>
        </header>
    )
}