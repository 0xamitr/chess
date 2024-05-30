import styles from "./chessboard.module.css"

export default function ChessBoard({color1, color2}){
    const n = 8;
    return(
        <div className={styles.chessboard}>
            {
                [...Array(n)].map((e, i) => 
                    <div className={styles.row} key={i}>
                    {
                        [...Array(n)].map((e, j) => 
                            <div className={styles.box} key={j}
                            style={(i+j)%2 == 0 ?{ backgroundColor: color1 }: {backgroundColor: color2}}
                            ></div>
                        )
                    }
                    </div>
                )
            }
                
        </div>
    )
}