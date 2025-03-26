"use client"
import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input"
type CheckUserInputProps = {
    setUserExists: React.Dispatch<React.SetStateAction<string>>;
    className?: string;
};

export default function CheckUserInput({setUserExists, className }: CheckUserInputProps) {
    const inputref = useRef<HTMLInputElement>(null); // Explicitly define the type
    // const [userExists, setUserExists] = useState(false)
    // const [errormessage, setErrormessage] = useState("")
    const [username, setUsername] = useState("")

    useEffect(() => {
        if (username.length < 3) {
            setUserExists("invalid")
            return
        }
        else if (!(/^[a-zA-Z0-9]+$/.test(username))) {
            setUserExists("invalid")
            return
        }
        const delay = setTimeout(async () => {
            console.log("fetching.......", username)
            const response = await fetch('/api/usernamecheck', {
                method: 'POST',
                body: JSON.stringify({
                    username: username
                }),
                credentials: 'include'
            })
            if (response.ok) {
                setUserExists("true")
            }
            else {
                setUserExists("false")
            }
        }, 200)
        return () => clearTimeout(delay)
    }, [username])

    const handleKeypress = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.currentTarget.value)
        setUsername(e.currentTarget.value)
    }

    return (
        <Input
            ref={inputref}
            placeholder="Username"
            type="text"
            name="username"
            required
            minLength={4}
            maxLength={20}
            onChange={handleKeypress}
            className={className} // Apply the passed className
        />
    )
}