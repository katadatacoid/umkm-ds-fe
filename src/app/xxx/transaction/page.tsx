'use client'

import React, { useState, useEffect } from "react"
import DashboardAdminLayout from "@/app/ui/layout/ds-admin-layout"
import StatsSection from "@/app/ui/section/seaction-stat"
import DemoTableTransactions from "./table-transactions"

interface TxStats {
    successCount: number
    failedCount: number
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

async function fetchTxStats(): Promise<TxStats> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
    if (!token) return { successCount: 0, failedCount: 0 }
    try {
        const res = await fetch(`${API_URL}/transactions/stats`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) return { successCount: 0, failedCount: 0 }
        const json = await res.json()
        // Backend: { success: true, data: { total, paid, success, failed, cancelled, pending } }
        // "paid" is the field used for completed transactions, not "success"
        const d = json.data
        return {
            successCount: d?.paid ?? d?.success ?? 0,
            failedCount: (d?.failed ?? 0) + (d?.cancelled ?? 0),
        }
    } catch {
        return { successCount: 0, failedCount: 0 }
    }
}

const STATUS_OPTIONS = [
    { label: 'Semua Status', value: '' },
    { label: 'Success', value: 'success' },
    { label: 'Pending', value: 'pending' },
    { label: 'Cancelled', value: 'cancelled' },
    { label: 'Failed', value: 'failed' },
]

interface FilterBarProps {
    dateFrom: string
    onDateFromChange: (v: string) => void
    dateTo: string
    onDateToChange: (v: string) => void
    statusFilter: string
    onStatusChange: (v: string) => void
    onApply: () => void
    onReset: () => void
}

function FilterBar({
    dateFrom, onDateFromChange,
    dateTo, onDateToChange,
    statusFilter, onStatusChange,
    onApply, onReset,
}: FilterBarProps) {
    return (
        <div className="flex flex-wrap items-center justify-end gap-2 mt-5 mb-1">
            {/* Date range — single unified box */}
            <div className="flex items-center gap-1 border border-gray-200 rounded-lg px-3 py-1.5 bg-white">
                <input
                    type="date"
                    value={dateFrom}
                    onChange={e => onDateFromChange(e.target.value)}
                    className="text-sm bg-transparent focus:outline-none text-gray-600"
                />
                <span className="text-gray-400 text-sm mx-1">–</span>
                <input
                    type="date"
                    value={dateTo}
                    onChange={e => onDateToChange(e.target.value)}
                    className="text-sm bg-transparent focus:outline-none text-gray-600"
                />
                <svg className="ml-1 text-gray-400 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
            </div>

            {/* Status dropdown */}
            <div className="relative">
                <select
                    value={statusFilter}
                    onChange={e => onStatusChange(e.target.value)}
                    className="text-sm border border-gray-200 rounded-lg pl-3 pr-8 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent min-w-[140px] appearance-none"
                >
                    {STATUS_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </span>
            </div>

            <button
                onClick={onApply}
                className="px-4 py-2 text-sm font-semibold bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 active:scale-95 transition-all"
            >
                TERAPKAN
            </button>
            <button
                onClick={onReset}
                className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 active:scale-95 transition-all"
            >
                Reset
            </button>
        </div>
    )
}

const TransactionAdmin: React.FC = () => {
    const [dateFromInput, setDateFromInput] = useState("")
    const [dateToInput, setDateToInput] = useState("")
    const [statusInput, setStatusInput] = useState("")
    const [dateFrom, setDateFrom] = useState("")
    const [dateTo, setDateTo] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [stats, setStats] = useState<TxStats>({ successCount: 0, failedCount: 0 })

    // Fetch stats on mount (client-side only so token is available)
    useEffect(() => {
        fetchTxStats().then(setStats).catch(() => {})
    }, [])

    const handleApply = () => {
        setDateFrom(dateFromInput)
        setDateTo(dateToInput)
        setStatusFilter(statusInput)
    }

    const handleReset = () => {
        setDateFromInput(""); setDateToInput(""); setStatusInput("")
        setDateFrom(""); setDateTo(""); setStatusFilter("")
    }

    const statsData = [
        {
            title: "Total Transaksi Selesai",
            value: stats.successCount,
            percentage: 15,
            description: "Transaksi yang berhasil diselesaikan oleh UMKM bulan ini.",
        },
        {
            title: "Transaksi Gagal",
            value: stats.failedCount,
            percentage: 0,
            description: "Umkm yang gagal melakukan pembayaran bulan ini.",
        },
    ]

    return (
        <DashboardAdminLayout path="xxx">
            {/* Plain header — same as Pengaturan, NO HeadSummary (which renders Tambah Data) */}
            <div className="w-full flex flex-col sm:flex-row justify-between items-center p-4 sm:p-5 bg-white shadow-sm rounded-lg">
                <div className="text-base sm:text-xl font-semibold text-gray-800">Transaksi</div>
            </div>

            <StatsSection stats={statsData} className="mt-5" />

            <FilterBar
                dateFrom={dateFromInput}
                onDateFromChange={setDateFromInput}
                dateTo={dateToInput}
                onDateToChange={setDateToInput}
                statusFilter={statusInput}
                onStatusChange={setStatusInput}
                onApply={handleApply}
                onReset={handleReset}
            />

            <DemoTableTransactions
                searchQuery=""
                dateFrom={dateFrom}
                dateTo={dateTo}
                statusFilter={statusFilter}
            />
        </DashboardAdminLayout>
    )
}

export default TransactionAdmin