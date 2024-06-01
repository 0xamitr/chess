import styles from './form.module.css'
export default function CustomForm({children, onSubmit}){
    return(
        <form onSubmit={onSubmit} className={styles.form} >
            {children}
        </form>
    )
}