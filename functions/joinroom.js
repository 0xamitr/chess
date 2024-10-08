import Game from './game/game.js'
import { io } from "socket.io-client";
import { setGame } from './gamemanager.js'

export default function joinRoom(e, setSocket, name, id, showPopup, getPromotion) {
    e.preventDefault();
    let socket = io(process.env.NEXT_PUBLIC_SERVER);
    const val = Number(e.target.num.value);
    socket.emit('submit', val, id, name);
    socket.on('connect_error', (err) => {
        console.error('Connection Error:', err.message);
    });
    
    socket.on('disconnect', (reason) => {
        console.log('Disconnected:', reason);
    });

    socket.on(('roomnotfound'), () => {
        showPopup("Room not found. Please try again.");
    });
    
    socket.on('roomfull', () => {
        throw new Error("Room is already full.");

    });

    socket.on('connection_established', (userIds, names) => {
        let index = userIds.indexOf(id)
        if(index == 0)
            index = 1
        else
            index = 0
        setGame(new Game(socket, val, true, name, id, names[index], userIds[index], getPromotion));
        setSocket(socket);
    });
}