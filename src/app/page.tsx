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
  const [isWhite, setIsWhite] = useState<boolean | null>(true);
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
        if (isWhite) {
          setBoardState([...game.board.map((row: string[]) => [...row])]); // Ensure deep copy of the board
          return true
        } else {
          setBoardState(
            [...game.board.map((row: string[]) => [...row].reverse())].reverse() // Reverse for black side
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
    if (socket) {
      const gameInstance = getGame();
      setIsWhite(gameInstance.isWhite);
      setGame(gameInstance);
  
      socket.on('move', () => {
        if (isWhite) {
          setBoardState([...gameInstance.board.map((row: string[]) => [...row])]); // Deep copy
        } else {
          setBoardState(
            [...gameInstance.board.map((row: string[]) => [...row].reverse())].reverse() // Reverse for black
          );
        }
      });
    }
  }, [socket, isWhite]); // Added isWhite as a dependency
  

  return (
    <div className={styles.home}>
      <ChessBoard color1={'grey'} color2={'white'} boardState={boardState} setboardState={setBoardState} onMove={onMove} isWhite={isWhite} game={game}/>
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
