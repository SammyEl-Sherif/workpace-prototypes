import styles from './CommunitySection.module.scss'

const CommunitySection = () => {
  return (
    <section id="community" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.textContent}>
            <h2 className={styles.title}>Join our Community</h2>
            <p className={styles.description}>
              A Notion Teamspace where motivated people come together to chase their personal goals
              with a group of like-minded individuals. We track our tasks, notes, and manage our
              connections all in Notion. It allows us to learn from one another and get feedback on
              work.
            </p>
            <div className={styles.features}>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>🎯</div>
                <div className={styles.featureContent}>
                  <h3 className={styles.featureTitle}>Goal Tracking</h3>
                  <p className={styles.featureDescription}>
                    Set and track personal goals with accountability partners
                  </p>
                </div>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>📝</div>
                <div className={styles.featureContent}>
                  <h3 className={styles.featureTitle}>Knowledge Sharing</h3>
                  <p className={styles.featureDescription}>
                    Share notes, insights, and learn from others&apos; experiences
                  </p>
                </div>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>🤝</div>
                <div className={styles.featureContent}>
                  <h3 className={styles.featureTitle}>Collaboration</h3>
                  <p className={styles.featureDescription}>
                    Connect with like-minded individuals and get feedback on your work
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.cta}>
              <a
                href="https://www.notion.so/team/join"
                className={styles.joinButton}
                target="_blank"
                rel="noopener noreferrer"
              >
                Join Notion Teamspace
              </a>
            </div>
          </div>
          <div className={styles.visualContent}>
            <div className={styles.notionMockup}>
              <div className={styles.notionHeader}>
                <div className={styles.notionLogo}>📝</div>
                <div className={styles.notionTitle}>WorkPace Community</div>
              </div>
              <div className={styles.notionContent}>
                <div className={styles.notionPage}>
                  <div className={styles.notionPageTitle}>Personal Goals 2024</div>
                  <div className={styles.notionTasks}>
                    <div className={styles.notionTask}>✅ Complete React project</div>
                    <div className={styles.notionTask}>🔄 Learn TypeScript</div>
                    <div className={styles.notionTask}>📋 Build portfolio website</div>
                  </div>
                </div>
                <div className={styles.notionSidebar}>
                  <div className={styles.notionItem}>🏠 Dashboard</div>
                  <div className={styles.notionItem}>📊 Progress</div>
                  <div className={styles.notionItem}>💬 Discussions</div>
                  <div className={styles.notionItem}>👥 Members</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CommunitySection
