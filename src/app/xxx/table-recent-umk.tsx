import DataTable, { classNames, Column, formatDate } from "@/app/ui/datatables/datatable"
import { useEffect, useMemo, useState } from "react"
import { umkmAPI } from '@/lib/api'
import { useRouter, usePathname } from 'next/navigation'

type UserUMKM = {
    id: number
    fullName: string
    businessName: string
    email: string
    phoneNumber: string
    domain_name: string
    template_id: string
    packageSubcribe: string
    price: number
    status: 'Active' | 'Non Active'
    subscriptionStatus?: string
    subscriptionStart?: string
    subscriptionEnd?: string
    registerAt: string
}

/**
 * Helper function untuk decode HTML entities
 * Handles data yang mungkin ter-encode dari backend
 */
function decodeHtmlEntities(text: string | null | undefined): string {
    if (!text) return '';
    
    // Cek apakah ada HTML entities
    if (!/&[a-zA-Z0-9#]+;/.test(text)) {
        return text; // Tidak ada entities, return as-is
    }
    
    // Decode menggunakan browser API
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
}

// Hook untuk fetch data dengan support search dan debounce
function useUMKMData(searchQuery: string = "") {
    const [data, setData] = useState<UserUMKM[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [debouncedSearch, setDebouncedSearch] = useState(searchQuery)

    // Debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            console.log("Debounced search updated to:", searchQuery);
            setDebouncedSearch(searchQuery);
        }, 500); 

        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                console.log("Fetching UMKM data with user info...", debouncedSearch);

                // GUNAKAN getAllWithSubscription() untuk mendapatkan data subscription DAN user
                const response = await umkmAPI.getAllWithSubscription(debouncedSearch.trim() || undefined)
                console.log("Response data count:", response.data.length);

                // Transform data dari backend ke format UserUMKM
                const transformedData: UserUMKM[] = response.data.map((umkm) => {
                    // Decode nama lengkap dari data user (bukan dari nama usaha)
                    let fullName = decodeHtmlEntities(umkm.name) || '-'; // Default ke nama usaha yang sudah di-decode
                    if (umkm.user && umkm.user.name) {
                        fullName = decodeHtmlEntities(umkm.user.name); // Decode nama dari tabel users
                    }

                    // Decode nama usaha
                    const businessName = decodeHtmlEntities(umkm.name);

                    // Ambil nama paket dari product_subscription
                    let packageName = '-';
                    let packagePrice = 0;
                    let subscriptionStatus = 'No Subscription';
                    let subscriptionStart = undefined;
                    let subscriptionEnd = undefined;

                    if (umkm.subscription) {
                        subscriptionStatus = umkm.subscription.subscription_status || 'No Subscription';
                        subscriptionStart = umkm.subscription.subscription_start;
                        subscriptionEnd = umkm.subscription.subscription_end;

                        if (umkm.subscription.transaction?.product_subscription) {
                            const productSub = umkm.subscription.transaction.product_subscription;
                            packageName = `${productSub.name} (${productSub.duration})`;
                            packagePrice = umkm.subscription.transaction.total_price || 0;
                        }
                    }

                    let turnoverValue = 0;
                    if (umkm.turnover) {
                        const match = umkm.turnover.match(/(\d+\.?\d*)/);
                        if (match) {
                            turnoverValue = parseFloat(match[1].replace(/\./g, '')) || 0;
                        }
                    }

                    // Debug: Log status dari API
                    console.log(`UMKM ID ${umkm.id}: status dari API = "${umkm.status}"`);
                    
                    // Normalisasi status UMKM
                    let umkmStatus: 'Active' | 'Non Active' = 'Non Active';
                    if (umkm.status) {
                        const statusLower = umkm.status.toLowerCase();
                        if (statusLower === 'published' || statusLower === 'active') {
                            umkmStatus = 'Active';
                        }
                    }

                    return {
                        id: Number(umkm.id),
                        fullName: fullName, // Nama lengkap dari tabel users (SUDAH DI-DECODE)
                        businessName: businessName, // Nama usaha dari tabel user_products (SUDAH DI-DECODE)
                        email: umkm.user?.email || umkm.email || '-', // Prioritas email dari user
                        phoneNumber: umkm.user?.phone || umkm.phone || '-', // Prioritas phone dari user
                        domain_name: umkm.domain_name || '-',
                        template_id: umkm.template_id ? `Template ${umkm.template_id}` : '-',
                        packageSubcribe: packageName, // Nama paket dari product_subscription
                        price: packagePrice, // Harga dari total_price transaction
                        status: umkmStatus, // Status UMKM yang sudah dinormalisasi
                        subscriptionStatus: subscriptionStatus,
                        subscriptionStart: subscriptionStart,
                        subscriptionEnd: subscriptionEnd,
                        registerAt: umkm.created_at || new Date().toISOString(),
                    };
                })

                setData(transformedData)
                setError(null)
            } catch (err: any) {
                console.error('Error fetching UMKM data:', err)
                setError(err.message)

                // Jika unauthorized, redirect ke login
                if (err.message.includes('Unauthorized')) {
                    window.location.href = '/'
                }
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [debouncedSearch]) // Re-fetch ketika debouncedSearch berubah

    return { data, loading, error }
}

interface DemoTableRecentUMKmProps {
    title: string;
    searchQuery?: string;
}

export default function DemoTableRecentUMKm({ title, searchQuery = "" }: DemoTableRecentUMKmProps) {
    const router = useRouter()
    const pathname = usePathname()
    const { data, loading, error } = useUMKMData(searchQuery)

    // Debug: Log ketika data berubah
    useEffect(() => {
        console.log("Table data updated:", data.length, "rows");
    }, [data]);

    const columns = useMemo<Column<UserUMKM>[]>(
        () => [
            { key: 'id', header: 'ID UMKM', width: '80px' },
            { key: 'fullName', header: 'Nama Lengkap' }, // Nama dari tabel users
            { key: 'businessName', header: 'Nama Usaha' }, // Nama usaha dari tabel user_products
            { key: 'email', header: 'Email' },
            { key: 'phoneNumber', header: 'No Handphone' },
            { key: 'domain_name', header: 'Domain Name' },
            { key: 'template_id', header: 'Template' },
            { 
                key: 'subscriptionStatus', 
                header: 'Status Langganan', 
                width: '150px',
                render: (v) => {
                    const status = String(v);
                    let colorClass = 'bg-gray-50 text-gray-700';
                    let displayText = status;
                    
                    if (status === 'active') {
                        colorClass = 'bg-green-50 text-green-700';
                        displayText = 'Active';
                    } else if (status === 'expired') {
                        colorClass = 'bg-red-50 text-red-700';
                        displayText = 'Kadaluarsa';
                    } else if (status === 'No Subscription') {
                        colorClass = 'bg-yellow-50 text-yellow-700';
                        displayText = 'Belum Berlangganan';
                    }
                    
                    return (
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${colorClass}`}>
                            {displayText}
                        </span>
                    );
                }
            },
            { 
                key: 'subscriptionStart', 
                header: 'Mulai Langganan', 
                width: '140px', 
                render: (v) => v ? formatDate(String(v)) : '-'
            },
            { 
                key: 'subscriptionEnd', 
                header: 'Akhir Langganan', 
                width: '140px', 
                render: (v) => v ? formatDate(String(v)) : '-'
            },
            { key: 'packageSubcribe', header: 'Paket Langganan' },
            {
                key: 'price', 
                header: 'Harga Paket', 
                render: (v) => {
                    const num = Number(v);
                    if (num === 0 || !num) return '-';
                    return `Rp ${num.toLocaleString('id-ID')}`;
                }
            },
            {
                key: 'status', 
                header: 'Status UMKM', 
                width: '120px', 
                render: (v) => {
                    const status = String(v);
                    const colorClass = status === 'Active' 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'bg-red-50 text-red-700';
                    
                    return (
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${colorClass}`}>
                            {status}
                        </span>
                    );
                }
            },
            { 
                key: 'registerAt', 
                header: 'Terdaftar', 
                width: '140px', 
                render: (v) => formatDate(String(v)) 
            },
        ],
        []
    )

    // Handler untuk navigasi ke halaman edit
    const handleEdit = (row: UserUMKM) => {
        console.log('Edit clicked for ID:', row.id);
        router.push(`${pathname}/users-management/edit/${row.id}`)
    }

    // Handler untuk view detail
    const handleView = (row: UserUMKM) => {
        console.log('View clicked for ID:', row.id);
        alert(`View detail UMKM ID: ${row.id}`)
    }

    return (
        <div className="max-w-full px-0 py-5" style={{ width: 'calc(100%)' }}>
            <h2 className="text-sm sm:text-base font-semibold text-gray-700 mt-3 sm:mb-4">
                {title}
            </h2>

            {/* Debug info - gunakan font-normal untuk lebih tipis */}
            {searchQuery && (
                <div className="mb-2 text-sm text-gray-600 font-normal">
                    {loading ? (
                        <span className="italic">Mencari...</span>
                    ) : (
                        <span>Menampilkan {data.length} data {searchQuery && `(pencarian: "${searchQuery}")`}</span>
                    )}
                </div>
            )}

            <DataTable<UserUMKM>
                key={`table-${searchQuery}-${data.length}`}
                rows={data}
                columns={columns}
                showToolbar={false}
                initialSort={{ key: 'id', dir: 'desc' }}
                searchableKeys={['fullName', 'businessName', 'email']}
                selectable
                rowActions={[
                    {
                        label: 'Ubah',
                        onClick: handleEdit
                    },
                    {
                        label: 'Lihat',
                        onClick: handleView
                    },
                ]}
                onRowClick={(row) => console.log(`Row clicked: ${row.fullName}`)}
                getRowId={(row) => row.id}
                isLoading={loading}
                error={error}
                exportMode="filtered"
                filename="umkm-data.csv"
            />

        </div>
    )
}