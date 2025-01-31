import { io } from 'socket.io-client';
import { setGame } from './gamemanager';
import Game from './game/game';

let socket;

export const getSocket = (user) => {
    if (!socket) {
        console.log("holy shit", user)
        const userId = user.id;
        const name = user.name;
        console.log("wtf are you on about mate")
        const s = io(process.env.NEXT_PUBLIC_SERVER, { query: { id: userId, username: name} });
        socket = s;
        s.on('connection_established', (id, roomCode, opp) => {
            let oppid;
            let oppname;
            opp.map(e=>{
                if(e.id != userId){
                    oppid = e.id;
                    oppname = e.name;

                }
            })
            console.log("whatsup")
            if(id == userId){
                console.log("id is equal to userId")
                setGame(new Game(socket, roomCode, true, name, userId, oppname, oppid, true, null));
            }
            else{
                console.log("id is not equal to userId")
                setGame(new Game(socket, roomCode, false, name, userId, oppname, oppid, true, null));
            }
        });

        s.on('connect_error', (err) => {
            console.error('Connection Error:', err.message);
        });
        
        s.on('disconnect', (reason) => {
            console.log('Disconnected:', reason);
        });

        s.on(('roomnotfound'), () => {
            showPopup("Room not found. Please try again.");
        });
        
        s.on('roomfull', () => {
            throw new Error("Room is already full.");
        });
        

    }
    return socket;
};
