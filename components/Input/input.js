import styles from './input.module.css'
export default function CustomInput({inputheading, ...props}){
    return(
        <label className={styles.label}>
            <p>{inputheading}</p>
            <input className={styles.input} {...props}/>
        </label>
    )
}