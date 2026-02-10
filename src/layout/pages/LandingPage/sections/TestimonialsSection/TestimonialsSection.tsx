import styles from './TestimonialsSection.module.scss'

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'Product Designer',
      company: 'Tech Startup',
      content:
        'The WorkPace apps have revolutionized how I approach my design workflow. The automation tools save me hours every week, and the community feedback has been invaluable for improving my work.',
      avatar: '👩‍💻',
      rating: 5,
    },
    {
      id: 2,
      name: 'Marcus Rodriguez',
      role: 'Software Engineer',
      company: 'Freelancer',
      content:
        'Being part of the WorkPace community has been a game-changer. The collaborative environment and shared knowledge base in Notion has helped me level up my skills and build better projects.',
      avatar: '👨‍💻',
      rating: 5,
    },
    {
      id: 3,
      name: 'Emily Watson',
      role: 'Marketing Manager',
      company: 'Creative Agency',
      content:
        "The apps are incredibly intuitive and the community is so supportive. I've learned so much from other members and the tools have streamlined my content creation process significantly.",
      avatar: '👩‍🎨',
      rating: 5,
    },
    {
      id: 4,
      name: 'David Kim',
      role: 'Product Manager',
      company: 'SaaS Company',
      content:
        'WorkPace has created an amazing ecosystem for productivity tools and community learning. The apps are cutting-edge and the Notion workspace keeps everything organized perfectly.',
      avatar: '👨‍💼',
      rating: 5,
    },
  ]

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>What Our Community Says</h2>
          <p className={styles.subtitle}>
            Real feedback from users of our apps and community members
          </p>
        </div>

        <div className={styles.testimonialsGrid}>
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className={styles.testimonialCard}>
              <div className={styles.testimonialContent}>
                <div className={styles.rating}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className={styles.star}>
                      ⭐
                    </span>
                  ))}
                </div>
                <p className={styles.testimonialText}>&ldquo;{testimonial.content}&rdquo;</p>
              </div>

              <div className={styles.testimonialAuthor}>
                <div className={styles.avatar}>{testimonial.avatar}</div>
                <div className={styles.authorInfo}>
                  <div className={styles.authorName}>{testimonial.name}</div>
                  <div className={styles.authorRole}>
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statNumber}>500+</div>
            <div className={styles.statLabel}>Active Community Members</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNumber}>98%</div>
            <div className={styles.statLabel}>User Satisfaction Rate</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNumber}>50+</div>
            <div className={styles.statLabel}>Projects Completed</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
