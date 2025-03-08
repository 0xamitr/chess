import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function Newuser(){
    const session = cookies().get('pending_registration')
    console.log(session)
    if(!session)
        redirect('/')
    return(
        <div>
            <h1>New User</h1>
        </div>
    )
}