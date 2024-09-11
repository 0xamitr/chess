import React, { useState } from 'react';
import styles from "./chessboard.module.css";
import getChessPiece from "../../functions/getChessPiece";

export default function ChessBoard({ color1, color2, boardState, onMove, isWhite, game }) {
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [validMoves, setValidMoves] = useState([]);

    const handleSquareClick = (i, j) => {
        if (selectedPiece) {
            let from = String.fromCharCode(97 + selectedPosition.j) + (8 - selectedPosition.i);
            let to = String.fromCharCode(97 + j) + (8 - i);
            onMove(from, to);
            setSelectedPiece(null);
            setSelectedPosition(null);
            setValidMoves([]);
        } else {
            const moves = game.getValidMoves(String.fromCharCode(97 + j) + (8 - i));
            setSelectedPiece(boardState[i][j]);
            setSelectedPosition({ i, j });
            setValidMoves(moves.map(move => {
                const [file, rank] = move.split('');
                return { i: 8 - parseInt(rank), j: file.charCodeAt(0) - 97 };
            }));
        }
    };

    return (
        <div className={`${styles.chessboard} ${isWhite !== false ? "" : styles.rotated}`}>
            {boardState.map((row, i) => (
                <div className={styles.row} key={i}>
                    {row.map((piece, j) => (
                        <div
                            style={(i + j) % 2 === 0 ? { backgroundColor: color2 } : { backgroundColor: color1 }}
                            className={`${styles.box} ${selectedPosition && selectedPosition.i === i && selectedPosition.j === j ? styles.selected : ''} ${validMoves.some(move => move.i === i && move.j === j) ? styles.validMove : ''} ${isWhite !== false ? "" : styles.antirotated}`}
                            key={j}
                            onClick={() => handleSquareClick(i, j)}
                        >
                            <p className={styles.chesspiece}>{getChessPiece(piece)}</p>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}