import { motion } from 'framer-motion'
import styles from './SystemDesign.module.scss'

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

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
            <h1 className={styles.mainTitle}>System Design</h1>
            <p className={styles.subtitle}>
              Architecture overview for WorkPace &mdash; a Next.js application deployed on Vercel
              with a Supabase PostgreSQL backend
            </p>
          </motion.div>
        </div>
      </motion.div>

      <div className={styles.mainContent}>
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.2 }}
          className={styles.section}
        >
          <div className={styles.diagramContainer}>
            <div className={styles.diagram}>
              {/* Deployment Layer */}
              <div className={`${styles.layer} ${styles.deploymentLayer}`}>
                <div className={styles.layerHeader}>
                  <h3>Deployment &amp; Infrastructure</h3>
                  <span className={styles.layerBadge}>Production</span>
                </div>
                <div className={styles.layerContent}>
                  <div className={styles.component}>
                    <div className={styles.componentIcon}>&#9652;</div>
                    <div className={styles.componentText}>
                      <strong>Vercel</strong>
                      <span>Hosting &amp; CDN</span>
                      <div className={styles.techTags}>
                        <span className={styles.techTag}>Serverless Functions</span>
                        <span className={styles.techTag}>Edge Network</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.component}>
                    <div className={styles.componentIcon}>&#9881;</div>
                    <div className={styles.componentText}>
                      <strong>GitHub Actions</strong>
                      <span>CI/CD Pipeline</span>
                      <div className={styles.techTags}>
                        <span className={styles.techTag}>Design System Releases</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className={styles.connectionArrow}>
                <div className={styles.arrowLine} />
                <div className={styles.arrowLabel}>serves</div>
                <div className={styles.arrowHead}>&#8595;</div>
              </div>

              {/* Frontend Layer */}
              <div className={`${styles.layer} ${styles.frontendLayer}`}>
                <div className={styles.layerHeader}>
                  <h3>Frontend Layer</h3>
                  <span className={styles.layerBadge}>Client</span>
                </div>
                <div className={styles.layerContent}>
                  <div className={styles.component}>
                    <div className={styles.componentIcon}>&#9883;</div>
                    <div className={styles.componentText}>
                      <strong>Next.js 14</strong>
                      <span>React 18 + TypeScript</span>
                      <div className={styles.techTags}>
                        <span className={styles.techTag}>Pages Router</span>
                        <span className={styles.techTag}>SSR</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.component}>
                    <div className={styles.componentIcon}>&#127912;</div>
                    <div className={styles.componentText}>
                      <strong>Design System</strong>
                      <span>@workpace/design-system</span>
                      <div className={styles.techTags}>
                        <span className={styles.techTag}>SCSS Modules</span>
                        <span className={styles.techTag}>Design Tokens</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.component}>
                    <div className={styles.componentIcon}>&#10024;</div>
                    <div className={styles.componentText}>
                      <strong>UI Libraries</strong>
                      <span>Framer Motion, Chart.js</span>
                      <div className={styles.techTags}>
                        <span className={styles.techTag}>Animations</span>
                        <span className={styles.techTag}>Data Viz</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className={styles.connectionArrow}>
                <div className={styles.arrowLine} />
                <div className={styles.arrowLabel}>fetch / axios</div>
                <div className={styles.arrowHead}>&#8595;</div>
              </div>

              {/* API Layer */}
              <div className={`${styles.layer} ${styles.apiLayer}`}>
                <div className={styles.layerHeader}>
                  <h3>API Layer</h3>
                  <span className={styles.layerBadge}>Server</span>
                </div>
                <div className={styles.layerContent}>
                  <div className={styles.component}>
                    <div className={styles.componentIcon}>&#128268;</div>
                    <div className={styles.componentText}>
                      <strong>Next.js API Routes</strong>
                      <span>TypeScript Controllers &amp; Services</span>
                      <div className={styles.techTags}>
                        <span className={styles.techTag}>REST Endpoints</span>
                        <span className={styles.techTag}>Route Handlers</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.component}>
                    <div className={styles.componentIcon}>&#128274;</div>
                    <div className={styles.componentText}>
                      <strong>Authentication</strong>
                      <span>NextAuth.js + Supabase Auth</span>
                      <div className={styles.techTags}>
                        <span className={styles.techTag}>JWT Strategy</span>
                        <span className={styles.techTag}>Credentials Provider</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className={styles.connectionArrow}>
                <div className={styles.arrowLine} />
                <div className={styles.arrowLabel}>raw SQL via pg pool</div>
                <div className={styles.arrowHead}>&#8595;</div>
              </div>

              {/* Data Access Layer */}
              <div className={`${styles.layer} ${styles.dataAccessLayer}`}>
                <div className={styles.layerHeader}>
                  <h3>Data Access Layer</h3>
                  <span className={styles.layerBadge}>Query Engine</span>
                </div>
                <div className={styles.layerContent}>
                  <div className={styles.component}>
                    <div className={styles.componentIcon}>&#128451;</div>
                    <div className={styles.componentText}>
                      <strong>node-postgres (pg)</strong>
                      <span>Connection Pool &amp; SSL</span>
                      <div className={styles.techTags}>
                        <span className={styles.techTag}>Pool Management</span>
                        <span className={styles.techTag}>Parameterized Queries</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.component}>
                    <div className={styles.componentIcon}>&#128196;</div>
                    <div className={styles.componentText}>
                      <strong>SQL File Loader</strong>
                      <span>Cached .sql file execution</span>
                      <div className={styles.techTags}>
                        <span className={styles.techTag}>src/db/sql/*</span>
                        <span className={styles.techTag}>In-Memory Cache</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className={styles.connectionArrow}>
                <div className={styles.arrowLine} />
                <div className={styles.arrowLabel}>connection string (SSL)</div>
                <div className={styles.arrowHead}>&#8595;</div>
              </div>

              {/* Database Layer */}
              <div className={`${styles.layer} ${styles.databaseLayer}`}>
                <div className={styles.layerHeader}>
                  <h3>Database</h3>
                  <span className={styles.layerBadge}>Supabase</span>
                </div>
                <div className={styles.layerContent}>
                  <div className={styles.component}>
                    <div className={styles.componentIcon}>&#128024;</div>
                    <div className={styles.componentText}>
                      <strong>PostgreSQL</strong>
                      <span>Supabase Managed Database</span>
                      <div className={styles.techTags}>
                        <span className={styles.techTag}>RLS Policies</span>
                        <span className={styles.techTag}>Declarative Schemas</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.component}>
                    <div className={styles.componentIcon}>&#128272;</div>
                    <div className={styles.componentText}>
                      <strong>Supabase Auth</strong>
                      <span>User Management &amp; Sessions</span>
                      <div className={styles.techTags}>
                        <span className={styles.techTag}>JWT Tokens</span>
                        <span className={styles.techTag}>auth.users</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* External Services - branching off */}
              <div className={styles.externalServicesSection}>
                <div className={styles.branchConnector}>
                  <span className={styles.branchLabel}>API Layer also connects to</span>
                </div>
                <div className={`${styles.layer} ${styles.externalLayer}`}>
                  <div className={styles.layerHeader}>
                    <h3>External Services</h3>
                    <span className={styles.layerBadge}>3rd Party</span>
                  </div>
                  <div className={styles.layerContent}>
                    <div className={styles.component}>
                      <div className={styles.componentIcon}>&#128221;</div>
                      <div className={styles.componentText}>
                        <strong>Notion API</strong>
                        <span>Content Management</span>
                        <div className={styles.techTags}>
                          <span className={styles.techTag}>@notionhq/client</span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.component}>
                      <div className={styles.componentIcon}>&#129302;</div>
                      <div className={styles.componentText}>
                        <strong>OpenAI API</strong>
                        <span>AI Report Generation</span>
                        <div className={styles.techTags}>
                          <span className={styles.techTag}>GPT Models</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Data Flow Section */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.35 }}
          className={styles.section}
        >
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Request Flow</h2>
            <p className={styles.sectionSubtitle}>
              How a typical API request flows through the system
            </p>
          </div>
          <div className={styles.flowDiagram}>
            <div className={styles.flowStep}>
              <div className={styles.flowNumber}>1</div>
              <div className={styles.flowText}>
                <strong>Client Request</strong>
                <span>React component calls API via axios</span>
              </div>
            </div>
            <div className={styles.flowArrow}>&#8594;</div>
            <div className={styles.flowStep}>
              <div className={styles.flowNumber}>2</div>
              <div className={styles.flowText}>
                <strong>API Route</strong>
                <span>Next.js route delegates to controller</span>
              </div>
            </div>
            <div className={styles.flowArrow}>&#8594;</div>
            <div className={styles.flowStep}>
              <div className={styles.flowNumber}>3</div>
              <div className={styles.flowText}>
                <strong>Service Layer</strong>
                <span>Business logic loads &amp; executes .sql files</span>
              </div>
            </div>
            <div className={styles.flowArrow}>&#8594;</div>
            <div className={styles.flowStep}>
              <div className={styles.flowNumber}>4</div>
              <div className={styles.flowText}>
                <strong>PostgreSQL</strong>
                <span>Supabase DB returns query results</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Key Tables Section */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.45 }}
          className={styles.section}
        >
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Database Schema</h2>
            <p className={styles.sectionSubtitle}>
              Declarative SQL schemas managed in <code>supabase/schemas/</code> with migrations
              generated via <code>supabase db diff</code>
            </p>
          </div>
          <div className={styles.schemaGrid}>
            <div className={styles.schemaCard}>
              <h4>good_things</h4>
              <p>Core entries with titles, descriptions, completion dates</p>
              <span className={styles.schemaRelation}>belongs to goals, has many media</span>
            </div>
            <div className={styles.schemaCard}>
              <h4>goals</h4>
              <p>User-defined goal categories</p>
              <span className={styles.schemaRelation}>has many good_things</span>
            </div>
            <div className={styles.schemaCard}>
              <h4>good_things_media</h4>
              <p>Media attachments for good things entries</p>
              <span className={styles.schemaRelation}>belongs to good_things</span>
            </div>
            <div className={styles.schemaCard}>
              <h4>saved_reports</h4>
              <p>AI-generated year-end review reports</p>
              <span className={styles.schemaRelation}>belongs to user</span>
            </div>
            <div className={styles.schemaCard}>
              <h4>restaurants</h4>
              <p>Restaurant listings with cuisine tags and hours</p>
              <span className={styles.schemaRelation}>has many happy_hour_events</span>
            </div>
            <div className={styles.schemaCard}>
              <h4>user_roles</h4>
              <p>Role-based access control for users</p>
              <span className={styles.schemaRelation}>references auth.users</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
