import { getEnvironment } from '@/utils/getEnvironment'
import React from 'react'
import styles from './EnvironmentIndicator.module.scss'

export const EnvironmentIndicator: React.FC = () => {
  const environment = getEnvironment()

  if (environment === 'production') return null

  const isDocker = environment === 'docker'
  const isLocal = environment === 'local'

  return (
    <div className={`${styles.indicator} ${isDocker ? styles.docker : styles.local}`} title={`Running in ${isDocker ? 'Docker Container' : 'Local Development'}`}>
      <span className={styles.icon}>
        {isDocker ? '🐳' : '💻'}
      </span>
      <span className={styles.text}>
        {isDocker ? 'Container' : 'Local'}
      </span>
    </div>
  )
}

export default EnvironmentIndicator
