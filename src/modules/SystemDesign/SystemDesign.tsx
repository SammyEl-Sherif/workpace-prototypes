import { Text } from '@workpace/design-system'
import { motion } from 'framer-motion'
import styles from './SystemDesign.module.scss'

export const SystemDesign = () => {
  return (
    <div className={styles.page}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={styles.floatingHeader}
      >
        <div className={styles.headerContent}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className={styles.titleSection}
          >
            <h1 className={styles.mainTitle}>🏗️ System Design</h1>
            <p className={styles.subtitle}>
              Architecture and system design documentation for WorkPace prototypes
            </p>
          </motion.div>
        </div>
      </motion.div>

      <div className={styles.mainContent}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className={styles.section}
        >
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>System Architecture</h2>
            <p className={styles.sectionSubtitle}>
              High-level overview of how the prototypes are built and connected
            </p>
          </div>

          <div className={styles.diagramContainer}>
            <div className={styles.diagram}>
              {/* Frontend Layer */}
              <div className={styles.layer}>
                <div className={styles.layerHeader}>
                  <h3>Frontend Layer</h3>
                </div>
                <div className={styles.layerContent}>
                  <div className={styles.component}>
                    <div className={styles.componentIcon}>⚛️</div>
                    <div className={styles.componentText}>
                      <strong>Next.js App</strong>
                      <span>React + TypeScript</span>
                    </div>
                  </div>
                  <div className={styles.component}>
                    <div className={styles.componentIcon}>🎨</div>
                    <div className={styles.componentText}>
                      <strong>Design System</strong>
                      <span>Component Library</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* API Layer */}
              <div className={styles.arrow}>↓</div>
              <div className={styles.layer}>
                <div className={styles.layerHeader}>
                  <h3>API Layer</h3>
                </div>
                <div className={styles.layerContent}>
                  <div className={styles.component}>
                    <div className={styles.componentIcon}>🔌</div>
                    <div className={styles.componentText}>
                      <strong>REST API</strong>
                      <span>Next.js API Routes</span>
                    </div>
                  </div>
                  <div className={styles.component}>
                    <div className={styles.componentIcon}>🔐</div>
                    <div className={styles.componentText}>
                      <strong>Auth</strong>
                      <span>NextAuth.js</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* External Services */}
              <div className={styles.arrow}>↓</div>
              <div className={styles.layer}>
                <div className={styles.layerHeader}>
                  <h3>External Services</h3>
                </div>
                <div className={styles.layerContent}>
                  <div className={styles.component}>
                    <div className={styles.componentIcon}>📝</div>
                    <div className={styles.componentText}>
                      <strong>Notion API</strong>
                      <span>Content Management</span>
                    </div>
                  </div>
                  <div className={styles.component}>
                    <div className={styles.componentIcon}>🤖</div>
                    <div className={styles.componentText}>
                      <strong>OpenAI</strong>
                      <span>AI Processing</span>
                    </div>
                  </div>
                  <div className={styles.component}>
                    <div className={styles.componentIcon}>💾</div>
                    <div className={styles.componentText}>
                      <strong>Database</strong>
                      <span>PostgreSQL</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
