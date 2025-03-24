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
    const [friend, setFriend] = useState<[string, string, string]>(["", "", ""]);

    const findFriend = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault()
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const username = formData.get('username');
        fetch(`/api/user?username=${username}`, {
            method: 'GET',
        }).then((response) => {
            return response.json()
        }).then((data) => {
            if (session && session.data && session.data.user)
                setFriend([data.data[0]._id, session.data.user.name, session.data.user.id] as [string, string, string])
            else
                throw new Error("Session does not exist")
        }).catch((error) => {
            console.log(error)
        })
    }
    const addFriend = async () => {
        const response = await fetch('/api/sendFriendRequest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(friend)
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
                    <form className="flex flex-col gap-5" onSubmit={findFriend}>
                                <CheckUserInput />
                                <Button type='submit'>Submit</Button>
                                {friend[0] && <button type="button" onClick={() => addFriend()}>Add Friend</button>}
                            </form >
                </DialogContent>
            </Dialog>
        </>
    )
}