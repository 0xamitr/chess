"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import ChessBoard from "../../components/ChessBoard/chessboard";
import createRoom from "../../functions/createroom";
import joinRoom from "../../functions/joinroom";
import { useSession } from "next-auth/react";
import { usePopup } from '../../components/context/PopupContext';
import { getSocket } from "../../functions/socket";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { showPopup } = usePopup();
  const session = useSession()
  const [code, setCode] = useState<Number>();

  const handleJoinRoom = (e: any) => {
    console.log("Joining room...");
    if (session.data && session.data.user)
      joinRoom(e, session.data.user.name, (session.data.user as { id: string }).id);
    else
      joinRoom(e, 'anonymous', null);
  };

  const handleCreateRoom = (e: any) => {
    console.log("Creating room...");
    try {
      let roomCode
      if (session.data && session.data.user)
        roomCode = createRoom(e, session.data.user.name, (session.data.user as { id: string }).id);
      else
        roomCode = createRoom(e, 'anonymous', null);
      setCode(roomCode);
    } catch (error) {
      console.error("Failed to create room:", error);
    }
  };

  useEffect(() => {
    if (session && session.data && session.data.user) {
      getSocket(session.data.user, showPopup, router)
    }
  }, [session])

  return (
    <div className={styles.home}>
      <ChessBoard color1={'grey'} color2={'white'} />
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
