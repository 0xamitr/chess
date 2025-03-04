import React, { useState, useEffect, useRef } from 'react';
import styles from "./chessboard.module.css";
import getChessPiece from "../../functions/getChessPiece";
import { getGame } from '../../functions/gamemanager';

export default function ChessBoard({ color1, color2, offGame }) {
    let game
    if (!offGame)
        game = getGame()
    else
        game = offGame
    const [boardstate, setBoardState] = useState([
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        ['.', '.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.', '.'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
    ]);

    const onMove = (from, to) => {
        if (game) {
            const moveMade = game.makeMove(from, to);
            if (moveMade) {
                if (game.isWhite) {
                    setBoardState([...game.board.map((row) => [...row])]); // Ensure deep copy of the board
                    return true
                } else {
                    setBoardState(
                        [...game.board.map((row) => [...row].reverse())].reverse() // Reverse for black side
                    );
                    return true
                }
            } else {
                return false;
            }
        }
        else
            return false
    };

    useEffect(() => {
        if (game) {
            if (game.isWhite) {
                setBoardState([...game.board.map((row) => [...row])]); // Deep copy
            } else {
                setBoardState(
                    [...game.board.map((row) => [...row].reverse())].reverse() // Reverse for black
                );
            }
            if (game.live) {
                game.socket.on('move', () => {
                    if (game.isWhite) {
                        setBoardState([...game.board.map((row) => [...row])]); // Deep copy
                    } else {
                        setBoardState(
                            [...game.board.map((row) => [...row].reverse())].reverse() // Reverse for black
                        );
                    }
                });
            }
        }
    }, [game && game.board]);

    let isWhite
    if (game)
        isWhite = game.isWhite
    else
        isWhite = true

    const boardRef = useRef([]); // Array to store refs for each cell
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [validMoves, setValidMoves] = useState([]);
    const [mytime, setMytime] = useState(null)
    const [opptime, setOpptime] = useState(null)
    const [fromto, setFromto] = useState(null)


    // Initialize refs dynamically for an 8x8 chessboard
    const initializeRefs = () => {
        for (let i = 0; i < 8; i++) {
            boardRef.current[i] = [];
            for (let j = 0; j < 8; j++) {
                boardRef.current[i][j] = React.createRef();
            }
        }
    };

    initializeRefs();

    const handlePromotion = (e) => {
        let move = [{ from: fromto.from, to: fromto.to }, { promotion: '' }]
        if (game.isWhite) {
            if (e.target.innerText === '♕')
                move[1].promotion = 'Q'
            else if (e.target.innerText === '♗')
                move[1].promotion = 'B'
            else if (e.target.innerText === '♖')
                move[1].promotion = 'R'
            else if (e.target.innerText === '♘')
                move[1].promotion = 'N'
        }
        else {
            if (e.target.innerText === '♛')
                move[1].promotion = 'q'
            else if (e.target.innerText === '♝')
                move[1].promotion = 'b'
            else if (e.target.innerText === '♜')
                move[1].promotion = 'r'
            else if (e.target.innerText === '♞')
                move[1].promotion = 'n'
        }
        let toRow
        let toCol
        if (game.isWhite) {
            toRow = 8 - parseInt(fromto.to[1]);
            toCol = fromto.to.charCodeAt(0) - 'a'.charCodeAt(0);
        }
        else {
            toRow = parseInt(fromto.to[1]) - 1;
            toCol = 'h'.charCodeAt(0) - fromto.to.charCodeAt(0);
        }
        console.log(toRow, toCol)
        console.log("what the hello going on")
        const promotion = boardRef.current[toRow][toCol].current;
        promotion.style.display = 'none'
        console.log(move)
        game.socket.emit('move', move, game.code);
    }

    const getPromotion = (from, to) => {
        let toRow
        let toCol
        if (game.isWhite) {
            toRow = 8 - parseInt(to[1]);
            toCol = to.charCodeAt(0) - 'a'.charCodeAt(0);
        }
        else {
            toRow = parseInt(to[1]) - 1;
            toCol = 'h'.charCodeAt(0) - to.charCodeAt(0);
        }
        console.log(toRow, toCol)
        console.log(boardRef)
        const promotion = boardRef.current[toRow][toCol].current;
        console.log(promotion)
        promotion.style.display = 'flex'
        setFromto({ from: from, to: to })
    }

    const handleit = (e) => {
        if (e.key == 'ArrowLeft')
            handleGoback()
        else if (e.key == 'ArrowRight')
            handleGofront()
    }

    useEffect(() => {
        if (game) {
            document.addEventListener("keydown", handleit)
            game.getPromotion = getPromotion;
            const interval = setInterval(() => {
                if (game.isWhite) {
                    setMytime(game.whitetime);
                    setOpptime(game.blacktime);
                }
                else {
                    setMytime(game.blacktime);
                    setOpptime(game.whitetime);
                }
                if (game.time < 1) {
                    clearInterval(interval);
                }
            }, 1000);
            if (game.isWhite)
                setBoardState(game.history[game.tempmove])
            else
                setBoardState(game.history[game.tempmove].map(row => row.slice().reverse()).reverse())
        }
        return () => {
            document.removeEventListener("keydown", handleit)
        }
    }, [game])

    const ImproveTime = (time) => {
        const newtime = Math.floor(time)
        let minutes = Math.floor(newtime / 60);
        let seconds = newtime % 60;
        return `${minutes} : ${seconds}`;
    };

    const handleSquareClick = (e, i, j) => {
        if (game.live) {
            if (game.isWhite) {
                game.tempmove = game.totalmoves
                setBoardState(game.history[game.tempmove])
            }
            else {
                game.tempmove = game.totalmoves
                setBoardState(game.history[game.tempmove].map(row => row.slice().reverse()).reverse())
            }
        }
        // Adjust coordinates for black's perspective
        let adjustedI = isWhite ? i : 7 - i;
        let adjustedJ = isWhite ? j : 7 - j;

        if (selectedPiece) {
            if (!game) {
                setSelectedPiece(boardstate[i][j])
                setSelectedPosition({ i: i, j: j });
                return
            }
            // If a piece is already selected, attempt a move
            let from
            if (isWhite)
                from = String.fromCharCode(97 + selectedPosition.j) + (8 - selectedPosition.i);
            else
                from = String.fromCharCode(97 + 7 - selectedPosition.j) + (8 - 7 + selectedPosition.i);

            let to = String.fromCharCode(97 + adjustedJ) + (8 - adjustedI);
            if (!onMove(from, to)) {
                setSelectedPiece(boardstate[i][j])
                setSelectedPosition({ i: i, j: j });
                const moves = game.getValidMoves(String.fromCharCode(97 + adjustedJ) + (8 - adjustedI));
                setValidMoves(
                    moves.map(move => {
                        const [file, rank] = move.split('');
                        const moveI = 8 - parseInt(rank);
                        const moveJ = file.charCodeAt(0) - 97;
                        return isWhite ? { i: moveI, j: moveJ } : { i: 7 - moveI, j: 7 - moveJ };
                    })
                );
            } // Execute the move
            else {
                setSelectedPiece(null);
                setSelectedPosition(null);
                setValidMoves([]);
            }
        } else {
            // Selecting a piece, so adjust the coordinates for black's perspective

            // Set the selected piece and its position
            setSelectedPiece(boardstate[i][j])
            setSelectedPosition({ i: i, j: j });
            if (!game)
                return

            console.log("game", game)
            const moves = game.getValidMoves(String.fromCharCode(97 + adjustedJ) + (8 - adjustedI));
            // Adjust valid moves for the black perspective
            setValidMoves(
                moves.map(move => {
                    const [file, rank] = move.split('');
                    const moveI = 8 - parseInt(rank);
                    const moveJ = file.charCodeAt(0) - 97;
                    return isWhite ? { i: moveI, j: moveJ } : { i: 7 - moveI, j: 7 - moveJ };
                })
            );
        }
    };

    const handleGoback = () => {
        if (game.tempmove > 0)
            game.tempmove--
        if (game.isWhite)
            setBoardState(game.history[game.tempmove])
        else
            setBoardState(game.history[game.tempmove].map(row => row.slice().reverse()).reverse())
    }

    const handleGofront = () => {
        if (game.tempmove < game.totalmoves)
            game.tempmove++
        if (game.isWhite)
            setBoardState(game.history[game.tempmove])
        else
            setBoardState(game.history[game.tempmove].map(row => row.slice().reverse()).reverse())
    }

    // const handleOnMouseDown = (e, i, j) => {
    //     setSelectedPiece(boardstate[i][j])
    //     setSelectedPosition({ i: i, j: j });

    //     const moves = game.getValidMoves(String.fromCharCode(97 + 7 - j) + (8 - 7 + i));
    //     // Adjust valid moves for the black perspective
    //     setValidMoves(
    //         moves.map(move => {
    //             const [file, rank] = move.split('');
    //             const moveI = 8 - parseInt(rank);
    //             const moveJ = file.charCodeAt(0) - 97;
    //             return isWhite ? { i: moveI, j: moveJ } : { i: 7 - moveI, j: 7 - moveJ };
    //         })
    //     );

    //     let chessboard = document.getElementById('chessboard')
    //     let rect = chessboard.getBoundingClientRect()

    //     let chesspiece = document.getElementById(`chesspiece-${i}-${j}`);
    //     chesspiece.style.position = 'absolute';
    //     chesspiece.style.zIndex = 1000;
    //     chesspiece.style.pointerEvents = 'none';

    //     chesspiece.style.left = `${e.pageX - rect.left - chesspiece.offsetWidth / 2}px`;
    //     chesspiece.style.top = `${e.pageY - rect.top - chesspiece.offsetHeight / 2}px`;

    //     const handleOnMouseMove = (e) => {
    //         chesspiece.style.left = `${e.pageX - rect.left - chesspiece.offsetWidth / 2}px`;
    //         chesspiece.style.top = `${e.pageY - rect.top - chesspiece.offsetHeight / 2}px`;
    //     }

    //     const handleOnMouseUp = (e) => {
    //         document.removeEventListener('mousemove', handleOnMouseMove);
    //         document.removeEventListener('mouseup', handleOnMouseUp);

    //         chesspiece.style.position = 'static';
    //         let from
    //         if (isWhite)
    //             from = String.fromCharCode(97 + j) + (8 - i);
    //         else
    //             from = String.fromCharCode(97 + 7 - j) + (8 - 7 + i);

    //         let elem = document.elementFromPoint(e.clientX, e.clientY);
    //         let to = elem.id.split('-')[1] + '-' + elem.id.split('-')[2];
    //         if(to === 'undefined-undefined'){
    //             elem = elem.firstElementChild;
    //         }
    //         to = elem.id.split('-')[1] + '-' + elem.id.split('-')[2];
    //         if (isWhite){
    //             to = String.fromCharCode(97 + parseInt(to.split('-')[1])) + (8 - parseInt(to.split('-')[0]));
    //         }
    //         else{
    //             console.log(97 + 7 - parseInt(to.split('-')[1]), 8 - 7 + parseInt(to.split('-')[0]))
    //             to = String.fromCharCode(97 + 7 - parseInt(to.split('-')[1])) + (8 - 7 + parseInt(to.split('-')[0]));
    //         }
    //         if(to == from)
    //             return
    //         console.log(from, to)
    //         onMove(from, to)
    //         setSelectedPiece(null);
    //         setSelectedPosition(null);
    //         setValidMoves([]);
    //     }

    //     document.addEventListener('mousemove', handleOnMouseMove)
    //     document.addEventListener('mouseup', handleOnMouseUp)
    // };

    return (
        <div>
            {game && <>
                <h2>{game.opponentName}</h2>
                {
                    game.live &&
                    <div>{ImproveTime(opptime)}</div>
                }
            </>}
            <div id='chessboard' className={`${styles.chessboard} ${isWhite !== false ? "" : styles.rotated}`}>
                {boardstate.map((row, i) => (
                    <div className={styles.row} key={i}>
                        {row.map((piece, j) => (
                            <div
                                style={(i + j) % 2 === 0 ? { backgroundColor: color2 } : { backgroundColor: color1 }}
                                className={`${styles.box} ${selectedPosition && selectedPosition.i === i && selectedPosition.j === j ? styles.selected : ''} ${validMoves.some(move => move.i === i && move.j === j) ? styles.validMove : ''} ${isWhite !== false ? "" : styles.antirotated}`}
                                key={j}
                                onClick={(e) => handleSquareClick(e, i, j)}
                            // onMouseDown={(e) => handleOnMouseDown(e, i, j)}
                            >
                                <p
                                    id={`chesspiece-${i}-${j}`}
                                    className={styles.chesspiece}>{getChessPiece(piece)}</p>
                                {i == 0 &&
                                    <div className={styles.promotion} ref={boardRef.current[i][j]}>
                                        {
                                            game && game.isWhite ?
                                                <>
                                                    <p onClick={handlePromotion}>♕</p>
                                                    <p onClick={handlePromotion}>♗</p>
                                                    <p onClick={handlePromotion}>♖</p>
                                                    <p onClick={handlePromotion}>♘</p>
                                                </>
                                                :
                                                <>
                                                    <p onClick={handlePromotion}>♛</p>
                                                    <p onClick={handlePromotion}>♝</p>
                                                    <p onClick={handlePromotion}>♜</p>
                                                    <p onClick={handlePromotion}>♞</p>
                                                </>

                                        }

                                    </div>
                                }
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            {game && <>
                <h2>{game.name}</h2>
                {
                    game.live &&
                    <div>{ImproveTime(mytime)}</div>
                }
            </>}
            <button onClick={handleGoback}>
                GO BACK
            </button>
            <button onClick={handleGofront}>
                GO FRONT
            </button>
        </div>
    );
}