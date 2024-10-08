import Game from './game/game.js'
import { io } from "socket.io-client";
import { setGame } from './gamemanager.js'

export default function createRoom(e, setSocket, name, id, getPromotion) {
    e.preventDefault()
    const code = Math.floor(Math.random() * 1000);
    let socket = io(process.env.NEXT_PUBLIC_SERVER)
    socket.on('connect_error', (err) => {
        console.error('Connection Error:', err.message);
    });
    
    socket.on('disconnect', (reason) => {
        console.log('Disconnected:', reason);
    });
    
    socket.emit('code', code, id, name)
    socket.on('connection_established', (userIds, names) => {
        let index = userIds.indexOf(id)
        if(index == 0)
            index = 1
        else
            index = 0
        setGame(new Game(socket, code, false, name, id, names[index], userIds[index], getPromotion));
        setSocket(socket);
    });
    return code
}