import { io } from "socket.io-client";

export default function joinRoom(e){
    e.preventDefault()
    let socket = io("http://localhost:3005/")
    console.log(socket)
    const val = Number(e.target.num.value)
    console.log(typeof(val))
    socket.emit('submit', val);
    socket.on('roomfull', ()=>{
        alert("roomfull")
    })
    socket.on('connection_established', ()=>{
        alert("connection")
    })  
}