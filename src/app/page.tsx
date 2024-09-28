"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import ChessBoard from "../../components/ChessBoard/chessboard";
import createRoom from "../../functions/createroom";
import joinRoom from "../../functions/joinroom";
import { getGame } from "../../functions/gamemanager";
import { useSession } from "next-auth/react";
import { usePopup } from '../../components/context/PopupContext';

export default function Home() {
  const { showPopup } = usePopup();
  const session = useSession()
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
    console.log("Joining room...");
    if (session.data && session.data.user)
      joinRoom(e, setSocket, session.data.user.name, (session.data.user as { id: string }).id, showPopup);
    else
      joinRoom(e, setSocket, 'anonymous', null, showPopup);
  };

  const handleCreateRoom = (e: any) => {
    console.log("Creating room...");
    try {
      let roomCode
      if (session.data && session.data.user)
        roomCode = createRoom(e, setSocket, session.data.user.name, (session.data.user as { id: string }).id);
      else
        roomCode = createRoom(e, setSocket, 'anonymous', null);
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
      if (isWhite) {
        setBoardState([...gameInstance.board.map((row: string[]) => [...row])]); // Deep copy
      } else {
        setBoardState(
          [...gameInstance.board.map((row: string[]) => [...row].reverse())].reverse() // Reverse for black
        );
      }
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
      <ChessBoard color1={'grey'} color2={'white'} boardState={boardState} setboardState={setBoardState} onMove={onMove} isWhite={isWhite} game={game} />
      <div className={styles.side}>
        {!code && <form className={styles.form1} onSubmit={handleJoinRoom}>
          <label>
            <input className={styles.inp} type="number" name="num" />
          </label>
          <input className={styles.btn} type="submit" value="Join Room" />
        </form>
        }
        <form className={styles.form2} onSubmit={handleCreateRoom}>
          <p>{code && `Enter this code: ${code}`}</p>
          <input className={styles.btn} type="submit" value="Create Room" />
        </form>
      </div>
    </div>
  );
}
