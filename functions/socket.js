import { io } from 'socket.io-client';
import { getGame, removeGame, setGame } from './gamemanager';
import Game from './game/game';

let socket;

export const getSocket = (user, showPopup, router) => {
    if (!socket) {
        const userId = user.id;
        const name = user.name;
        const s = io(process.env.NEXT_PUBLIC_SERVER, { query: { id: userId, username: name } });
        socket = s;
        s.on('gameover', ()=>{
            console.log("shut the fuck up man timererof your bullshit")
            alert("hafdhskfjhsadjkfhsdjkfhsjkdfhsdjkfhasdkhfdsjkfhsdjakhfsjdkahf")
            removeGame();
            router.push('/')
            router.refresh()
        })
        s.on('connection_established', (id, roomCode, opp) => {
            let oppid;
            let oppname;
            opp.map(e => {
                if (e.id != userId) {
                    oppid = e.id;
                    oppname = e.name;

                }
            })
            if(getGame()){
                return showPopup("You are already in a game", "error", "top-right");
            }
            if (id == userId) {
                const g = new Game(socket, roomCode, true, name, userId, oppname, oppid, true, null)
                setGame(g);
                router.push('/')
                router.refresh()
            }
            else {
                const g = new Game(socket, roomCode, false, name, userId, oppname, oppid, true, null)
                setGame(g);
                router.push('/')
                router.refresh()
            }
        });

        s.on('game-update', (gameState) => {
            let refreshsheduled = false;
            let game = getGame();
            console.log(game)
            if (!game) {
                refreshsheduled = true;
                if(userId == gameState.player1Id)
                    game = new Game(socket, gameState.roomCode, true, gameState.player1Name, gameState.player1Id, gameState.player2Name, gameState.player2Id, true, null);
                else
                    game = new Game(socket, gameState.roomCode, false, gameState.player2Name, gameState.player2Id, gameState.player1Name, gameState.player1Id, true, null);
                setGame(game);
                for (let i = 0; i < gameState.movelist.length; i++) {
                    if (gameState.movelist[i].length > 1) {
                        for (let j = 0; j < gameState.movelist[i].length; j++) {
                            game.applyMove({ from: gameState.movelist[i][j].from, to: gameState.movelist[i][j].to });
                        }
                    }
                    else
                        game.applyMove({ from: gameState.movelist[i].from, to: gameState.movelist[i].to });
                    game.history.push(JSON.parse(JSON.stringify(game.board)))
                }
            }
            else {
                game.history.push(JSON.parse(JSON.stringify(gameState.board)));
            }
            game.board = gameState.board;
            if (game.isWhite){  
                console.log("white", gameState.whiteleftrookMove, gameState.whiterightrookMove, gameState.whitekingMove)
                game.kingMove = gameState.whitekingMove,
                game.leftrookMove = gameState.whiteleftrookMove,
                game.rightrookMove = gameState.whiterightrookMove,
                game.turn = gameState.turn;
            }
            else{
                game.kingMove = gameState.blackkingMove,
                game.leftrookMove = gameState.blackleftrookMove,
                game.rightrookMove = gameState.blackrightrookMove,
                game.turn = !gameState.turn;
            }

            game.enPassant = gameState.enPassant
            game.whitetime = gameState.whitetime
            game.lastwhitetime = gameState.lastwhitetime
            game.lastblacktime = gameState.lastblacktime
            game.blacktime = gameState.blacktime
            game.tempmove = gameState.tempmove;
            game.totalmoves = gameState.totalmoves;
            game.moves = gameState.moves;
            game.movelist = gameState.movelist;
            game.pgn = gameState.pgn;
            if(refreshsheduled){
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
