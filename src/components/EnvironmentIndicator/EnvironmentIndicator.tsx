import { getEnvironment } from '@/utils/getEnvironment'
import React from 'react'
import cn from 'classnames'
import styles from './EnvironmentIndicator.module.scss'

interface EnvironmentIndicatorProps {
  hideText?: boolean
}

export const EnvironmentIndicator: React.FC<EnvironmentIndicatorProps> = ({ hideText = false }) => {
  const environment = getEnvironment()

  if (environment === 'production') return null

  const isDocker = environment === 'docker'

  return (
    <div
      className={cn(styles.indicator, {
        [styles.docker]: isDocker,
        [styles.local]: !isDocker,
      })}
      title={`Running in ${isDocker ? 'Docker Container' : 'Local Development'}`}
    >
      <span className={styles.icon}>{isDocker ? '🐳' : '💻'}</span>
      <span className={cn(styles.text, { [styles.hideText]: hideText })}>
        {isDocker ? 'Container' : 'Local'}
      </span>
    </div>
  )
}

export default EnvironmentIndicator
