import { removeGame } from "../gamemanager";

class Game {
    constructor(socket, code, isWhite, name, id, opponentName, opponentId) {
        this.socket = socket;
        this.moves = [];
        this.time = 600;
        this.timer = null;
        this.starttime = null;
        this.startTimer();
        this.onMove = null;
        this.code = code;
        this.acceptMove();
        this.listenEndGame();
        this.turn = isWhite;
        this.isWhite = isWhite;
        this.board = this.initializeBoard();
        this.check = false;
        this.history = [JSON.parse(JSON.stringify(this.board))];
        this.totalmoves = 0;
        this.tempmove = 0;
        this.name = name;
        this.id = id
        this.opponentName = opponentName
        this.opponentId = opponentId
        this.kingMove = false
        this.leftrookMove = false
        this.rightrookMove = false
    }

    startTimer() {
        this.starttime = Date.now();
        this.timer = setInterval(() => {
            if (this.turn) {
                const currentTime = Date.now();
                const elapsed = (currentTime - this.starttime) / 1000; // Time in seconds

                this.time -= elapsed;

                if (this.time <= 0) {
                    this.endGame();
                    clearInterval(this.timer);
                }
                this.starttime = currentTime;
            }
            else{
                this.starttime = Date.now(); // Reset for accurate tracking
    
            }
        }, 100);
    }

    getCoords(move) {
        const from = move.from;
        const to = move.to;
        const fromRow = 8 - parseInt(from[1]);
        const fromCol = from.charCodeAt(0) - 'a'.charCodeAt(0);
        const toRow = 8 - parseInt(to[1]);
        const toCol = to.charCodeAt(0) - 'a'.charCodeAt(0);

        return { from: [fromRow, fromCol], to: [toRow, toCol] }
    }

    movefromCoords(coords) {

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

        if (this.isWhite && this.board[fromRow][fromCol] != this.board[fromRow][fromCol].toUpperCase())
            return false

        if (!this.isWhite && this.board[fromRow][fromCol] != this.board[fromRow][fromCol].toLowerCase())
            return false

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
        if (targetPiece != '.' && this.isSamePlayer(piece, targetPiece))
            return false;
        let isWhite
        if (piece == 'p')
            isWhite = false
        else if (piece == 'P')
            isWhite = true

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
        const direction = isWhite ? -1 : 1;Date
        if (fromCol === toCol) {
            if (target === '.') {
                if (fromRow + direction === toRow) {
                    return true;
                } else if ((fromRow === 6 && toRow === 4 && isWhite && this.board[fromRow - 1][fromCol] == '.') || (fromRow === 1 && toRow === 3 && !isWhite && this.board[fromRow + 1][fromCol] == '.')) {
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
        if (this.isWhite && this.board[fromRow][fromCol] != 'K')
            return false
        if (!this.isWhite && this.board[fromRow][fromCol] != 'k')
            return false
        if (this.isWhite && this.kingMove == false) {
            if (fromRow == toRow && fromCol == toCol + 2) {
                if (this.board[fromRow][fromCol - 1] != '.' || this.board[fromRow][fromCol - 2] != '.')
                    return false
                if (this.rightrookMove == true)
                    return false
                return true
            }
            else if (fromRow == toRow && fromCol == toCol - 2) {
                console.log(fromRow, fromCol, toRow, toCol)
                if (this.board[fromRow][fromCol + 1] != '.' || this.board[fromRow][fromCol + 2] != '.')
                    return false
                if (this.rightrookMove == true)
                    return false
                return true
            }
        }
        else if (this.kingMove == false) {
            if (fromRow == toRow && fromCol == toCol + 2) {
                if (this.board[fromRow][fromCol - 1] != '.' || this.board[fromRow][fromCol - 2] != '.')
                    return false
                if (this.leftrookMove == true)
                    return false
                return true
            }
            else if (fromRow == toRow && fromCol == toCol - 2) {
                if (this.board[fromRow][fromCol + 1] != '.' || this.board[fromRow][fromCol + 2] != '.')
                    return false
                if (this.rightrookMove == true)
                    return false
                return true
            }
        }
        if (Math.abs(Math.abs(fromRow - toRow) <= 1 && Math.abs(fromCol - toCol) <= 1)) {
            return Math.abs(fromRow - toRow) <= 1 && Math.abs(fromCol - toCol) <= 1;
        }
    }

    isValidKnightMove(fromRow, fromCol, toRow, toCol) {
        return (Math.abs(fromRow - toRow) === 2 && Math.abs(fromCol - toCol) === 1) ||
            (Math.abs(fromRow - toRow) === 1 && Math.abs(fromCol - toCol) === 2);
    }

    getTurn() {
        return this.turn
    }

    makeMove(from, to) {
        if (!this.turn)
            return false
        const fromRow = 8 - parseInt(from[1]);
        const fromCol = from.charCodeAt(0) - 'a'.charCodeAt(0);
        const toCol = to.charCodeAt(0) - 'a'.charCodeAt(0);
        if (this.isWhite) {
            if (this.getPieceAt(fromRow, fromCol) != this.getPieceAt(fromRow, fromCol).toUpperCase())
                return false
        }
        else {
            if (this.getPieceAt(fromRow, fromCol) == this.getPieceAt(fromRow, fromCol).toUpperCase())
                return false
        }
        if (!this.isMoveValid(from, to))
            return false

        let move = { from, to }
        const code = this.code

        if (this.board[fromRow][fromCol] == 'K' || this.board[fromRow][fromCol] == 'k') {
            if (this.isWhite) {
                if (this.kingMove == false) {
                    if (toCol > fromCol) {
                        let fromrook = String.fromCharCode(97 + 7) + (1);
                        let torook = String.fromCharCode(97 + 5) + (1);
                        move = [{ from, to }, { from: fromrook, to: torook }]
                        this.socket.emit('move', move, code)
                    }
                    else if (fromCol > toCol) {
                        let fromrook = String.fromCharCode(97 + 0) + (1);
                        let torook = String.fromCharCode(97 + 3) + (1);
                        move = [{ from, to }, { from: fromrook, to: torook }]
                        this.socket.emit('move', move, code)
                    }
                }
                else
                    this.socket.emit('move', move, code)
            }
            else {
                if (this.kingMove == false) {
                    if (toCol > fromCol) {
                        let fromrook = String.fromCharCode(97 + 7) + (8);
                        let torook = String.fromCharCode(97 + 5) + (8);
                        move = [{ from, to }, { from: fromrook, to: torook }]
                        this.socket.emit('move', move, code)
                    }
                    else if (fromCol > toCol) {
                        let fromrook = String.fromCharCode(97 + 0) + (8);
                        let torook = String.fromCharCode(97 + 3) + (8);
                        move = [{ from, to }, { from: fromrook, to: torook }]
                        this.socket.emit('move', move, code)
                    }
                }
                else
                    this.socket.emit('move', move, code)
            }
            this.kingMove = true
        }
        else {
            this.socket.emit('move', move, code)
            this.check = false
        }
        return true
    }

    getDisambiguation(coords) {
        const piecetoMove = this.board[coords.from[0]][coords.from[1]]
        const to = String.fromCharCode(97 + coords.to[1]) + (8 - coords.to[0]);
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.board[i][j] == piecetoMove) {
                    if (i == coords.from[0] && j == coords.from[1])
                        continue
                    if (this.isMoveValidCp(String.fromCharCode(97 + j) + (8 - i), to)) {
                        let k = 0
                        for (let file = 0; file < 8; file++) {
                            if (this.board[coords.from[0]][file] == piecetoMove)
                                k++
                        }
                        if (k > 1)
                            return String.fromCharCode(97 + coords.from[1])

                        k = 0
                        for (let rank = 0; rank < 8; rank++) {
                            if (this.board[rank][coords.from[1]] == piecetoMove)
                                k++
                        }
                        if (k > 1)
                            return 8 - coords.from[0]
                        let out = String.fromCharCode(97 + coords.from[1])
                        out += 8 - coords.from[0]
                        return out

                    }
                }
            }
        }
        return ""
    }

    pushMove(move) {
        const coords = this.getCoords(move)
        console.log(coords.from)
        const pieceMoved = this.board[coords.from[0]][coords.from[1]].toUpperCase()
        const destinationPiece = this.board[coords.to[0]][coords.to[1]]
        let moveMade = ""
        if (pieceMoved != 'P')
            moveMade += pieceMoved
        const desambiguation = this.getDisambiguation(coords)
        if (desambiguation)
            moveMade += desambiguation
        if (destinationPiece != '.')
            moveMade += 'x'
        moveMade += move.to
        this.moves.push(moveMade)
    }

    acceptMove() {
        this.socket.on('move', (move) => {
            console.log(move)
            if (Array.isArray(move)) {
                for (let i = 0; i < move.length; i++) {
                    this.applyMove(move[i])
                    if (this.isCheck())
                        this.checkCheckmate()
                }
                this.pushMove(move[0])
                this.turn = !this.turn
                if(this.turn)
                    this.startTimer = Date.now()
                this.totalmoves++
                this.tempmove = this.totalmoves
                this.history.push(JSON.parse(JSON.stringify(this.board)))
            }
            else {
                this.pushMove(move)
                this.applyMove(move)
                this.history.push(JSON.parse(JSON.stringify(this.board)))
                console.log(this.history)
                this.turn = !this.turn
                if(this.turn)
                    this.startTimer = Date.now()
                this.totalmoves++
                this.tempmove = this.totalmoves
                if (this.isCheck()) {
                    this.checkCheckmate()
                }
            }
        })
    }

    isCheck() {
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
                    console.log("yo")
                    this.check = true
                    return true
                }
            }
        }
        return false
    }

    checkCheckmate() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                // Check for white pieces
                if (this.isWhite) {
                    if (this.board[i][j] === '.' || this.board[i][j] !== this.board[i][j].toUpperCase()) {
                        continue; // Skip to the next iteration if it's not a white piece
                    }
                    let from = String.fromCharCode(97 + j) + (8 - i);
                    const validMoves = this.getValidMoves(from);
                    if (validMoves.length > 0) {
                        return false; // If a valid move exists, it's not checkmate
                    }
                }
                // Check for black pieces
                else {
                    if (this.board[i][j] === '.' || this.board[i][j] !== this.board[i][j].toLowerCase()) {
                        continue; // Skip to the next iteration if it's not a black piece
                    }
                    let from = String.fromCharCode(97 + j) + (8 - i);
                    const validMoves = this.getValidMoves(from);
                    if (validMoves.length > 0) {
                        return false; // If a valid move exists, it's not checkmate
                    }
                }
            }
        }
        alert("Checkmate! YOU LOSE");
        this.endGame()
        return true; // Return true if no valid moves found, meaning it's checkmate
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

    listenEndGame() {
        this.socket.on('endGame', () => {
            clearInterval(this.timer)
            removeGame()
            console.log("Game Over")
            this.socket.disconnect()

        })
    }

    endGame() {
        uploadgame(this.moves, this.code)
        this.socket.emit('endGame', this.code)
    }

}

export default Game;