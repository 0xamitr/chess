"use client"
import Image from "next/image";
import styles from "./page.module.css";
import ChessBoard from "../../components/ChessBoard/chessboard"
import { useState } from "react";
import createRoom from "../../functions/createroom"
import joinRoom from "../../functions/joinroom"

export default function Home() {
  const [code, setCode] = useState<Number>()
  const handleCreateRoom = (e: any) => {
    try {
      const roomCode = createRoom(e);
      setCode(roomCode);
    } catch (error) {
      console.error("Failed to create room:", error);
    }
  };
  return (
    <div className={styles.home}>
      <ChessBoard color1={'grey'} color2={'white'}/>
      <form onSubmit={joinRoom}>
        <label>
          <p>Number</p>
          <input type="number" name="num"/>
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
