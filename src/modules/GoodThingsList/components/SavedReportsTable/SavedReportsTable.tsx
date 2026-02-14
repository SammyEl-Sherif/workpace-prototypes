import { useManualFetch, useSavedReports } from '@/hooks'
import { SavedReport } from '@/interfaces/saved-reports'
import { formatDateTime } from '@/utils'
import {
  ColumnFiltersState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { Badge, Button, Loading, Text } from '@workpace/design-system'
import { useEffect, useMemo, useState } from 'react'
import { ReportModal } from '../ReportModal'
import styles from './SavedReportsTable.module.scss'

const columnHelper = createColumnHelper<SavedReport>()

interface SavedReportsTableProps {
  isLoadingReport?: boolean
  generatingReportId?: string | null
}

export const SavedReportsTable = ({
  isLoadingReport = false,
  generatingReportId = null,
}: SavedReportsTableProps) => {
  const { savedReports, isLoading, error, refetch } = useSavedReports()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [selectedReport, setSelectedReport] = useState<SavedReport | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const deleteSavedReport = useManualFetch<{ data: null }>('')

  useEffect(() => {
    refetch()
  }, [])

  const handleViewReport = (report: SavedReport) => {
    setSelectedReport(report)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedReport(null)
  }

  const handleDeleteReport = async (id: string) => {
    if (!confirm('Are you sure you want to delete this report?')) return

    try {
      const [result, error] = await deleteSavedReport({
        method: 'delete',
        url: `good-stuff-list/saved-reports/${id}`,
      })

      if (error) {
        throw error
      }

      await refetch()
    } catch (err: any) {
      alert(err.message || 'Failed to delete report')
    }
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor('title', {
        header: 'Title',
        cell: (info) => <Text variant="body-md-emphasis">{info.getValue()}</Text>,
      }),
      columnHelper.accessor('format', {
        header: 'Format',
        cell: (info) => (
          <Badge variant="default" size="sm">
            {info.getValue()}
          </Badge>
        ),
      }),
      columnHelper.accessor('created_at', {
        header: 'Created',
        cell: (info) => (
          <Text variant="body-sm" color="neutral-600">
            {formatDateTime(info.getValue())}
          </Text>
        ),
      }),
      columnHelper.accessor('prompt_used', {
        header: 'Prompt',
        cell: (info) => {
          const prompt = info.getValue()
          if (!prompt)
            return (
              <Text variant="body-sm" color="neutral-400">
                —
              </Text>
            )
          const truncated = prompt.length > 50 ? prompt.substring(0, 50) + '...' : prompt
          return (
            <Text variant="body-sm" color="neutral-600" title={prompt}>
              {truncated}
            </Text>
          )
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: (info) => (
          <div className={styles.actions}>
            <Button variant="default-secondary" onClick={() => handleViewReport(info.row.original)}>
              View
            </Button>
            <Button
              variant="default-secondary"
              onClick={() => handleDeleteReport(info.row.original.id)}
            >
              Delete
            </Button>
          </div>
        ),
      }),
    ],
    []
  )

  // Add loading row if generating
  const tableData = useMemo(() => {
    if (isLoadingReport && generatingReportId) {
      // Check if the generating report is already in the list
      const exists = savedReports.some((r) => r.id === generatingReportId)
      if (!exists) {
        // Add a temporary loading row
        return [
          {
            id: generatingReportId,
            title: 'Generating...',
            format: 'markdown' as const,
            created_at: new Date().toISOString(),
            prompt_used: null,
            user_id: '',
            content: '',
            updated_at: new Date().toISOString(),
            isGenerating: true,
          },
          ...savedReports,
        ]
      }
    }
    return savedReports
  }, [savedReports, isLoadingReport, generatingReportId])

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
  })

  if (isLoading && !isLoadingReport) {
    return (
      <div className={styles.loading}>
        <Loading size="md" />
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.error}>
        <Text color="error-600">Error loading saved reports: {error.message}</Text>
      </div>
    )
  }

  const hasRows = table.getRowModel().rows.length > 0

  return (
    <>
      <div className={styles.container}>
        {/* Desktop: Table view */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className={styles.th}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={styles.headerCell}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: ' ↑',
                            desc: ' ↓',
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {!hasRows && !isLoadingReport ? (
                <tr>
                  <td colSpan={columns.length} className={styles.empty}>
                    <Text variant="headline-sm-emphasis">No reports yet</Text>
                    <Text variant="body-md" color="neutral-600">
                      Generate your first report using the form above.
                    </Text>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => {
                  const isGenerating = (row.original as any).isGenerating
                  return (
                    <tr key={row.id} className={styles.tr}>
                      {isGenerating ? (
                        <td colSpan={columns.length} className={styles.loadingRow}>
                          <div className={styles.loadingState}>
                            <Loading size="sm" />
                            <Text>AI is crafting your report...</Text>
                          </div>
                        </td>
                      ) : (
                        row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className={styles.td}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))
                      )}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile: Card view */}
        <div className={styles.cardList}>
          {isLoadingReport && generatingReportId && (
            <div className={styles.reportCard}>
              <div className={styles.loadingState}>
                <Loading size="sm" />
                <Text>AI is crafting your report...</Text>
              </div>
            </div>
          )}
          {tableData.filter((r) => !(r as any).isGenerating).length === 0 && !isLoadingReport ? (
            <div className={styles.emptyCard}>
              <Text variant="headline-sm-emphasis">No reports yet</Text>
              <Text color="neutral-600">
                Generate your first report using the form above.
              </Text>
            </div>
          ) : (
            tableData
              .filter((r) => !(r as any).isGenerating)
              .map((report) => (
                <div key={report.id} className={styles.reportCard}>
                  <div className={styles.reportCardHeader}>
                    <Text variant="headline-sm-emphasis">{report.title}</Text>
                    <Text variant="body-sm" color="neutral-400">
                      {formatDateTime(report.created_at)}
                    </Text>
                  </div>
                  {report.prompt_used && (
                    <Text variant="body-sm" color="neutral-600" marginTop={100}>
                      {report.prompt_used.length > 80
                        ? report.prompt_used.substring(0, 80) + '...'
                        : report.prompt_used}
                    </Text>
                  )}
                  <div className={styles.reportCardActions}>
                    <Button variant="default-secondary" onClick={() => handleViewReport(report)}>
                      View
                    </Button>
                    <Button
                      variant="default-secondary"
                      onClick={() => handleDeleteReport(report.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      <ReportModal isOpen={isModalOpen} onClose={handleCloseModal} report={selectedReport} />
    </>
  )
}
