import { useMemo, useState, useEffect } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table'
import { useSavedReports } from '@/hooks'
import { SavedReport } from '@/interfaces/saved-reports'
import { Text, Button } from '@workpace/design-system'
import styles from './SavedReportsTable.module.scss'

const columnHelper = createColumnHelper<SavedReport>()

export const SavedReportsTable = () => {
  const { savedReports, isLoading, error, refetch } = useSavedReports()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  useEffect(() => {
    refetch()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleViewReport = (report: SavedReport) => {
    // Open report in a new window or modal
    const newWindow = window.open('', '_blank')
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${report.title}</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                max-width: 800px;
                margin: 40px auto;
                padding: 20px;
                line-height: 1.6;
              }
              h1 { color: #212529; }
              pre { background: #f8f9fa; padding: 15px; border-radius: 8px; overflow-x: auto; }
            </style>
          </head>
          <body>
            <h1>${report.title}</h1>
            <p><strong>Format:</strong> ${report.format}</p>
            <p><strong>Created:</strong> ${formatDate(report.created_at)}</p>
            ${report.prompt_used ? `<p><strong>Prompt:</strong> ${report.prompt_used}</p>` : ''}
            <hr>
            ${report.format === 'markdown' 
              ? `<div>${report.content.replace(/\n/g, '<br>')}</div>` 
              : `<pre>${report.content}</pre>`}
          </body>
        </html>
      `)
      newWindow.document.close()
    }
  }

  const handleDeleteReport = async (id: string) => {
    if (!confirm('Are you sure you want to delete this report?')) return

    try {
      const response = await fetch(`/api/good-stuff-list/saved-reports/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete report')
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
        cell: (info) => (
          <Text variant="body-md-emphasis">{info.getValue()}</Text>
        ),
      }),
      columnHelper.accessor('format', {
        header: 'Format',
        cell: (info) => (
          <Text variant="body-sm" color="neutral-600">
            {info.getValue()}
          </Text>
        ),
      }),
      columnHelper.accessor('created_at', {
        header: 'Created',
        cell: (info) => (
          <Text variant="body-sm" color="neutral-600">
            {formatDate(info.getValue())}
          </Text>
        ),
      }),
      columnHelper.accessor('prompt_used', {
        header: 'Prompt',
        cell: (info) => {
          const prompt = info.getValue()
          if (!prompt) return <Text variant="body-sm" color="neutral-400">—</Text>
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
            <Button
              variant="default-secondary"
              size="sm"
              onClick={() => handleViewReport(info.row.original)}
            >
              View
            </Button>
            <Button
              variant="default-secondary"
              size="sm"
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

  const table = useReactTable({
    data: savedReports,
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

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Text>Loading saved reports...</Text>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.error}>
        <Text color="urgent-600">Error loading saved reports: {error.message}</Text>
      </div>
    )
  }

  if (savedReports.length === 0) {
    return (
      <div className={styles.empty}>
        <Text>No saved reports yet. Generate and save a report to see it here.</Text>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Text variant="headline-md-emphasis">Saved Reports</Text>
      </div>
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
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className={styles.tr}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className={styles.td}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
