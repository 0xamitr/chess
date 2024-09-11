class Game {
    constructor(socket, code, isWhite) {
        this.socket = socket;
        this.moves = [];
        this.startTimer();
        this.onMove = null;
        this.code = code;
        this.acceptMove();
        this.turn = isWhite
        this.isWhite = isWhite
        this.board = this.initializeBoard()
        this.check = false

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
        return this.board[row][col];
    }

    isMoveValid(from, to) {
        if (!from)
            return false
        const fromRow = 8 - parseInt(from[1]);
        const fromCol = from.charCodeAt(0) - 'a'.charCodeAt(0);
        const toRow = 8 - parseInt(to[1]);
        const toCol = to.charCodeAt(0) - 'a'.charCodeAt(0);

        const piece = this.board[fromRow][fromCol];
        const targetPiece = this.board[toRow][toCol];

        if (piece === '.') return false;
        if (targetPiece != '.' && this.isSamePlayer(piece, targetPiece)) {
            return false;
        }
        
        console.log("hey", fromRow, fromCol, toRow, toCol, piece)

        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = '.';

        const check = this.isCheck();

        this.board[fromRow][fromCol] = piece;
        this.board[toRow][toCol] = targetPiece;

        if (check)
            return false

        switch (piece.toLowerCase()) {
            case 'p':
                return this.isValidPawnMove(fromRow, fromCol, toRow, toCol, this.isWhite, targetPiece);
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

    isMoveValidCp(from, to) {
        if (!from)
            return false
        const fromRow = 8 - parseInt(from[1]);
        const fromCol = from.charCodeAt(0) - 'a'.charCodeAt(0);
        const toRow = 8 - parseInt(to[1]);
        const toCol = to.charCodeAt(0) - 'a'.charCodeAt(0);

        const piece = this.board[fromRow][fromCol];
        const targetPiece = this.board[toRow][toCol];
        if (piece === '.') 
            return false;
        if (targetPiece != '.' && this.isSamePlayer(piece, targetPiece)) {
            return false;
        }

        switch (piece.toLowerCase()) {
            case 'p':
                return this.isValidPawnMove(fromRow, fromCol, toRow, toCol, this.isWhite, targetPiece);
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

    getValidMoves(from) {
        const validMoves = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const to = String.fromCharCode('a'.charCodeAt(0) + col) + (8 - row);
                if (this.isMoveValid(from, to)) {
                    validMoves.push(to);
                }
            }
        }
        return validMoves;
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
        console.log("works")
        if (Math.abs(fromRow - toRow) !== Math.abs(fromCol - toCol)) {
            return false;
        }
        
        const rowDirection = Math.sign(toRow - fromRow);
        const colDirection = Math.sign(toCol - fromCol);
        const steps = Math.abs(fromRow - toRow);
        
        for (let i = 1; i < steps; i++) {
            const currentRow = fromRow + i * rowDirection;
            const currentCol = fromCol + i * colDirection;
            if (this.board[currentRow][currentCol] !== '.') {
                console.log("heyaaa");
                return false;
            }
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


    isValidKingMove(fromRow, fromCol, toRow, toCol) {
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
        const fromRow = 8 - parseInt(from[1]);
        const fromCol = from.charCodeAt(0) - 'a'.charCodeAt(0);
        if (this.isWhite) {
            if (this.getPieceAt(fromRow, fromCol) != this.getPieceAt(fromRow, fromCol).toUpperCase())
                return
        }
        else {
            if (this.getPieceAt(fromRow, fromCol) == this.getPieceAt(fromRow, fromCol).toUpperCase())
                return
        }
        if (!this.isMoveValidCp(from, to))
            return
        if (this.turn) {
            const move = { from, to }
            const code = this.code
            this.socket.emit('move', move, code)
            this.check = false
        }
    }

    acceptMove() {
        console.log('acceptMove called');
        this.socket.on('move', (move) => {
            // console.log(`Move Played: ${move.from} -> ${move.to}`);
            this.moves.push(move);
            this.applyMove(move)
            this.turn = !this.turn
            this.isCheck(this.board)
        })
    }

    isCheck() {
        console.table(this.board);
        let kingRow, kingCol
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.isWhite) {
                    if (this.board[i][j] == 'K') {
                        kingRow = i
                        kingCol = j
                    }
                }
                else {
                    if (this.board[i][j] == 'k') {
                        kingRow = i
                        kingCol = j
                    }
                }
            }
        }

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.isMoveValidCp(String.fromCharCode(97 + j) + (8 - i), String.fromCharCode(97 + kingCol) + (8 - kingRow))) {
                    this.check = true
                    return true
                }
            }
        }
        console.log("yeah")
        return false
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
