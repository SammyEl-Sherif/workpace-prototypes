import styles from './Button.module.scss'

interface ButtonProps {
  title: string
  onClick?: () => void
}

export default function Button({ title, onClick }: ButtonProps) {
  return (
    <button className={styles.container} onClick={onClick}>
      {title}
    </button>
  )
}
