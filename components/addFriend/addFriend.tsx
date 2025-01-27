import { useState } from "react";
import CustomForm from "../Form/form";
import CustomInput from "../Input/input";
import { useSession } from "next-auth/react";

export default function AddFriend(){
    const session = useSession()
    const [friend, setFriend] = useState<[string, string, string]>(["", "", ""]);
    const findFriend = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault()
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const username = formData.get('username');
        
        fetch(`/api/user?username=${username}`, {
            method: 'GET',
        }).then((response)=>{
            return response.json()
        }).then((data)=>{
            console.log(data.data[0])
            if(session && session.data && session.data.user )
                setFriend([data.data[0]._id, session.data.user.name, session.data.user.id] as [string, string, string])
            else
                throw new Error("Session does not exist")
        }).catch((error)=>{
            console.log(error)
            throw new Error("user does not exist")
        })
    }
    const addFriend = (): void => {
        fetch('/api/addfriend', {
            method: 'POST',
            body: JSON.stringify(friend)
        }).then((response)=>{
            return response.json()
        }).then((data)=>{
            console.log(data)
        }).catch((error)=>{
            console.log(error)
        })
    }
    return(
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
            {friend[0] && <button onClick={() => addFriend()}>Add Friend</button>}
        </CustomForm >
        </>
    )
}