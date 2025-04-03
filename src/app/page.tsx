"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import ChessBoard from "../../components/ChessBoard/chessboard";
import createRoom from "../../functions/createroom";
import joinRoom from "../../functions/joinroom";
import { useSession } from "next-auth/react";
import { getSocket } from "../../functions/socket";
import { useRouter } from "next/navigation";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"


export default function Home() {
  const router = useRouter();
  const session = useSession()
  const [code, setCode] = useState<Number>();

  const handleJoinRoom = (e: any) => {
    if (session.data && session.data.user)
      joinRoom(e, session.data.user.name, (session.data.user as { id: string }).id);
    else
      joinRoom(e, 'anonymous', null);
  };

  const handleCreateRoom = (e: any) => {
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
      const s = getSocket(session.data.user, router)
    }
  }, [session])

  return (
    <div className={styles.home}>
      <HoverCard>
        <HoverCardTrigger>
          <Button variant="link">How to Play?</Button>
        </HoverCardTrigger>
        <HoverCardContent>
          <ul className="list-disc p-5">
            <li>Sign In (with google preferrably)</li>
            <li>Send a friend request to your friend (Some test users that you can add : amit, saitm, amit2)</li>
            <li>And Challenge them to a game</li>

          </ul>
        </HoverCardContent>
      </HoverCard>
      <ChessBoard color1={'#367c2b'} color2={'#FAF9F6'} offGame={null} />
      {/* <div className={styles.side}>
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
      </div> */}
    </div>
  );
}
