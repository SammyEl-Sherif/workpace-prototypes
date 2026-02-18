import cn from 'classnames'
import { useRouter } from 'next/router'

import { Routes } from '@/interfaces/routes'

import { useScrollReveal } from '../../hooks'

import styles from './ServicesSection.module.scss'

interface Service {
  number: string
  title: string
  description: string
  features: string[]
  path: string
  video?: string
}

const services: Service[] = [
  {
    number: '01',
    title: 'Workspaces',
    description:
      'Custom-built digital workspaces tailored to your team. We design, build, and onboard your company with comprehensive resources and ongoing support.',
    features: ['Custom workspace design', 'Team onboarding', 'Ongoing support'],
    path: Routes.WORKSPACES,
    video:
      '/Sammy_El-Sherif_A_pristine_perfectly_organized_office_desk_ph_1330b058-dc40-4cde-948e-81a3eb0e525d_0.mp4',
  },
  {
    number: '02',
    title: 'Integrations',
    description:
      'Connect your favorite tools and automate workflows. Our suite of integrations brings Notion, Slack, and more together in one place.',
    features: ['Notion integration', 'Slack & email sync', 'Workflow automation'],
    path: Routes.APPS,
    video:
      '/Sammy_El-Sherif_Realistic_top-down_photograph_of_a_sleek_blac_406233d8-163a-4a65-9026-9b32dc56dbb2_0.mp4',
  },
  {
    number: '03',
    title: 'Templates',
    description:
      'Access our library of free and premium templates. Upgrade to Pro for $10/mo and unlock unlimited access to all templates.',
    features: ['Free templates available', 'Pro plan: $10/mo', 'All-inclusive access'],
    path: Routes.TEMPLATES,
    video:
      '/Sammy_El-Sherif_Create_me_a_visual_of_a_bunch_of_falling_noti_9bb20dcc-0c00-4d97-95c4-e0c3f79ada37_0.mp4',
  },
]

const ServicesSection = () => {
  const { ref, isVisible } = useScrollReveal()
  const router = useRouter()

  const handleCardClick = (e: React.MouseEvent, service: Service) => {
    e.preventDefault()
    e.stopPropagation()

    router.push(service.path).catch((err) => {
      console.error('Navigation error:', err)
      window.location.href = service.path
    })
  }

  return (
    <section id="services" className={styles.section} ref={ref}>
      <span className={styles.divider} />
      <span className={styles.divider} />
      <div className={styles.grid}>
        {services.map((service, index) => (
          <div
            key={service.title}
            className={cn(styles.card, styles.reveal, { [styles.visible]: isVisible })}
            style={{ transitionDelay: `${150 + index * 100}ms` }}
            onClick={(e) => handleCardClick(e, service)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                e.stopPropagation()
                router.push(service.path)
              }
            }}
          >
            {service.video && (
              <video
                className={styles.cardVideo}
                src={service.video}
                autoPlay
                loop
                muted
                playsInline
              />
            )}
            <span className={styles.number}>{service.number}</span>

            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{service.title}</h3>
              <p className={styles.cardDescription}>{service.description}</p>
              <ul className={styles.featureList}>
                {service.features.map((feature) => (
                  <li key={feature} className={styles.featureItem}>
                    <span className={styles.featureDot} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ServicesSection
