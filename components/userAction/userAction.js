"use client"
import styles from "./userAction.module.css"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import CustomForm from "../Form/form"
import CustomInput from "../Input/input"
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"

export default function UserAction() {
    const inputref = useRef(null)
    const session = useSession();
    const [available, setAvailable] = useState(false)
    const [errormessage, setErrormessage] = useState("")
    const [username, setUsername] = useState("")

    useEffect(() => {
        if (inputref.current) {
            alert("f")
            inputref.current.focus(); // Set focus on mount
        }
    }, []);
    
    const router = useRouter()

    useEffect(() => {
        if(username.length < 3){
            setAvailable(false)
            setErrormessage("Username must be atleast 3 characters long")
            return
        }
        if(!(/^[a-zA-Z0-9]+$/.test(username))){
            setAvailable(false)
            setErrormessage("Only alphanumeric characters are allowed")
            return
        }
        const delay = setTimeout(async() => {
            console.log("fetching.......")
            const response = await fetch('/api/usernamecheck', {
                method: 'POST',
                body: JSON.stringify({
                    username: username
                }),
                credentials: 'include'
            })
            if (response.ok){
                setAvailable(true)
                setErrormessage("")
            }
            else{
                setAvailable(false)
                setErrormessage("Username is already taken")
            }
        }, 500)
        return () => clearTimeout(delay)
    }, [username])
    
    const handleSubmit = async (e) => {
        if(!available)
            return
        if(e.target.username.value.length < 3){
            return
        }
        e.preventDefault()
        const formd = new FormData(e.target)
        const entries = Object.fromEntries(formd.entries())
        const email = session.data.user.email
        const response = await fetch('/api/newuser', {
            method: 'POST',
            body: JSON.stringify({
                username: entries.username,
                email: email,
                img: session.data.user.image,
                pending: session.data.user.pending
            }),
            credentials: 'include'
        })
        if (response.ok) {
            const resolve = await response.json()
            await session.update({ 
                pending: false, 
                name: entries.username,
                id: resolve.data._id,
                user: { ...session.data.user, pending: false } 
            });            
            router.push('/')
        }
    }

    const handleKeypress = async (e) => {
        setUsername(e.target.value)
    }
    if (session.status === 'unauthenticated') {
        return null
    }
    if (session.status === 'authenticated') {
        if (!session.data.user.pending)
            return null
    }
    return (
        <>
            {!(session.status === 'loading') &&
                <div className={styles.useraction}>
                    <CustomForm onSubmit={handleSubmit}>
                        <h2>You need to choose a username before you proceed</h2>
                        {session.data && <p>Email: {session.data.user.email}</p>}
                        <CustomInput
                            ref = {inputref}
                            className = {available ? styles.available : styles.unavailable}
                            type="text"
                            maxlength="20"
                            required
                            autoFocus
                            inputheading="username"
                            name="username"
                            onInput={handleKeypress}
                            />
                            <span className={styles.error}>{errormessage}</span>
                            <br />
                        <input type="submit" />
                        <button onClick={() => signOut()}>LOG out</button>
                    </CustomForm>
                </div>
            }
        </>
    )
}