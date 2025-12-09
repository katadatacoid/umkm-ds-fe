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
// Utilities (pure helpers)
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
    selectable?: boolean
    rowActions?: RowAction<T>[]
    onRowClick?: (row: T) => void
    getRowId?: (row: T, index: number) => string | number
    isLoading?: boolean
    error?: string | null
    exportMode?: 'filtered' | 'page' | 'selected'
    exportColumns?: { key: keyof T; header?: string; map?: (value: any, row: T) => any }[]
    filename?: string
    onExportAll?: () => Promise<T[]>
    showToolbar?: boolean
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
    showToolbar = true,
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

    // Check if export should be disabled
    const isExportDisabled = useMemo(() => {
        if (exporting) return true
        
        // Jika mode 'selected', hanya disable jika tidak ada data sama sekali
        // (bukan hanya tidak ada yang dipilih, karena user bisa export all filtered)
        if (exportMode === 'selected') {
            // Jika ada selection, cek apakah ada yang dipilih
            // Jika tidak ada selection, fallback ke filtered data
            return selected.size === 0 && sorted.length === 0
        }
        
        // Untuk mode 'page', disable jika halaman kosong
        if (exportMode === 'page') {
            return paged.length === 0
        }
        
        // Untuk mode 'filtered' (default), disable jika hasil filter kosong
        if (exportMode === 'filtered') {
            return sorted.length === 0
        }
        
        return false
    }, [exporting, exportMode, selected.size, paged.length, sorted.length])

    async function handleExport() {
        try {
            setExporting(true)
            let data: T[]
            if (onExportAll) {
                data = await onExportAll()
            } else {
                // Untuk mode 'selected', export selected jika ada, fallback ke filtered
                if (exportMode === 'selected') {
                    if (selected.size > 0) {
                        // Export hanya yang dipilih
                        data = sorted.filter((row, i) => selected.has(keyOf(row, i)))
                    } else {
                        // Jika tidak ada yang dipilih, export semua filtered data
                        data = sorted
                    }
                } else if (exportMode === 'page') {
                    data = paged
                } else {
                    data = sorted
                }
            }
            
            if (data.length === 0) {
                console.warn('No data to export')
                return
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
                    </div>
                </div>
            )}

            {/* Toolbar */}
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
                                disabled={isExportDisabled}
                                className="flex-1 sm:flex-none rounded-xl border border-gray-300 px-3 py-2 text-sm shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                                title={isExportDisabled ? 'No data to export' : 'Export to CSV'}
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
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-gray-600">
                                                            <polyline points="6 9 12 15 18 9" />
                                                        </svg>
                                                    </span>
                                                </button>
                                            </th>
                                        )
                                    })}
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

            {/* Footer / Pagination */}
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
        </div>
    )
}