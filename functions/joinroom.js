import Game from './game/game.js'
import { io } from "socket.io-client";
import { setGame } from './gamemanager.js'
import { getSocket } from './socket.js';

export default function joinRoom(e, name, id) {
    const socket = getSocket()
    e.preventDefault();
    const val = Number(e.target.num.value);
    socket.emit('submit', val, id, name);
}