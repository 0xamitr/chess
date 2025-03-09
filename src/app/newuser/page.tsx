import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import CreateNewuser from "./createNewuser";

export default function Newuser(){
    const session = cookies().get('pending_registration')
    console.log(session)
    if(!session)
        redirect('/')

    return(
        <div>
            <h1>New User</h1>
            {/* <CreateNewuser email={session.value}/> */}
        </div>
    )
}