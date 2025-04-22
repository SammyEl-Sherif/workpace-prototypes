import ReactLoading from 'react-loading'
import cn from 'classnames'
import styles from './LoadingStyles.module.scss'

type LoadingProps = {
  className?: string
  fullscreen?: boolean
}

export const Loading = ({ className, fullscreen = false }: LoadingProps) => {
  return (
    <div
      className={cn(className, { [styles.wrapper]: fullscreen }, { [styles.loading]: fullscreen })}
    >
      <ReactLoading type="spin" color="#1983EE" height={'20%'} width={'20%'} />
    </div>
  )
}
