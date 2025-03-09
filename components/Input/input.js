import styles from './input.module.css'
export default function CustomInput({className="", inputheading, ...props}){
    return(
        <label className={styles.label}>
            <p>{inputheading}</p>
            <input {...props} className={`${styles.input} ${className}`}/>
        </label>
    )
}