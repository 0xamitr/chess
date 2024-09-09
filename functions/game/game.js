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

    getPieceAt(row, col) {
        if (row < 0 || row >= 8 || col < 0 || col >= 8) {
            return undefined; // Or some other value indicating invalid access
        }
        return this.board[row][col];
    }

    isMoveValid(from, to) {
        if(!from)
            return false
        const fromRow = 8 - parseInt(from[1]);
        const fromCol = from.charCodeAt(0) - 'a'.charCodeAt(0);
        const toRow = 8 - parseInt(to[1]);
        const toCol = to.charCodeAt(0) - 'a'.charCodeAt(0);
        console.log("test", fromRow, fromCol, toRow, toCol)
        console.log(this.board)
        const piece = this.board[fromRow][fromCol];
        const targetPiece = this.board[toRow][toCol];
        if (piece === '.') return false; // No piece to move
        if (targetPiece != '.' && this.isSamePlayer(piece, targetPiece)) {
            return false; // Invalid move, cannot capture own piece
        }

        const isWhite = piece === piece.toUpperCase();
        if ((this.turn && !isWhite) || (!this.turn && isWhite)) return false; // Wrong turn

        switch (piece.toLowerCase()) {
            case 'p':
                return this.isValidPawnMove(fromRow, fromCol, toRow, toCol, isWhite, targetPiece);
            case 'r':
                return this.isValidRookMove(fromRow, fromCol, toRow, toCol);
            case 'n':
                return this.isValidKnightMove(fromRow, fromCol, toRow, toCol);
            case 'b':
                return this.isValidBishopMove(fromRow, fromCol, toRow, toCol);
            case 'q':
                return this.isValidQueenMove(fromRow, fromCol, toRow, toCol);
            case 'k':
                return this.isValidKingMove(fromRow, fromCol, toRow, toCol);
            default:
                return false;
        }
    }


    isSamePlayer(piece1, piece2) {
        if (piece1 == piece1.toUpperCase() && piece2 == piece2.toUpperCase())
            return true;
        if (piece1 == piece1.toLowerCase() && piece2 == piece2.toLowerCase())
            return true;
        return false
    }

    isValidPawnMove(fromRow, fromCol, toRow, toCol, isWhite, target) {
        const direction = isWhite ? -1 : 1;
        if (fromCol === toCol) {
            if (target === '.') {
                if (fromRow + direction === toRow) {
                    return true;
                } else if ((fromRow === 6 && toRow === 4 && isWhite) || (fromRow === 1 && toRow === 3 && !isWhite)) {
                    return true;
                }
            }
        } else {
            if (Math.abs(fromCol - toCol) === 1 && fromRow + direction === toRow) {
                return target !== '.' && (isWhite !== (target === target.toUpperCase()));
            }
        }
        return false;
    }

    isValidBishopMove(fromRow, fromCol, toRow, toCol) {
        if (Math.abs(fromRow - toRow) !== Math.abs(fromCol - toCol))
            return false;
        for (let i = 1; i < fromRow - toRow; i++) {
            if (this.board[fromRow + i * Math.sign(toRow - fromRow)][fromCol + i * Math.sign(toCol - fromCol)] !== '.')
                return false;
        }
        return true;
    }

    isValidRookMove(fromRow, fromCol, toRow, toCol) {
        if (fromRow !== toRow && fromCol !== toCol)
            return false;
        if (fromRow === toRow) {
            for (let i = Math.min(fromCol, toCol) + 1; i < Math.max(fromCol, toCol); i++) {
                if (this.board[fromRow][i] !== '.')
                    return false;
            }
        } else {
            for (let i = Math.min(fromRow, toRow) + 1; i < Math.max(fromRow, toRow); i++) {
                if (this.board[i][fromCol] !== '.')
                    return false;
            }
        }
        return true;
    }


    isValidQueenMove(fromRow, fromCol, toRow, toCol) {
        return this.isValidRookMove(fromRow, fromCol, toRow, toCol) || this.isValidBishopMove(fromRow, fromCol, toRow, toCol);
    }


    isValidKingMove() {
        return Math.abs(fromRow - toRow) <= 1 && Math.abs(fromCol - toCol) <= 1;
    }

    isValidKnightMove(fromRow, fromCol, toRow, toCol) {
        return (Math.abs(fromRow - toRow) === 2 && Math.abs(fromCol - toCol) === 1) ||
            (Math.abs(fromRow - toRow) === 1 && Math.abs(fromCol - toCol) === 2);
    }


    getTurn() {
        return this.turn
    }

    makeMove(from, to) {
        if (this.turn) {
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
