import Game from './game/game.js'
import { io } from "socket.io-client";
import { setGame } from './gamemanager.js'


export default function joinRoom(e, setSocket, name, id) {
    e.preventDefault();
    const socket = io("http://143.110.251.223:3005/")
    console.log(socket);
    const val = Number(e.target.num.value);
    socket.emit('submit', val, id, name);

    socket.on('roomfull', () => {
        alert("roomfull");
    });

    socket.on('connection_established', (userIds, names) => {
        let index = userIds.indexOf(id)
        if(index == 0)
            index = 1
        else
            index = 0
        console.log(userIds, names)
        setGame(new Game(socket, val, true, name, id, names[index], userIds[index]));
        setSocket(socket);
    });
}
