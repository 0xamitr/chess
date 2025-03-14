"use client";

import { useState } from "react";
import CustomForm from "../Form/form";
import CustomInput from "../Input/input";
import { useSession } from "next-auth/react";
import { usePopup } from "../context/PopupContext";

export default function SendFriendRequest() {
    const session = useSession()
    const { showPopup } = usePopup();
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
            showPopup("user does not exist", "message", "top-right")
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
        else
            showPopup(data.data, "message", "top-right")
    }

    return (
        <>
            <CustomForm onSubmit={findFriend}>
                <h2>Add Friend</h2>
                <CustomInput
                    inputheading="Username"
                    type="text"
                    name="username"
                    required="required"
                    minLength={4}
                    maxLength={20}
                />
                <input type='submit' />
                {friend[0] && <button type="button" onClick={() => addFriend()}>Add Friend</button>}
            </CustomForm >
        </>
    )
}