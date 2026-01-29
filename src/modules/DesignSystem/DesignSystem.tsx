import { SectionContainer } from '@/components'
import {
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Divider,
  IconArrowDown,
  IconCritical,
  InputField,
  Loading,
  Select,
  Text,
} from '@workpace/design-system'
import { useState } from 'react'
import styles from './DesignSystem.module.scss'

export const DesignSystem = () => {
  const [isLoading, setIsLoading] = useState(false)

  const handleLoadingDemo = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }
  const currentVersion = process.env.NEXT_PUBLIC_WDS_VERSION
  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>🎨 Design System</h1>
        <p className={styles.subtitle}>
          A comprehensive component library built for modern applications
        </p>
      </div>

      {/* Components Section */}
      <SectionContainer className={styles.sectionCard}>
        <div className={styles.cardHeader}>
          <h2>Core Components</h2>
          <p className={styles.cardSubtitle}>Essential building blocks for your applications</p>
        </div>

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
      </SectionContainer>

      {/* Patterns Section */}
      <SectionContainer className={styles.sectionCard}>
        <div className={styles.cardHeader}>
          <h2>Design Patterns</h2>
          <p className={styles.cardSubtitle}>Common UI patterns and layouts</p>
        </div>

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
            <Divider size="md" color="#667eea" />
            <Text variant="body-md">Clear visual separation between sections</Text>
          </div>
        </div>
      </SectionContainer>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.footerContent}>
          <Text as="div" variant="headline-sm">
            WorkPace Design System
          </Text>
          <Text as="div" variant="body-sm">
            Built with precision and care for modern applications
          </Text>
        </div>
        <div className={styles.footerActions}>
          <Badge variant="success">v{currentVersion || '1.0.0'}</Badge>
          <Badge variant="info">React 18+</Badge>
          <Badge variant="warning">TypeScript</Badge>
        </div>
      </div>
    </div>
  )
}
