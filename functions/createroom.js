import Game from './game/game.js'
import { io } from "socket.io-client";
import { setGame } from './gamemanager.js'

export default function createRoom(e, setSocket, name, id) {
    e.preventDefault()
    const code = Math.floor(Math.random() * 1000);
    let socket = io("https://143.110.251.223:3005/")
    console.log(socket)
    console.log(id)
    console.log("Socket:", socket);
    socket.emit('code', code, id, name)
    socket.on('connection_established', (userIds, names) => {
        let index = userIds.indexOf(id)
        if(index == 0)
            index = 1
        else
            index = 0
        console.log(userIds, names)
        setGame(new Game(socket, code, false, name, id, names[index], userIds[index]));
        setSocket(socket);
    });
    return code
}