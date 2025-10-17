import { SectionContainer } from '@/components'
import styles from './AboutPage.module.scss'

export const AboutPage = () => {
  return (
    <SectionContainer>
      <div className={styles.aboutPage}>
        {/* Mission Section */}
        <section className={styles.section}>
          <h1 className={styles.title}>About WorkPace</h1>
          <p className={styles.description}>
            WorkPace is a comprehensive productivity platform that combines innovative prototypes
            with a collaborative community environment. Built with modern web technologies, we help
            individuals and teams achieve their goals through intelligent automation and
            community-driven insights.
          </p>
          <p className={styles.description}>
            Our mission is to create tools that enhance human productivity while fostering a
            community of like-minded individuals who support each other&apos;s growth. Join us in
            transforming how we work, collaborate, and achieve our objectives.
          </p>
        </section>

        {/* About the Developer */}
        <section className={styles.section}>
          <h2 className={styles.title}>About the Developer</h2>
          <div className={styles.personalSection}>
            <div className={styles.personalContent}>
              <div className={styles.personalInfo}>
                <h3>Sammy El-Sherif</h3>
                <p>
                  Full-stack software engineer and architect behind WorkPace. Passionate about
                  building innovative solutions that enhance productivity and streamline workflows
                  for individuals and teams.
                </p>
                <p>
                  With expertise in modern web technologies, cloud architecture, and user experience
                  design, I&apos;ve built WorkPace from the ground up to demonstrate the power of
                  combining cutting-edge technology with thoughtful design.
                </p>

                {/* Core Technologies */}
                <div className={styles.coreTechnologies}>
                  <h4 className={styles.techSectionTitle}>Core Technologies</h4>
                  <div className={styles.techLogos}>
                    <div className={styles.techLogo}>
                      <div className={styles.logoPlaceholder} data-tech="nextjs">
                        ⚡
                      </div>
                      <span className={styles.logoLabel}>Next.js</span>
                    </div>
                    <div className={styles.techLogo}>
                      <div className={styles.logoPlaceholder} data-tech="react">
                        ⚛️
                      </div>
                      <span className={styles.logoLabel}>React</span>
                    </div>
                    <div className={styles.techLogo}>
                      <div className={styles.logoPlaceholder} data-tech="typescript">
                        📘
                      </div>
                      <span className={styles.logoLabel}>TypeScript</span>
                    </div>
                    <div className={styles.techLogo}>
                      <div className={styles.logoPlaceholder} data-tech="nodejs">
                        🟢
                      </div>
                      <span className={styles.logoLabel}>Node.js</span>
                    </div>
                    <div className={styles.techLogo}>
                      <div className={styles.logoPlaceholder} data-tech="postgresql">
                        🐘
                      </div>
                      <span className={styles.logoLabel}>PostgreSQL</span>
                    </div>
                    <div className={styles.techLogo}>
                      <div className={styles.logoPlaceholder} data-tech="docker">
                        🐳
                      </div>
                      <span className={styles.logoLabel}>Docker</span>
                    </div>
                  </div>
                </div>

                <div className={styles.socialLinks}>
                  <a
                    href="https://www.linkedin.com/in/sammy-el-sherif/"
                    className={styles.linkedinLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className={styles.socialIcon}>💼</span>
                    LinkedIn
                  </a>
                  <a
                    href="https://x.com/SammyElSherif"
                    className={styles.twitterLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className={styles.socialIcon}>🐦</span>
                    Twitter
                  </a>
                </div>
              </div>
              <div className={styles.personalInfo}>
                <h4 style={{ color: '#000000', marginBottom: '1rem' }}>Key Achievements</h4>
                <ul className={styles.techList}>
                  <li className={styles.techItem}>
                    Architected and developed full-stack web applications
                  </li>
                  <li className={styles.techItem}>
                    Implemented secure authentication and authorization systems
                  </li>
                  <li className={styles.techItem}>
                    Designed scalable database schemas and API architectures
                  </li>
                  <li className={styles.techItem}>
                    Integrated third-party APIs for enhanced functionality
                  </li>
                  <li className={styles.techItem}>
                    Deployed applications using modern DevOps practices
                  </li>
                  <li className={styles.techItem}>
                    Created responsive, accessible user interfaces
                  </li>
                </ul>

                {/* Experience Highlights */}
                <div className={styles.experienceHighlights}>
                  <h4 className={styles.techSectionTitle}>Experience Highlights</h4>
                  <div className={styles.highlightGrid}>
                    <div className={styles.highlightCard}>
                      <div className={styles.highlightIcon}>🚀</div>
                      <div className={styles.highlightContent}>
                        <h5>Full-Stack Development</h5>
                        <p>
                          End-to-end application development from database design to user interface
                        </p>
                      </div>
                    </div>
                    <div className={styles.highlightCard}>
                      <div className={styles.highlightIcon}>🔐</div>
                      <div className={styles.highlightContent}>
                        <h5>Security & Auth</h5>
                        <p>Implemented robust authentication systems with JWT and OAuth</p>
                      </div>
                    </div>
                    <div className={styles.highlightCard}>
                      <div className={styles.highlightIcon}>☁️</div>
                      <div className={styles.highlightContent}>
                        <h5>Cloud & DevOps</h5>
                        <p>Deployed scalable applications using Docker, Kubernetes, and CI/CD</p>
                      </div>
                    </div>
                    <div className={styles.highlightCard}>
                      <div className={styles.highlightIcon}>🎨</div>
                      <div className={styles.highlightContent}>
                        <h5>UI/UX Design</h5>
                        <p>Created intuitive user experiences with modern design principles</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className={styles.section}>
          <h2 className={styles.title}>Technology Stack</h2>
          <p className={styles.description}>
            WorkPace is built using cutting-edge technologies that ensure scalability,
            maintainability, and optimal user experience.
          </p>

          <div className={styles.techStack}>
            <div className={styles.techCategory}>
              <h3 className={styles.techCategoryTitle}>Frontend</h3>
              <ul className={styles.techList}>
                <li className={styles.techItem}>Next.js 14</li>
                <li className={styles.techItem}>React 18</li>
                <li className={styles.techItem}>TypeScript</li>
                <li className={styles.techItem}>SCSS Modules</li>
                <li className={styles.techItem}>NextAuth.js</li>
              </ul>
            </div>

            <div className={styles.techCategory}>
              <h3 className={styles.techCategoryTitle}>Backend</h3>
              <ul className={styles.techList}>
                <li className={styles.techItem}>Node.js</li>
                <li className={styles.techItem}>Express.js</li>
                <li className={styles.techItem}>PostgreSQL</li>
                <li className={styles.techItem}>RESTful APIs</li>
                <li className={styles.techItem}>JWT Authentication</li>
              </ul>
            </div>

            <div className={styles.techCategory}>
              <h3 className={styles.techCategoryTitle}>External Services</h3>
              <ul className={styles.techList}>
                <li className={styles.techItem}>Notion API</li>
                <li className={styles.techItem}>OpenAI API</li>
                <li className={styles.techItem}>Auth0</li>
                <li className={styles.techItem}>Vercel Deployment</li>
              </ul>
            </div>

            <div className={styles.techCategory}>
              <h3 className={styles.techCategoryTitle}>DevOps & Tools</h3>
              <ul className={styles.techList}>
                <li className={styles.techItem}>Docker</li>
                <li className={styles.techItem}>Kubernetes</li>
                <li className={styles.techItem}>GitHub Actions</li>
                <li className={styles.techItem}>ESLint & Prettier</li>
                <li className={styles.techItem}>TypeScript Strict Mode</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Architecture Section */}
        <section className={styles.section}>
          <h2 className={styles.title}>System Architecture</h2>
          <p className={styles.description}>
            WorkPace is built on a robust, scalable architecture that separates concerns and ensures
            optimal performance. Here&apos;s how our system components work together:
          </p>

          <div className={styles.architectureDiagram}>
            <div className={styles.diagramContainer}>
              {/* Frontend Layer */}
              <div className={styles.diagramRow}>
                <div className={styles.component}>
                  <div className={styles.componentTitle}>Frontend</div>
                  <div className={styles.componentDescription}>
                    Next.js React Application
                    <br />
                    TypeScript + SCSS
                    <br />
                    Authentication & UI
                  </div>
                </div>
              </div>

              <div className={styles.arrow}>↓</div>

              {/* API Layer */}
              <div className={styles.diagramRow}>
                <div className={styles.component}>
                  <div className={styles.componentTitle}>WorkPace API</div>
                  <div className={styles.componentDescription}>
                    RESTful API Gateway
                    <br />
                    Business Logic Layer
                    <br />
                    Authentication & Authorization
                  </div>
                </div>
              </div>

              <div className={styles.arrow}>↓</div>

              {/* Database Layer */}
              <div className={styles.diagramRow}>
                <div className={styles.component}>
                  <div className={styles.componentTitle}>WorkPace PostgreSQL</div>
                  <div className={styles.componentDescription}>
                    Primary Database
                    <br />
                    User Data & Prototypes
                    <br />
                    Notion Integration Data
                  </div>
                </div>
              </div>

              <div className={styles.arrow}>↓</div>


              {/* External Services */}
              <div className={styles.diagramRow}>
                <div className={styles.component}>
                  <div className={styles.componentTitle}>External APIs</div>
                  <div className={styles.componentDescription}>
                    Notion API
                    <br />
                    OpenAI API
                    <br />
                    Auth0 Authentication
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className={styles.description}>
            <strong>Data Flow:</strong> The frontend application communicates with the WorkPace API,
            which handles business logic and data processing. The API then interacts with the
            PostgreSQL database to store and retrieve user data, prototype information, and Notion
            integration data. External services like Notion and OpenAI are integrated through the
            API layer for enhanced functionality.
          </p>
        </section>
      </div>
    </SectionContainer>
  )
}
