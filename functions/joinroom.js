import Game from './game/game.js'
import { io } from "socket.io-client";
import { setGame } from './gamemanager.js'


export default function joinRoom(e, setSocket) {
    e.preventDefault();
    const socket = io("http://localhost:3005/");
    console.log(socket);
    const val = Number(e.target.num.value);

    socket.emit('submit', val);

    socket.on('roomfull', () => {
        alert("roomfull");
    });

    socket.on('connection_established', () => {
        const game = new Game(socket, val, true);
        setGame(game);
        setSocket(socket);
    });
}
