import React, { useState, useEffect } from 'react';
import styles from "./chessboard.module.css";
import getChessPiece from "../../functions/getChessPiece";

export default function ChessBoard({ color1, color2, boardState, setboardState, onMove, isWhite, game }) {
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [validMoves, setValidMoves] = useState([]);
    const [time, setTime] = useState(null)

    useEffect(() => {
        if (game) {
            const interval = setInterval(() => {
                setTime(game.time);
                if (game.time < 1) {
                    clearInterval(interval);
                }
            }, 1000);
        }
    }, [game])

    const ImproveTime = (time) => {
        let minutes = parseInt(time / 60)
        let seconds = time % 60

        return `${minutes} : ${seconds}`
    }

    const handleSquareClick = (e, i, j) => {
        if(game.isWhite){
            game.tempmove = game.totalmoves
            setboardState(game.history[game.tempmove])
        }
        else{
            game.tempmove = game.totalmoves
            setboardState(game.history[game.tempmove].map(row => row.slice().reverse()).reverse())
        }
        // Adjust coordinates for black's perspective
        let adjustedI = isWhite ? i : 7 - i;
        let adjustedJ = isWhite ? j : 7 - j;

        if (selectedPiece) {
            if (!game) {
                setSelectedPiece(boardState[i][j])
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
            console.log(from, to)
            if (!onMove(from, to)) {
                setSelectedPiece(boardState[i][j])
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
            setSelectedPiece(boardState[i][j])
            setSelectedPosition({ i: i, j: j });
            if (!game)
                return

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
        if(game.tempmove > 0)
            game.tempmove--
        if(game.isWhite)
            setboardState(game.history[game.tempmove])
        else
            setboardState(game.history[game.tempmove].map(row => row.slice().reverse()).reverse())


    }
    const handleGofront = () => {
        if(game.tempmove < game.totalmoves)
                game.tempmove++
        if(game.isWhite)
            setboardState(game.history[game.tempmove])
        else
            setboardState(game.history[game.tempmove].map(row => row.slice().reverse()).reverse())
            
    }


    // const handleOnMouseDown = (e, i, j) => {
    //     setSelectedPiece(boardState[i][j])
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
        <>
            <div id='chessboard' className={`${styles.chessboard} ${isWhite !== false ? "" : styles.rotated}`}>
                {boardState.map((row, i) => (
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
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div>
                {ImproveTime(time)}
            </div>
            <button onClick={handleGoback}>
                GO BACK
            </button>
            <button onClick={handleGofront}>
                GO FRONT
            </button>
        </>
    );
}