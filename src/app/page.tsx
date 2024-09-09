"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import ChessBoard from "../../components/ChessBoard/chessboard";
import createRoom from "../../functions/createroom";
import joinRoom from "../../functions/joinroom";
import { getGame } from "../../functions/gamemanager";

export default function Home() {
  const [code, setCode] = useState<Number>();
  const [socket, setSocket] = useState<any | null>(null);
  const [game, setGame] = useState<any | null>(null);
  const [isMoveValid, setIsMoveValid] = useState<any | null>(null);
  const [boardState, setBoardState] = useState([
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
  ]);

  const handleJoinRoom = (e: any) => {
    joinRoom(e, setSocket);
  };

  const handleCreateRoom = (e: any) => {
    try {
      const roomCode = createRoom(e, setSocket);
      setCode(roomCode);
    } catch (error) {
      console.error("Failed to create room:", error);
    }
  };

  const onMove = (from: string, to: string) => {
    if (game) {
      const moveMade = game.makeMove(from, to);
      if (moveMade) {
        setBoardState([...game.board]); // Only update if a valid move is made
      }
    }
  };

  useEffect(() => {
    if (socket) {
      const gameInstance = getGame();
      setGame(gameInstance);
      setIsMoveValid(gameInstance.isMoveValid);

      socket.on('move', () => {
        setBoardState([...gameInstance.board]); // Sync board state on socket moves
      });
    }
  }, [socket]);

  return (
    <div className={styles.home}>
      <ChessBoard color1={'grey'} color2={'white'} boardState={boardState} onMove={onMove}  isMoveValid={isMoveValid}/>
      <form onSubmit={handleJoinRoom}>
        <label>
          <p>Number</p>
          <input type="number" name="num" />
        </label>
        <input type="submit" />
      </form>
      <form onSubmit={handleCreateRoom}>
        <p>{`${code}`}</p>
        <input type="submit" />
      </form>
    </div>
  );
}
