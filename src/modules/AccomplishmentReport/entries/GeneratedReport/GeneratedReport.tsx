import ReactMarkdown from 'react-markdown'

type GeneratedReportProps = {
  response: string | null
  mocked: boolean
}

const GeneratedReport = ({ response, mocked }: GeneratedReportProps) => {
  return (
    <>
      <ReactMarkdown>{response}</ReactMarkdown>
      <div>Mocked Response: {mocked.toString()}</div>
    </>
  )
}

export default GeneratedReport
