import Image from "next/image";
import styles from "./page.module.css";
import ChessBoard from "./components/ChessBoard/chessboard"
export default function Home() {
  return (
    <div className={styles.home}>
      <h2>HOME</h2>
      <ChessBoard color1={'grey'} color2={'white'}/>
    </div>
  );
}
