// import { useRef, useState } from 'react'
// import { Button, Text } from '@workpace/design-system'
// import styles from './GenerateReportUserPromptInput.module.scss'
import { MultiStepForm } from '../../entries'
// import { useGenerateReport, useNotionDatabasePages } from '../../hooks'
// import ReactLoading from 'react-loading'
// import { SectionContainer } from '@/components'

export const GenerateReportUserPromptInput = () => {
  // TODO: find scroll fix - issue is auto scroll on page load with hero component
  /* const hasMounted = useRef(false);
  useEffect(() => {
    if (hasMounted.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      hasMounted.current = true;
    }
  }, [isLoading]) */

  return (
    <div>
      <MultiStepForm />
    </div>
  )
}
