import { io } from 'socket.io-client';
import { setGame } from './gamemanager';
import Game from './game/game';

let socket;

export const getSocket = (userId) => {
    if (!socket) {
        console.log("wtf are you on about mate")
        const s = io(process.env.NEXT_PUBLIC_SERVER, { query: { id: userId} });
        socket = s;
        s.on('connection_established', (id, roomCode) => {
            console.log("whatsup")
            if(id == userId){
                console.log("id is equal to userId")
                setGame(new Game(socket, roomCode, true, "name", "id", "names[index]", "userIds[index]", true, null));
            }
            else{
                console.log("id is not equal to userId")
                setGame(new Game(socket, roomCode, false, "name", "id", "names[index]", "userIds[index]", true, null));
            }
        });
        
    }
    return socket;
};
