import React, { FunctionComponent } from 'react'

import Head from 'next/head'

type DocumentTitleProps = {
  title?: string
}

const DocumentTitle: FunctionComponent<DocumentTitleProps> = ({ title }) => {
  return (
    <Head>
      <title>{title}</title>
    </Head>
  )
}

export default DocumentTitle
