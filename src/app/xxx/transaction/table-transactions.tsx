import DataTable, { classNames, Column, formatDate } from "@/app/ui/datatables/datatable"
import { useEffect, useMemo, useState, useCallback } from "react"
import { useRouter, usePathname } from 'next/navigation'

// ============================================================
// TYPES
// ============================================================

// FIX: added 'paid' as a valid status from backend
export type TransactionPaymentStatus = 'success' | 'paid' | 'pending' | 'cancelled' | 'failed'

export type TransactionRow = {
    id: number
    invoiceNumber: string
    fullName: string
    businessName: string
    email: string
    phoneNumber: string
    domainName: string
    templateName: string
    packageSubscribe: string
    referralCode: string
    normalPrice: number | null
    affiliatePrice: number | null
    currentPrice: number
    registerAt: string
    paymentStatus: TransactionPaymentStatus
}

// ============================================================
// PROPS
// ============================================================

interface DemoTableTransactionsProps {
    searchQuery?: string
    dateFrom?: string
    dateTo?: string
    statusFilter?: string
}

// ============================================================
// API FETCHER
// ============================================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

const getAccessToken = (): string | null => {
    if (typeof window !== 'undefined') return localStorage.getItem('access_token')
    return null
}

async function fetchTransactions(params: {
    search?: string
    dateFrom?: string
    dateTo?: string
    status?: string
}): Promise<TransactionRow[]> {
    const token = getAccessToken()
    if (!token) throw new Error('Unauthorized')

    const query = new URLSearchParams()
    if (params.search) query.append('search', params.search)
    if (params.dateFrom) query.append('dateFrom', params.dateFrom)
    if (params.dateTo) query.append('dateTo', params.dateTo)
    if (params.status) query.append('payment_status', params.status)

    const url = `${API_URL}/transactions?${query.toString()}`

    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })

    if (res.status === 401) {
        window.location.href = '/'
        throw new Error('Unauthorized')
    }
    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || 'Failed to fetch transactions')
    }

    const data = await res.json()

    // Backend returns { success, count, stats, data: [...] }
    const rows = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : [])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return rows.map((t: any): TransactionRow => ({
        id: Number(t.id),
        invoiceNumber: t.invoice_number ?? '-',
        fullName: t.user?.name ?? t.full_name ?? '-',
        businessName: t.umkm?.name ?? t.business_name ?? '-',
        email: t.user?.email ?? t.email ?? '-',
        phoneNumber: t.user?.phone ?? t.phone ?? '-',
        domainName: t.domain_name ?? '-',
        templateName: t.template?.nama_template ?? (t.template_id ? `Template ${t.template_id}` : '-'),
        packageSubscribe: t.product_subscription
            ? `${t.product_subscription.name} (${t.product_subscription.duration})`
            : (t.package_name ?? '-'),
        referralCode: t.voucher_code ?? t.referral_code ?? '-',
        normalPrice: t.item_price ?? null,
        affiliatePrice: t.discount_amount > 0 ? t.discount_amount : null,
        currentPrice: t.total_price ?? 0,
        registerAt: t.subscription_start ?? t.created_at ?? new Date().toISOString(),
        paymentStatus: (t.payment_status ?? 'pending') as TransactionPaymentStatus,
    }))
}

// ============================================================
// HOOK
// ============================================================

function useTransactionData(
    searchQuery: string,
    dateFrom: string,
    dateTo: string,
    statusFilter: string
) {
    const [data, setData] = useState<TransactionRow[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Debounce search 800ms
    const [debouncedSearch, setDebouncedSearch] = useState(searchQuery)
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(searchQuery), 800)
        return () => clearTimeout(t)
    }, [searchQuery])

    const load = useCallback(async () => {
        try {
            setLoading(true)
            const rows = await fetchTransactions({
                search: debouncedSearch.trim() || undefined,
                dateFrom: dateFrom || undefined,
                dateTo: dateTo || undefined,
                status: statusFilter || undefined,
            })
            setData(rows)
            setError(null)
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Unknown error'
            setError(msg)
        } finally {
            setLoading(false)
        }
    }, [debouncedSearch, dateFrom, dateTo, statusFilter])

    useEffect(() => { load() }, [load])

    return { data, loading, error }
}

// ============================================================
// HELPERS
// ============================================================

function formatRupiah(value: number | null | undefined): string {
    if (value == null || value === 0) return '-'
    return `Rp ${value.toLocaleString('id-ID')}`
}

// FIX: added 'paid' → green badge (same as success)
function StatusBadge({ status }: { status: TransactionPaymentStatus }) {
    const map: Record<TransactionPaymentStatus, { label: string; cls: string }> = {
        success:   { label: 'Success',   cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
        paid:      { label: 'Paid',      cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
        pending:   { label: 'Pending',   cls: 'bg-yellow-50 text-yellow-700 border border-yellow-200' },
        cancelled: { label: 'Cancelled', cls: 'bg-red-50 text-red-700 border border-red-200' },
        failed:    { label: 'Failed',    cls: 'bg-gray-100 text-gray-600 border border-gray-200' },
    }
    const { label, cls } = map[status] ?? { label: status, cls: 'bg-gray-50 text-gray-600' }
    return (
        <span className={`rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap ${cls}`}>
            {label}
        </span>
    )
}

// ============================================================
// PRICE SUB-COLUMN CELL
// ============================================================

function PriceCell({ row }: { row: TransactionRow }) {
    return (
        <div className="flex flex-col gap-0.5 text-xs py-1">
            <div className="flex items-center gap-1">
                <span className="text-gray-400 w-24 shrink-0">Normal Price</span>
                <span className="text-gray-700">{formatRupiah(row.normalPrice)}</span>
            </div>
            <div className="flex items-center gap-1">
                <span className="text-gray-400 w-24 shrink-0">Affiliate Price</span>
                <span className="text-gray-700">{formatRupiah(row.affiliatePrice)}</span>
            </div>
            <div className="flex items-center gap-1">
                <span className="text-gray-400 w-24 shrink-0">Current Price</span>
                <span className="font-semibold text-red-500">{formatRupiah(row.currentPrice)}</span>
            </div>
        </div>
    )
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function DemoTableTransactions({
    searchQuery = "",
    dateFrom = "",
    dateTo = "",
    statusFilter = "",
}: DemoTableTransactionsProps) {
    const router = useRouter()
    const pathname = usePathname()

    const { data, loading, error } = useTransactionData(
        searchQuery,
        dateFrom,
        dateTo,
        statusFilter
    )

    const columns = useMemo<Column<TransactionRow>[]>(
        () => [
            // FIX: unique keys per column — append suffix to avoid duplicate 'id' key
            { key: 'id', header: 'No', width: '60px' },
            { key: 'invoiceNumber', header: 'Invoice', width: '180px' },
            // FIX: Status moved here — after Invoice, before Nama Lengkap
            {
                key: 'paymentStatus',
                header: 'Status',
                width: '110px',
                render: (v) => <StatusBadge status={v as TransactionPaymentStatus} />,
            },
            { key: 'fullName', header: 'Nama Lengkap' },
            { key: 'businessName', header: 'Nama Usaha' },
            { key: 'email', header: 'Email' },
            { key: 'phoneNumber', header: 'No.Handphone', width: '140px' },
            { key: 'domainName', header: 'Domain', width: '130px' },
            { key: 'templateName', header: 'Template' },
            { key: 'packageSubscribe', header: 'Paket Langganan' },
            { key: 'referralCode', header: 'Referall', width: '160px' },
            {
                key: 'currentPrice',
                header: 'Harga',
                width: '220px',
                render: (_, row) => <PriceCell row={row as TransactionRow} />,
            },
            {
                key: 'registerAt',
                header: 'Tanggal Daftar',
                width: '130px',
                render: (v) => formatDate(String(v)),
            },
        ],
        []
    )

    const handleEdit = (row: TransactionRow) => {
        router.push(`${pathname}/edit/${row.id}`)
    }

    const handleView = (row: TransactionRow) => {
        router.push(`${pathname}/detail/${row.id}`)
    }

    return (
        <div className="max-w-full px-0 py-5" style={{ width: 'calc(100%)' }}>
            {searchQuery && (
                <div className="mb-2 text-sm text-gray-600">
                    {loading ? (
                        <span className="italic">Mencari...</span>
                    ) : (
                        <span>
                            Menampilkan {data.length} data
                            {searchQuery && ` (pencarian: "${searchQuery}")`}
                        </span>
                    )}
                </div>
            )}

            <DataTable<TransactionRow>
                key={`table-tx-${searchQuery}-${dateFrom}-${dateTo}-${statusFilter}-${data.length}`}
                rows={data}
                columns={columns}
                initialSort={{ key: 'id', dir: 'asc' }}
                selectable
                rowActions={[
                    {
                        label: 'Lihat',
                        onClick: handleView,
                    },
                ]}
                onRowClick={(row) => console.log(`Row clicked: ${row.invoiceNumber}`)}
                getRowId={(row) => row.id}
                isLoading={loading}
                error={error}
                exportMode="selected"
                filename="transaksi_export.csv"
            />
        </div>
    )
}