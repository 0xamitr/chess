import { getSocket } from './socket.js';

export default function joinRoom(e, name, id) {
    const socket = getSocket()
    e.preventDefault();
    const val = Number(e.target.num.value);
    socket.emit('submit', val, id, name);
}