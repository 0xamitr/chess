import Game from './game/game.js'
import { io } from "socket.io-client";
import { setGame } from './gamemanager.js'

export default function createRoom(e, setSocket) {
    e.preventDefault()
    const code = Math.floor(Math.random() * 1000);
    let socket = io("http://localhost:3005/")
    console.log("Socket:", socket);
    socket.emit('code', code)
    socket.on('connection_established', () => {
        setGame(new Game(socket, code, false))
        setSocket(socket)
    })

    return code
}