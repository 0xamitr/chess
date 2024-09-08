import React, { useState } from 'react';
import styles from "./chessboard.module.css";

export default function ChessBoard({ color1, color2, boardState, onMove }) {
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [selectedPosition, setSelectedPosition] = useState(null);

    const handleSquareClick = (i, j) => {
        if (selectedPiece) {
            let from = String.fromCharCode(97 + selectedPosition.j) + (8 - selectedPosition.i);
            let to = String.fromCharCode(97 + j) + (8 - i);

            onMove(from, to);
            setSelectedPiece(null);
            setSelectedPosition(null);
        } else {
            setSelectedPiece(boardState[i][j]);
            setSelectedPosition({ i, j });
        }
    };

    return (
        <div className={styles.chessboard}>
            {boardState.map((row, i) => (
                <div className={styles.row} key={i}>
                    {row.map((piece, j) => (
                        <div
                        style={(i + j) % 2 === 0 ? { backgroundColor: color1 } : { backgroundColor: color2 }}
                        className={`${styles.box} ${selectedPosition && selectedPosition.i === i && selectedPosition.j === j ? styles.selected : ''}`}
                        key={j}
                            onClick={() => handleSquareClick(i, j)}
                        >
                            <p>{piece}</p>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
