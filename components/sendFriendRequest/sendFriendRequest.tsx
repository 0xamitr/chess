"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import CheckUserInput from "../checkUserInput/checkuserinput";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export default function SendFriendRequest() {
    const session = useSession()
    const [userExists, setUserExists] = useState("")
    const [errormessage, setErrormessage] = useState("")

    const addFriend = async (e: any) => {
        e.preventDefault()
        const username = e.target.username.value
        if(username == "" || userExists != 'true')
            return
        const response = await fetch('/api/sendFriendRequest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(username)
        })
        const data = await response.json()
        if (response.ok)
            console.log(data)
    }

    return (
        <>
            <Dialog>
                <DialogTrigger className="text-sky-600">Add Friend</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Friend</DialogTitle>
                        <DialogDescription>

                        </DialogDescription>
                    </DialogHeader>
                    <form className="flex flex-col gap-5" onSubmit={addFriend}>
                        <CheckUserInput
                            className={userExists === "true" ? "focus-visible:ring-green-300" : "focus-visible:ring-red-300"}
                            setUserExists={setUserExists} />
                        <p className="pl-2 text-gray-600 text-sm">
                            {userExists == 'true' ? "" : userExists == 'invalid' ? "Invalid username" : "User does not exist"}
                        </p>
                        <Button type='submit'>Submit</Button>
                    </form >
                </DialogContent>
            </Dialog>
        </>
    )
}