import styles from './Button.module.scss'

export default function Button({ title }: any) {
  return <button className={styles.container}>{title}</button>
}
