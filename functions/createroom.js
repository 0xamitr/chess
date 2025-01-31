import Game from './game/game.js'
import { io } from "socket.io-client";
import { setGame } from './gamemanager.js'
import { getSocket } from './socket.js';

export default function createRoom(e, name, id) {
    e.preventDefault()
    const code = Math.floor(Math.random() * 1000);
    const socket = getSocket()
    socket.emit('code', code, id, name)
    return code
}