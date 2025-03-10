import styles from './input.module.css'
import { useEffect, useRef } from 'react'

export default function CustomInput({className="", inputheading, ...props}){
    const inputRef = useRef(null);

    useEffect(() => {
        if (props.autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [props.autoFocus]);
    return(
        <label className={styles.label}>
            <p>{inputheading}</p>
            <input {...props} ref = {inputRef} className={`${styles.input} ${className}`}/>
        </label>
    )
}