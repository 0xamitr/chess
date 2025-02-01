import { io } from 'socket.io-client';
import { setGame } from './gamemanager';
import Game from './game/game';

let socket;

export const getSocket = (user, showPopup, router) => {
    if (!socket) {
        const userId = user.id;
        const name = user.name;
        const s = io(process.env.NEXT_PUBLIC_SERVER, { query: { id: userId, username: name } });
        socket = s;
        s.on('connection_established', (id, roomCode, opp) => {
            let oppid;
            let oppname;
            opp.map(e => {
                if (e.id != userId) {
                    oppid = e.id;
                    oppname = e.name;

                }
            })
            if (id == userId) {
                setGame(new Game(socket, roomCode, true, name, userId, oppname, oppid, true, null));
                router.push('/')
                router.refresh()
            }
            else {
                setGame(new Game(socket, roomCode, false, name, userId, oppname, oppid, true, null));
                router.push('/')
                router.refresh()
            }
        });

        s.on('connect_error', (err) => {
            console.error('Connection Error:', err.message);
        });

        s.on('disconnect', (reason) => {
            console.log('Disconnected:', reason);
        });

        s.on(('roomnotfound'), () => {
            showPopup("Room not found. Please try again", "error", "top-right");
        });

        s.on('roomfull', () => {
            showPopup("Room is already full", "error", "top-right");
            ;
        });
        s.on('challenge-received', (fromId, name) => {
            showPopup("Challenge received from " + name, "challenge", "top-right", fromId);
        })
    }
    return socket;
};
