import Game from '.game/game.js'
import { io } from "socket.io-client";

export default function createRoom(e){
    e.preventDefault()
    const code = Math.floor(Math.random() * 1000);
    let socket = io("http://localhost:3005/")
    console.log("Socket:", socket);
    socket.emit('code', code)
    socket.on('connection_established', ()=>{
        alert("connection")
        const game = Game(socket)
    })
    return code
  }