import { useState } from 'react'

import { DesignSystem } from '@/modules/DesignSystem'
import { SystemDesign } from '@/modules/SystemDesign'

import styles from './About.module.scss'

type Tab = 'design-system' | 'system-design'

const TABS: { id: Tab; label: string }[] = [
  { id: 'system-design', label: 'System Design' },
  { id: 'design-system', label: 'Design System' },
]

const TECH_STACK = [
  { icon: '⚡', label: 'Next.js' },
  { icon: '⚛️', label: 'React' },
  { icon: '📘', label: 'TypeScript' },
  { icon: '🟢', label: 'Node.js' },
  { icon: '🐘', label: 'PostgreSQL' },
  { icon: '🔷', label: 'Supabase' },
  { icon: '🐳', label: 'Docker' },
  { icon: '▲', label: 'Vercel' },
]

export const About = () => {
  const [activeTab, setActiveTab] = useState<Tab>('system-design')

  return (
    <div className={styles.page}>
      {/* Tab Selector */}
      <div className={styles.tabBar}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === 'design-system' && <DesignSystem />}
        {activeTab === 'system-design' && <SystemDesign />}
      </div>

      {/* About the Developer */}
      <div className={styles.developerSection}>
        <div className={styles.developerHeader}>
          <h2>About the Developer</h2>
          <p>
            WorkPace is designed, built, and maintained by a full-stack engineer passionate about
            modern web technologies and thoughtful product design.
          </p>
        </div>

        <div className={styles.developerContent}>
          <div className={styles.developerInfo}>
            <h3 className={styles.developerName}>Sammy El-Sherif</h3>
            <p className={styles.developerBio}>
              Full-stack software engineer and architect behind WorkPace. Focused on building
              performant, well-structured applications using modern tooling — from database design
              and API architecture to component systems and deployment pipelines.
            </p>
            <div className={styles.socialLinks}>
              <a
                href="https://www.linkedin.com/in/sammy-el-sherif/"
                className={styles.socialLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                💼 LinkedIn
              </a>
              <a
                href="https://x.com/SammyElSherif"
                className={styles.socialLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                🐦 Twitter
              </a>
            </div>
          </div>

          <div className={styles.techPills}>
            {TECH_STACK.map((tech) => (
              <span key={tech.label} className={styles.techPill}>
                <span className={styles.techPillIcon}>{tech.icon}</span>
                {tech.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
