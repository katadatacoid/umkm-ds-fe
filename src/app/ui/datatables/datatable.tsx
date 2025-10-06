'use client'

import React, { useMemo, useState, useEffect, useRef } from 'react'

// ------------------------------------------------------------
// Types
// ------------------------------------------------------------
export type Person = {
    id: number
    name: string
    email: string
    role: 'Admin' | 'Editor' | 'Viewer'
    team: string
    createdAt: string // ISO
}

export type SortState<T> = { key: keyof T, dir: 'asc' | 'desc' } | null

// ------------------------------------------------------------
// Utilities (pure helpers) — also used by inline tests
// ------------------------------------------------------------
export function classNames(...xs: (string | false | null | undefined)[]) {
    return xs.filter(Boolean).join(' ')
}

export function formatDate(iso: string) {
    const d = new Date(iso)
    return d.toLocaleDateString()
}

export function sortRows<T extends Record<string, any>>(rows: T[], key: keyof T, dir: 'asc' | 'desc') {
    return [...rows].sort((a, b) => {
        const va = a[key]
        const vb = b[key]
        if (va == null && vb == null) return 0
        if (va == null) return dir === 'asc' ? -1 : 1
        if (vb == null) return dir === 'asc' ? 1 : -1

        if (typeof va === 'number' && typeof vb === 'number') {
            return dir === 'asc' ? va - vb : vb - va
        }
        const sa = String(va)
        const sb = String(vb)
        return dir === 'asc' ? sa.localeCompare(sb) : sb.localeCompare(sa)
    })
}

export function filterRows<T extends Record<string, any>>(rows: T[], query: string, keys: (keyof T)[]) {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((r) => keys.some((k) => String(r[k] ?? '').toLowerCase().includes(q)))
}

export function paginateRows<T>(rows: T[], page: number, pageSize: number) {
    const total = rows.length
    const pages = Math.max(1, Math.ceil(total / pageSize))
    const current = Math.min(Math.max(1, page), pages)
    const start = (current - 1) * pageSize
    const pageRows = rows.slice(start, start + pageSize)
    return { pageRows, pages, total, start, current }
}

// ---------- CSV helpers ----------
export function toCSV<T>(
    columns: { key: keyof T; header?: string; map?: (value: any, row: T) => any }[],
    rows: T[]
) {
    const headers = columns.map((c) => (c.header ?? String(c.key)))
    const escape = (v: any) => `"${String(v ?? '').replaceAll('"', '""')}"`
    const lines = rows.map((row) =>
        columns
            .map((c) => {
                const v = c.map ? c.map((row as any)[c.key as any], row) : (row as any)[c.key as any]
                return escape(v)
            })
            .join(',')
    )
    return [headers.join(','), ...lines].join('\n')
}

export function saveCSV(filename: string, csv: string) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
}

export function downloadCSV(filename: string, rows: object[]) {
    if (!rows.length) return
    const headers = Object.keys(rows[0])
    const escape = (v: any) => `"${String(v).replaceAll('"', '""')}"`
    const csv = [headers.join(','), ...rows.map((r) => headers.map((h) => escape((r as any)[h])).join(','))].join('\n')
    saveCSV(filename, csv)
}

// ------------------------------------------------------------
// Demo Data (replace with your fetch)
// ------------------------------------------------------------
function useDemoData() {
    const [data, setData] = useState<Person[]>([])
    useEffect(() => {
        const roles = ['Admin', 'Editor', 'Viewer'] as const
        const teams = ['Alpha', 'Bravo', 'Charlie', 'Delta']
        const arr: Person[] = Array.from({ length: 137 }).map((_, i) => ({
            id: i + 1,
            name: `User ${i + 1}`,
            email: `user${i + 1}@example.com`,
            role: roles[i % roles.length],
            team: teams[i % teams.length],
            createdAt: new Date(Date.now() - i * 86400000).toISOString(),
        }))
        setData(arr)
    }, [])
    return data
}

// ------------------------------------------------------------
// DataTable Component
// ------------------------------------------------------------
export interface Column<T> {
    key: keyof T
    header: string
    width?: string
    render?: (value: any, row: T) => React.ReactNode
}

interface RowAction<T> {
    label: string
    onClick: (row: T) => void
}

interface DataTableProps<T> {
    rows: T[]
    columns: Column<T>[]
    initialSort?: SortState<T>
    pageSizes?: number[]
    searchableKeys?: (keyof T)[]
    /** Show selection checkboxes and a bulk bar */
    selectable?: boolean
    /** Optional per-row actions (rendered as small buttons on desktop, inline in cards on mobile) */
    rowActions?: RowAction<T>[]
    /** Row click handler (ignored when clicking a control) */
    onRowClick?: (row: T) => void
    /** Controlled key extractor; defaults to (row as any).id ?? index */
    getRowId?: (row: T, index: number) => string | number
    /** Loading / error states */
    isLoading?: boolean
    error?: string | null
    /** Export behavior */
    exportMode?: 'filtered' | 'page' | 'selected'
    exportColumns?: { key: keyof T; header?: string; map?: (value: any, row: T) => any }[]
    filename?: string
    /** If provided, export will fetch from this provider (e.g., server-side full dataset) */
    onExportAll?: () => Promise<T[]>
    showToolbar?: boolean // New prop to control toolbar visibility
}

export default function DataTable<T extends Record<string, any>>({
    rows,
    columns,
    initialSort = null,
    pageSizes = [10, 25, 50, 100],
    searchableKeys,
    selectable = false,
    rowActions,
    onRowClick,
    getRowId,
    isLoading = false,
    error = null,
    exportMode = 'filtered',
    exportColumns,
    filename = 'table.csv',
    onExportAll,
    showToolbar = true, // Default to true to show the toolbar
}: DataTableProps<T>) {
    const [query, setQuery] = useState('')
    const [sort, setSort] = useState<SortState<T>>(initialSort)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(pageSizes[0]!)
    const keyOf = (row: T, i: number) => (getRowId ? getRowId(row, i) : ((row as any).id ?? i)) as string | number

    // Filter
    const filtered = useMemo(() => {
        const keys = searchableKeys ?? (Object.keys(rows[0] || {}) as (keyof T)[])
        return filterRows(rows, query, keys)
    }, [rows, query, searchableKeys])

    // Sort
    const sorted = useMemo(() => {
        if (!sort) return filtered
        return sortRows(filtered, sort.key, sort.dir)
    }, [filtered, sort])

    // Pagination
    const { pageRows: paged, pages, total, start, current } = useMemo(
        () => paginateRows(sorted, page, pageSize),
        [sorted, page, pageSize]
    )

    // Selection
    const [selected, setSelected] = useState<Set<string | number>>(new Set())
    useEffect(() => { setSelected(new Set()) }, [page, pageSize, query, JSON.stringify(sort)])
    const pageIds = useMemo(() => paged.map(keyOf), [paged])
    const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selected.has(id))
    const togglePageAll = () => {
        setSelected((prev) => {
            const next = new Set(prev)
            if (allPageSelected) {
                pageIds.forEach((id) => next.delete(id))
            } else {
                pageIds.forEach((id) => next.add(id))
            }
            return next
        })
    }
    const toggleOne = (id: string | number) => {
        setSelected((prev) => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
    }

    const setSortKey = (key: keyof T) => {
        setPage(1)
        setSort((prev) => {
            if (!prev || prev.key !== key) return { key, dir: 'asc' }
            return { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        })
    }

    const [exporting, setExporting] = useState(false)
    const columnsForExport = useMemo(() => {
        if (exportColumns?.length) return exportColumns
        // default: mirror visible columns order
        return columns.map((c) => ({ key: c.key, header: c.header }))
    }, [exportColumns, columns])

    // Horizontal scroll detection for wide tables
    const scrollRef = useRef<HTMLDivElement>(null)
    const [hasOverflow, setHasOverflow] = useState(false)
    useEffect(() => {
        const el = scrollRef.current
        if (!el) return
        const check = () => setHasOverflow(el.scrollWidth > el.clientWidth)
        check()
        const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(check) : null
        ro?.observe(el)
        const onResize = () => check()
        window.addEventListener('resize', onResize)
        return () => { ro?.disconnect(); window.removeEventListener('resize', onResize) }
    }, [paged, columns, pageSize, query, sort, isLoading])

    async function handleExport() {
        try {
            setExporting(true)
            let data: T[]
            if (onExportAll) {
                // Server-provided full dataset
                data = await onExportAll()
            } else {
                // Client-side export from what we have
                if (exportMode === 'selected' && selected.size) {
                    data = paged.filter((row, i) => selected.has(keyOf(row, i)))
                } else if (exportMode === 'page') {
                    data = paged
                } else {
                    data = sorted
                }
            }
            const csv = toCSV<T>(columnsForExport as any, data)
            saveCSV(filename, csv)
        } finally {
            setExporting(false)
        }
    }

    return (
        <div className="max-w-screen" style={{ width: '' }}>
            {/* Error / Info banners */}
            {error && (
                <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
            )}

            {/* Bulk bar (selection) */}
            {selectable && selected.size > 0 && (
                <div className="mb-3 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                    <span><strong>{selected.size}</strong> selected</span>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setSelected(new Set())} className="rounded-lg border border-emerald-300 px-2 py-1 text-xs hover:bg-emerald-100">Clear</button>
                        {/* Example bulk action hook point */}
                    </div>
                </div>
            )}

            {/* Toolbar */}
            {/* Toolbar (Conditionally rendered) */}
            {showToolbar && (
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                        <input
                            value={query}
                            onChange={(e) => {
                                setPage(1)
                                setQuery(e.target.value)
                            }}
                            placeholder="Search..."
                            className="w-full sm:w-64 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-green-500"
                            aria-label="Search rows"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={handleExport}
                                disabled={exporting}
                                className="flex-1 sm:flex-none rounded-xl border border-gray-300 px-3 py-2 text-sm shadow-sm hover:bg-gray-50 disabled:opacity-50"
                            >
                                {exporting ? 'Exporting…' : 'Export CSV'}
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="hidden text-sm text-gray-600 sm:block">Rows per page</label>
                        <select
                            value={pageSize}
                            onChange={(e) => {
                                setPage(1)
                                setPageSize(Number(e.target.value))
                            }}
                            className="rounded-xl border border-gray-300 bg-white px-2 py-2 text-sm shadow-sm"
                            aria-label="Rows per page"
                        >
                            {pageSizes.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {/* Mobile Cards (≤ sm) */}
            <div className="grid gap-3 sm:hidden">
                {isLoading && (
                    [...Array(pageSize)].map((_, i) => (
                        <div key={i} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                            <div className="mb-2 h-5 w-32 animate-pulse rounded bg-gray-200" />
                            <div className="grid gap-2">
                                <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
                                <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
                            </div>
                        </div>
                    ))
                )}
                {!isLoading && paged.map((row, i) => {
                    const id = keyOf(row, i)
                    return (
                        <div key={String(id)} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                            <div className="mb-2 flex items-center justify-between">
                                <div className="font-semibold text-gray-900">{String((row as any).name ?? (row as any).id)}</div>
                                {columns.find(c => c.key === 'role') && (
                                    <div className="text-xs text-gray-500">{String(row['role' as keyof T] ?? '')}</div>
                                )}
                            </div>
                            <dl className="grid grid-cols-1 gap-1 text-sm">
                                {columns.map((c) => (
                                    <div key={String(c.key)} className="flex gap-2">
                                        <dt className="min-w-20 shrink-0 text-gray-500">{c.header}</dt>
                                        <dd className="text-gray-800">
                                            {c.render ? c.render(row[c.key], row) : String(row[c.key] ?? '')}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                            <div className="mt-3 flex items-center justify-between">
                                {selectable ? (
                                    <label className="inline-flex items-center gap-2 text-sm">
                                        <input type="checkbox" checked={selected.has(id)} onChange={() => toggleOne(id)} />
                                        <span className="text-gray-600">Select</span>
                                    </label>
                                ) : <span />}
                                {rowActions?.length ? (
                                    <div className="flex gap-2">
                                        {rowActions.map((a, idx) => (
                                            <button key={idx} onClick={() => a.onClick(row)} className="rounded-lg border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50">
                                                {a.label}
                                            </button>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    )
                })}
                {!isLoading && !paged.length && (
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-gray-500">No data</div>
                )}
            </div>

            {/* Desktop Table (≥ sm) */}
            <div className="w-full hidden sm:block rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="relative">
                    <div className="overflow-x-auto w-full" role="region" aria-label="Scrollable data table">
                        <table className="min-w-max text-left text-sm">
                            <thead className="sticky top-0 z-10 bg-gray-50">
                                <tr>
                                    {selectable && (
                                        <th className="px-4 py-3">
                                            <input type="checkbox" aria-label="Select all on page" checked={allPageSelected} onChange={togglePageAll} />
                                        </th>
                                    )}
                                    {columns.map((c) => {
                                        const isSorted = sort?.key === c.key
                                        const dir = isSorted ? sort!.dir : undefined
                                        return (
                                            <th
                                                key={String(c.key)}
                                                style={{ width: c.width }}
                                                className="select-none whitespace-nowrap px-4 py-3 font-semibold text-gray-700"
                                                scope="col"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => setSortKey(c.key)}
                                                    className="group inline-flex items-center gap-1"
                                                    title="Sort"
                                                    aria-label={`Sort by ${c.header}`}
                                                >
                                                    <span>{c.header}</span>
                                                    <span
                                                        className={classNames(
                                                            'transition-transform',
                                                            isSorted && dir === 'asc' && 'rotate-180'
                                                        )}
                                                    >
                                                        {/* caret icon */}
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-gray-600">
                                                            <polyline points="6 9 12 15 18 9" />
                                                        </svg>
                                                    </span>
                                                </button>
                                            </th>
                                        )
                                    })}
                                    {/* Only add Actions column header without sticky */}
                                    {rowActions?.length && (
                                        <th className="px-4 py-3 text-right sticky right-0 bg-white z-10">Actions</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    [...Array(pageSize)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            {selectable && <td className="px-4 py-3"><div className="h-4 w-4 rounded bg-gray-200" /></td>}
                                            {columns.map((c, j) => (
                                                <td key={j} className="px-4 py-3"><div className="h-4 w-32 rounded bg-gray-200" /></td>
                                            ))}
                                            {rowActions?.length ? <td className="px-4 py-3 text-right"><div className="h-6 w-16 rounded bg-gray-200" /></td> : null}
                                        </tr>
                                    ))
                                ) : (
                                    paged.map((row, i) => {
                                        const id = keyOf(row, i)
                                        return (
                                            <tr key={String(id)} className={classNames(i % 2 === 0 ? 'bg-white' : 'bg-gray-50', 'hover:bg-green-50/50')} onClick={(e) => {
                                                const target = e.target as HTMLElement
                                                if (['INPUT', 'BUTTON', 'A', 'SVG', 'PATH'].includes(target.tagName)) return
                                                onRowClick?.(row)
                                            }}>
                                                {selectable && (
                                                    <td className="px-4 py-3">
                                                        <input type="checkbox" aria-label="Select row" checked={selected.has(id)} onChange={() => toggleOne(id)} />
                                                    </td>
                                                )}
                                                {columns.map((c) => (
                                                    <td key={String(c.key)} className="px-4 py-3 text-gray-800 whitespace-nowrap">
                                                        {c.render ? c.render(row[c.key], row) : String(row[c.key] ?? '')}
                                                    </td>
                                                ))}
                                                {/* Sticky Actions Column (only in the body) */}
                                                {rowActions?.length ? (
                                                    <td className="px-4 py-3 text-right sticky right-0 bg-white z-10">
                                                        <div className="inline-flex gap-2">
                                                            {rowActions.map((a, idx) => (
                                                                <button key={idx} onClick={() => a.onClick(row)} className="rounded-lg border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50">
                                                                    {a.label}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </td>
                                                ) : null}
                                            </tr>
                                        )
                                    })
                                )}
                                {!isLoading && !paged.length && (
                                    <tr>
                                        <td colSpan={(columns.length + (selectable ? 1 : 0) + (rowActions?.length ? 1 : 0))} className="px-4 py-12 text-center text-gray-500">
                                            No data
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>




            {/* Footer / Pagination (sticky on mobile) */}
            <div className="sticky bottom-0 z-10 mt-3 flex flex-col items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white/70 p-3 backdrop-blur sm:static sm:rounded-none sm:border-0 sm:bg-transparent sm:p-4 sm:backdrop-blur-0 sm:flex-row">
                <div className="text-xs text-gray-600 sm:text-sm">
                    Showing <span className="font-medium">{total ? start + 1 : 0}</span> to{' '}
                    <span className="font-medium">{Math.min(start + pageSize, total)}</span> of{' '}
                    <span className="font-medium">{total}</span>
                </div>
                <div className="flex w-full items-center justify-between gap-2 sm:w-auto">
                    <button
                        onClick={() => setPage(1)}
                        disabled={current === 1}
                        className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm disabled:opacity-40 sm:flex-none"
                    >
                        <span aria-hidden="true">&laquo;</span> First
                    </button>
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={current === 1}
                        className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm disabled:opacity-40 sm:flex-none"
                    >
                        <span aria-hidden="true">&lsaquo;</span> Prev
                    </button>
                    <span className="hidden px-2 text-sm text-gray-700 sm:inline">Page {current} / {pages}</span>
                    <button
                        onClick={() => setPage((p) => Math.min(pages, p + 1))}
                        disabled={current === pages}
                        className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm disabled:opacity-40 sm:flex-none"
                    >
                        Next <span aria-hidden="true">&rsaquo;</span>
                    </button>
                    <button
                        onClick={() => setPage(pages)}
                        disabled={current === pages}
                        className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm disabled:opacity-40 sm:flex-none"
                    >
                        Last <span aria-hidden="true">&raquo;</span>
                    </button>
                </div>
            </div>

            {/* Developer Test Panel (inline tests) */}
            {/* <TestPanel /> */}
        </div>
    )
}

// ------------------------------------------------------------
// Demo Page
// ------------------------------------------------------------
export function DemoDataTablePage() {
    const data = useDemoData()

    const columns = useMemo<Column<Person>[]>(
        () => [
            { key: 'id', header: 'ID', width: '80px' },
            { key: 'name', header: 'Name' },
            { key: 'email', header: 'Email' },
            {
                key: 'role', header: 'Role', width: '120px', render: (v) => (
                    <span className={classNames(
                        'rounded-full px-2 py-1 text-xs font-medium',
                        v === 'Admin' && 'bg-red-50 text-red-700',
                        v === 'Editor' && 'bg-blue-50 text-blue-700',
                        v === 'Viewer' && 'bg-emerald-50 text-emerald-700'
                    )}>{String(v)}</span>
                )
            },
            { key: 'team', header: 'Team', width: '120px' },
            { key: 'createdAt', header: 'Created', width: '140px', render: (v) => formatDate(String(v)) },
        ],
        []
    )

    return (
        <main className="mx-auto max-w-7xl p-6">
            <h1 className="mb-2 text-2xl font-bold tracking-tight">DataTable · Next.js 13+ · TSX · Tailwind</h1>
            <p className="mb-6 text-gray-600">Sorting, search, pagination, selectable page size, sticky header, zebra rows, CSV export. Replace the demo hook with your fetch logic.</p>

            <DataTable<Person>
                rows={data}
                columns={columns}
                initialSort={{ key: 'id', dir: 'asc' }}
                searchableKeys={['name', 'email', 'role', 'team']}
                selectable
                rowActions={[
                    { label: 'View', onClick: (row) => alert(`View id ${(row as any).id}`) },
                    { label: 'Email', onClick: (row) => window.open(`mailto:${(row as any).email}`) },
                ]}
                onRowClick={(row) => alert(`Row clicked: ${(row as any).name}`)}
                getRowId={(row) => (row as any).id}
                isLoading={false}
                error={null}
                exportMode="filtered"
                filename="people.csv"
            // 🔌 When you integrate with real data, pass these props:
            // onExportAll={async () => (await fetch('/api/users/export')).json()} // fetch full dataset from your API
            // exportColumns={[
            //   { key: 'id', header: 'ID' },
            //   { key: 'name', header: 'Name' },
            //   { key: 'email', header: 'Email' },
            //   { key: 'role', header: 'Role' },
            //   { key: 'team', header: 'Team' },
            //   { key: 'createdAt', header: 'Created', map: (v) => formatDate(String(v)) },
            // ]}
            />

            <section className="mt-10 text-sm text-gray-600">
                <h2 className="mb-2 text-base font-semibold text-gray-800">How to use in Next.js 13+</h2>
                <ol className="list-inside list-decimal space-y-1">
                    <li>Install Tailwind: <code>npm i -D tailwindcss postcss autoprefixer</code> then <code>npx tailwindcss init -p</code>.</li>
                    <li>Configure <code>tailwind.config.js</code> content to scan <code>./app/**/*.{'{'}ts,tsx{'}'}</code>, <code>./components/**/*.{'{'}ts,tsx{'}'}</code>.</li>
                    <li>Add Tailwind to <code>app/globals.css</code>: <code>@tailwind base; @tailwind components; @tailwind utilities;</code></li>
                    <li>Create a route at <code>app/datatable/page.tsx</code> and paste this file's default export there.</li>
                    <li>Replace <code>useDemoData()</code> with your data fetching; pass your rows into <code>DataTable</code>. For exporting **real data** (not demo), implement <code>onExportAll</code> or pass your full rows.</li>
                    <li>For server data, fetch in a Server Component and pass to a Client DataTable.</li>
                </ol>
            </section>
        </main>
    )
}

// ------------------------------------------------------------
// Inline Test Panel — simple, framework-less checks
// ------------------------------------------------------------
function TestPanel() {
    const [open, setOpen] = useState(false)
    const [results, setResults] = useState<{ name: string; pass: boolean; detail?: string }[]>([])

    function runTests() {
        const r: { name: string; pass: boolean; detail?: string }[] = []

        // Test 1: classNames composes and drops falsy
        try {
            const got = classNames('a', false, null, undefined, 'b')
            r.push({ name: 'classNames combines tokens', pass: got === 'a b', detail: `got="${got}"` })
        } catch (e: any) {
            r.push({ name: 'classNames combines tokens', pass: false, detail: String(e) })
        }

        // Test 2: formatDate returns a string
        try {
            const d = new Date('2024-01-02T00:00:00.000Z').toISOString()
            const s = formatDate(d)
            r.push({ name: 'formatDate returns string', pass: typeof s === 'string', detail: s })
        } catch (e: any) {
            r.push({ name: 'formatDate returns string', pass: false, detail: String(e) })
        }

        // Fixtures for table helpers
        type Row = { id: number; name?: string | null }
        const rows: Row[] = [
            { id: 3, name: 'Charlie' },
            { id: 1, name: 'Alpha' },
            { id: 2, name: 'Bravo' },
            { id: 4, name: null },
            { id: 5 },
        ]

        // Test 3: sortRows asc by id
        try {
            const got = sortRows(rows, 'id', 'asc').map((x) => x.id).join(',')
            r.push({ name: 'sortRows asc (number)', pass: got === '1,2,3,4,5', detail: got })
        } catch (e: any) {
            r.push({ name: 'sortRows asc (number)', pass: false, detail: String(e) })
        }

        // Test 4: sortRows desc by id
        try {
            const got = sortRows(rows, 'id', 'desc').map((x) => x.id).join(',')
            r.push({ name: 'sortRows desc (number)', pass: got === '5,4,3,2,1', detail: got })
        } catch (e: any) {
            r.push({ name: 'sortRows desc (number)', pass: false, detail: String(e) })
        }

        // Test 5: sortRows handles null/undefined (asc → nulls first)
        try {
            const got = sortRows(rows, 'name', 'asc').map((x) => x.name ?? '∅')
            const ok = got[0] === '∅' || got[0] === null
            r.push({ name: 'sortRows null/undefined handling', pass: ok, detail: got.join('|') })
        } catch (e: any) {
            r.push({ name: 'sortRows null/undefined handling', pass: false, detail: String(e) })
        }

        // Test 6: filterRows with empty query returns original
        try {
            const got = filterRows(rows, '', ['name']).length
            r.push({ name: 'filterRows empty query passthrough', pass: got === rows.length, detail: String(got) })
        } catch (e: any) {
            r.push({ name: 'filterRows empty query passthrough', pass: false, detail: String(e) })
        }

        // Test 7: filterRows matches by key
        try {
            const got = filterRows(rows, 'brav', ['name']).map((x) => x.name).join(',')
            r.push({ name: 'filterRows simple match', pass: got.toLowerCase().includes('bravo'), detail: got })
        } catch (e: any) {
            r.push({ name: 'filterRows simple match', pass: false, detail: String(e) })
        }

        // Test 8: paginateRows math
        try {
            const big = Array.from({ length: 25 }).map((_, i) => ({ i }))
            const { pageRows, pages, start, current } = paginateRows(big, 3, 10)
            const ok = pages === 3 && start === 20 && pageRows.length === 5 && current === 3
            r.push({ name: 'paginateRows last page', pass: ok, detail: `pages=${pages}, start=${start}, len=${pageRows.length}` })
        } catch (e: any) {
            r.push({ name: 'paginateRows last page', pass: false, detail: String(e) })
        }

        // Test 9: paginateRows first page
        try {
            const big2 = Array.from({ length: 25 }).map((_, i) => ({ i }))
            const { pageRows, pages, start, current } = paginateRows(big2, 1, 10)
            const ok = pages === 3 && start === 0 && pageRows.length === 10 && current === 1
            r.push({ name: 'paginateRows first page', pass: ok, detail: `pages=${pages}, start=${start}, len=${pageRows.length}` })
        } catch (e: any) {
            r.push({ name: 'paginateRows first page', pass: false, detail: String(e) })
        }

        // Test 10: filterRows trim + case-insensitive
        try {
            const rows2 = [{ name: 'Alpha' }, { name: 'beta' }] as any[]
            const got = filterRows(rows2 as any, '  ALP  ', ['name' as any]).map((x: any) => x.name).join(',')
            r.push({ name: 'filterRows trim + case-insensitive', pass: got.toLowerCase().includes('alpha'), detail: got })
        } catch (e: any) {
            r.push({ name: 'filterRows trim + case-insensitive', pass: false, detail: String(e) })
        }

        // Test 11: filterRows with backslash query shouldn't crash and likely returns 0
        try {
            const gotLen = filterRows(rows as any, '\\', ['name' as any]).length
            r.push({ name: 'filterRows backslash query', pass: gotLen === 0, detail: `len=${gotLen}` })
        } catch (e: any) {
            r.push({ name: 'filterRows backslash query', pass: false, detail: String(e) })
        }

        // Test 12: toCSV basic mapping
        try {
            const cols = [
                { key: 'id', header: 'ID' },
                { key: 'name', header: 'Name', map: (v: any) => String(v ?? '').toUpperCase() },
            ] as any
            const csv = toCSV(cols, rows as any)
            const pass = csv.split('\n')[0] === 'ID,Name' && csv.includes('ALPHA')
            r.push({ name: 'toCSV headers + map()', pass, detail: csv.split('\n')[1] })
        } catch (e: any) {
            r.push({ name: 'toCSV headers + map()', pass: false, detail: String(e) })
        }

        // Test 13: toCSV quote escaping
        try {
            const cols = [{ key: 'name', header: 'Name' }] as any
            const csv = toCSV(cols, [{ name: 'He said "Hi"' }] as any)
            r.push({ name: 'toCSV escapes quotes', pass: csv.includes('"He said ""Hi"""'), detail: csv })
        } catch (e: any) {
            r.push({ name: 'toCSV escapes quotes', pass: false, detail: String(e) })
        }

        setResults(r)
        setOpen(true)
    }

    return (
        <div className="mt-8 rounded-2xl border border-dashed border-gray-300 p-4">
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-800">Developer Tests</h3>
                <div className="flex items-center gap-2">
                    <button onClick={runTests} className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50">Run tests</button>
                    <button onClick={() => setOpen((o) => !o)} className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50">{open ? 'Hide' : 'Show'}</button>
                </div>
            </div>

            {open && (
                <ul className="space-y-1">
                    {results.map((t, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                            <span className={classNames('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', t.pass ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700')}>
                                {t.pass ? 'PASS' : 'FAIL'}
                            </span>
                            <span className="font-medium text-gray-800">{t.name}</span>
                            {t.detail && <span className="text-gray-500">— {t.detail}</span>}
                        </li>
                    ))}
                    {!results.length && (
                        <li className="text-sm text-gray-500">No results yet. Click <span className="font-medium">Run tests</span>.</li>
                    )}
                </ul>
            )}
        </div>
    )
}
