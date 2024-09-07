class Game {
    constructor(socket, code, turn) {
        this.socket = socket;
        this.moves = [];
        this.startTimer();
        this.onMove = null;
        this.code = code;
        this.acceptMove();
        this.turn = turn
        this.board = this.initializeBoard()
        this.turn = turn
    }

    initializeBoard() {
        return [
            ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
            ['.', '.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', '.', '.', '.'],
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
            ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
        ];
    }

    getTurn() {
        return this.turn
    }

    makeMove(from, to) {
        if(this.turn){
            const move = { from, to }
            const code = this.code
            console.log(code, "code")
            this.socket.emit('move', move, code)
        }
    }

    acceptMove() {
        console.log('acceptMove called');
        this.socket.on('move', (move) => {
            console.log(`Move Played: ${move.from} -> ${move.to}`);
            this.moves.push(move);
            this.applyMove(move)
            this.turn = !this.turn
        })
    }

    startTimer() {

    }

    getmoves() {
        return this.moves;
    }


    applyMove(move) {
        const from = move.from;
        const to = move.to;
        const fromRow = 8 - parseInt(from[1]);
        const fromCol = from.charCodeAt(0) - 'a'.charCodeAt(0);
        const toRow = 8 - parseInt(to[1]);
        const toCol = to.charCodeAt(0) - 'a'.charCodeAt(0);

        if (isNaN(fromRow) || isNaN(fromCol) || isNaN(toRow) || isNaN(toCol) ||
            fromRow < 0 || fromRow > 7 || fromCol < 0 || fromCol > 7 ||
            toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) {
            console.error('Invalid move coordinates');
            return;
        }

        const piece = this.board[fromRow][fromCol];
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = '.';
    }
}


export default Game;
