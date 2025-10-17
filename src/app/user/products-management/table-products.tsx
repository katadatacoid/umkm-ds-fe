import DataTable, { classNames, Column, formatDate } from "@/app/ui/datatables/datatable"
import { useEffect, useMemo, useState } from "react"


type UserUMKM = {
    id: number
    fullName: string
    businessName: string
    email: string
    phoneNumber: string
    domain: string
    template: string
    packageSubcribe: string
    price: number
    status: 'Active' | 'Non Active'
    registerAt: string // ISO
}

// ------------------------------------------------------------
function useDemoData() {
    const [data, setData] = useState<UserUMKM[]>([])
    useEffect(() => {
        const status = ['Active', 'Non Active'] as const
        const arr: UserUMKM[] = Array.from({ length: 137 }).map((_, i) => ({
            id: i + 1,
            fullName: `User ${i + 1}`,
            email: `user${i + 1}@example.com`,
            status: status[i % status.length],
            businessName: `Business :${i + 1}`,
            domain: `business-${i + 1}.biz`,
            packageSubcribe: 'Starter-Bulanan',
            phoneNumber: '08888888888',
            price: 20000000,
            template: `Template - ${i + 1}`,

            registerAt: new Date(Date.now() - i * 86400000).toISOString(),
        }))
        setData(arr)
    }, [])
    return data
}

export default function DemoTableUsers() {
    const data = useDemoData()

    const columns = useMemo<Column<UserUMKM>[]>(
        () => [
            { key: 'id', header: 'ID UMKM', width: '80px' },
            { key: 'fullName', header: 'Nama Lenglap' },
            { key: 'businessName', header: 'Nama Usaha' },
            { key: 'email', header: 'Email' },
            { key: 'phoneNumber', header: 'No Handphone' },
            { key: 'domain', header: 'Domain' },
            { key: 'template', header: 'Template' },
            { key: 'packageSubcribe', header: 'Paket Langganan' },
            { key: 'price', header: 'Template' },
            {
                key: 'status', header: 'Role', width: '120px', render: (v) => (
                    <span className={classNames(
                        'rounded-full px-2 py-1 text-xs font-medium',
                        v === 'Non Active' && 'bg-red-50 text-red-700',
                        v === 'Active' && 'bg-emerald-50 text-emerald-700'
                    )}>{String(v)}</span>
                )
            },

            { key: 'registerAt', header: 'Created', width: '140px', render: (v) => formatDate(String(v)) },
        ],
        []
    )

    return (
        <div className="max-w-full px-0 py-5" style={{ width: 'calc(100%)' }}>
            {/* <h1 className="mb-2 text-2xl font-bold tracking-tight">DataTable · Next.js 13+ · TSX · Tailwind</h1>
            <p className="mb-6 text-gray-600">Sorting, search, pagination, selectable page size, sticky header, zebra rows, CSV export. Replace the demo hook with your fetch logic.</p> */}

            <DataTable<UserUMKM>
                rows={data}
                columns={columns}
                initialSort={{ key: 'id', dir: 'asc' }}
                // searchableKeys={['fullName', 'email']}
                selectable
                rowActions={[
                    { label: 'Ubah', onClick: (row) => alert(`View id ${(row as any).id}`) },
                    { label: 'Lihat', onClick: (row) => alert(`View id ${(row as any).id}`) },
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

        </div>
    )
}