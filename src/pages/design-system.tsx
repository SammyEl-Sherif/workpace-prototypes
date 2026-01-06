import React, { useState } from 'react'
import {
  Button,
  Select,
  Text,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  InputField,
  Loading,
  Divider,
  Box,
  IconArrowDown,
  IconCritical,
} from '@workpace/design-system'
import styles from './design-system.module.scss'

export default function DesignSystem() {
  const [isLoading, setIsLoading] = useState(false)

  const handleLoadingDemo = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <div className={styles.showcase}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <Text as="div" variant="headline-display" className={styles.heroTitle}>
            WorkPace Design System
          </Text>
          <Text variant="body-lg" as="div" marginY={200} className={styles.heroSubtitle}>
            A comprehensive component library built for modern applications
          </Text>
          <div className={styles.heroActions}>
            <Button variant="brand-primary" className={styles.buttonHero}>
              Get Started
            </Button>
            <Button variant="default-secondary" className={styles.buttonHero}>
              View Documentation
            </Button>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.floatingCard}>
            <Card variant="gradient">
              <CardHeader center>
                <CardTitle>Design Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <Text variant="body-md">Crafted with precision for seamless user experiences</Text>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navContent}>
          <Text variant="headline-sm" className={styles.navBrand}>
            WorkPace DS
          </Text>
          <div className={styles.navLinks}>
            <Badge variant="outline" as="a" href="#components">
              Components
            </Badge>
            <Badge variant="outline" as="a" href="#patterns">
              Patterns
            </Badge>
            <Badge variant="outline" as="a" href="#tokens">
              Tokens
            </Badge>
          </div>
        </div>
      </nav>

      {/* Components Section */}
      <section id="components" className={styles.section}>
        <div className={styles.container}>
          <Text variant="headline-lg" className={styles.sectionTitle}>
            Core Components
          </Text>
          <Text variant="body-lg" className={styles.sectionSubtitle}>
            Essential building blocks for your applications
          </Text>

          {/* Buttons */}
          <div className={styles.componentGroup}>
            <Text variant="headline-md" className={styles.componentTitle}>
              Buttons
            </Text>
            <div className={styles.componentDemo}>
              <div className={styles.buttonGrid}>
                <Button variant="brand-primary">Brand Primary</Button>
                <Button variant="brand-secondary">Brand Secondary</Button>
                <Button variant="default-primary">Default Primary</Button>
                <Button variant="default-secondary">Default Secondary</Button>
              </div>
            </div>
          </div>

          <Divider size="lg" />

          {/* Badges */}
          <div className={styles.componentGroup}>
            <Text variant="headline-md" className={styles.componentTitle}>
              Badges
            </Text>
            <div className={styles.componentDemo}>
              <div className={styles.badgeGrid}>
                <Badge variant="default">Default</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="error">Error</Badge>
              </div>
              <div className={styles.badgeSizes}>
                <Badge variant="success" size="sm">
                  Small
                </Badge>
                <Badge variant="success" size="md">
                  Medium
                </Badge>
                <Badge variant="success" size="lg">
                  Large
                </Badge>
              </div>
            </div>
          </div>

          <Divider size="lg" />

          {/* Cards */}
          <div className={styles.componentGroup}>
            <Text variant="headline-md" className={styles.componentTitle}>
              Cards
            </Text>
            <div className={styles.componentDemo}>
              <div className={styles.cardGrid}>
                <Card variant="default" className={styles.demoCard}>
                  <CardHeader>
                    <CardTitle>Default Card</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Text variant="body-md">Clean and minimal design for everyday use</Text>
                  </CardContent>
                  <CardFooter>
                    <Button variant="default-primary">Action</Button>
                  </CardFooter>
                </Card>

                <Card variant="gradient" className={styles.demoCard}>
                  <CardHeader>
                    <CardTitle>Gradient Card</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Text variant="body-md">Eye-catching gradient background for highlights</Text>
                  </CardContent>
                  <CardFooter>
                    <Button variant="brand-primary">Action</Button>
                  </CardFooter>
                </Card>

                <Card variant="hero" className={styles.demoCard}>
                  <CardHeader center>
                    <CardTitle>Hero Card</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Text variant="body-md">Prominent styling for featured content</Text>
                  </CardContent>
                  <CardFooter>
                    <Button variant="brand-secondary">Action</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>

          <Divider size="lg" />

          {/* Form Elements */}
          <div className={styles.componentGroup}>
            <Text variant="headline-md" className={styles.componentTitle}>
              Form Elements
            </Text>
            <div className={styles.componentDemo}>
              <div className={styles.formGrid}>
                <InputField
                  label="Email Address"
                  placeholder="Enter your email"
                  helperText="We'll never share your email"
                />
                <InputField
                  label="Password"
                  placeholder="Enter your password"
                  errorText="Password is required"
                />
                <Select label="Country">
                  <option value="">Select a country</option>
                  <option value="us">United States</option>
                  <option value="ca">Canada</option>
                  <option value="uk">United Kingdom</option>
                </Select>
              </div>
            </div>
          </div>

          <Divider size="lg" />

          {/* Interactive Elements */}
          <div className={styles.componentGroup}>
            <Text variant="headline-md" className={styles.componentTitle}>
              Interactive Elements
            </Text>
            <div className={styles.componentDemo}>
              <div className={styles.interactiveGrid}>
                <div className={styles.loadingDemo}>
                  <Text variant="body-md">Loading States</Text>
                  <div className={styles.loadingGrid}>
                    <Loading size="sm" color="#2563eb" />
                    <Loading size="md" color="#10b981" />
                    <Loading size="lg" color="#f59e0b" />
                  </div>
                  <Button variant="default-primary" onClick={handleLoadingDemo}>
                    {isLoading ? <Loading size="sm" /> : 'Show Loading'}
                  </Button>
                </div>

                <div className={styles.iconDemo}>
                  <Text variant="body-md">Icons</Text>
                  <div className={styles.iconGrid}>
                    <IconArrowDown variant="md" />
                    <IconCritical variant="md" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Patterns Section */}
      <section id="patterns" className={styles.section}>
        <div className={styles.container}>
          <Text variant="headline-lg" className={styles.sectionTitle}>
            Design Patterns
          </Text>
          <Text variant="body-lg" className={styles.sectionSubtitle}>
            Common UI patterns and layouts
          </Text>

          <div className={styles.patternGrid}>
            <Box
              backgroundColor="neutral-100"
              paddingX={400}
              paddingY={300}
              className={styles.patternCard}
            >
              <Text variant="headline-sm">Layout Box</Text>
              <Text variant="body-md">Flexible container with consistent spacing</Text>
            </Box>

            <div className={styles.patternCard}>
              <Text variant="headline-sm">Content Divider</Text>
              <Divider size="md" color="#2563eb" />
              <Text variant="body-md">Clear visual separation between sections</Text>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <Text as="div" variant="headline-sm">
              WorkPace Design System
            </Text>
            <Text as="div" variant="body-sm">
              Built with precision and care for modern applications
            </Text>
          </div>
          <div className={styles.footerActions}>
            <Badge variant="success">v1.0.7</Badge>
            <Badge variant="info">React 18+</Badge>
            <Badge variant="warning">TypeScript</Badge>
          </div>
        </div>
      </footer>
    </div>
  )
}
