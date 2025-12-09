import DataTable, { classNames, Column, formatDate } from "@/app/ui/datatables/datatable"
import { useEffect, useMemo, useState } from "react"
import { umkmAPI } from '@/lib/api'
import { useRouter, usePathname } from 'next/navigation'

// Type definition untuk response API dengan user dan subscription
interface UMKMAPIResponse {
    id: string;
    user_id: string;
    user_subscription_id?: string | null;
    name: string;
    description?: string | null;
    status: string;
    domain_name: string;
    template_id?: number | null;
    phone: string;
    email?: string | null;
    logo_img?: string | null;
    banner_img?: string | null;
    address?: string | null;
    province?: string | null;
    city?: string | null;
    turnover?: string | null;
    created_at?: string;
    updated_at?: string;
    user?: {
        id: string;
        name: string;
        email: string;
        phone: string;
    } | null;
    subscription?: {
        id: string;
        product_subscription_id: string;
        subscription_start: string;
        subscription_end: string;
        subscription_status: string;
        transaction?: {
            id: string;
            invoice_number: string;
            total_price: number;
            item_price: number;
            discount_amount: number;
            payment_status: string;
            product_subscription?: {
                id: string;
                name: string;
                duration: string;
                price: number;
                level: number;
            };
        };
    } | null;
}

type UserUMKM = {
    id: number
    fullName: string
    businessName: string
    email: string
    phoneNumber: string
    domain_name: string
    template_id: number
    packageSubcribe: string
    price: number
    turnover: number
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

function useUMKMData(searchQuery: string = "") {
    const [data, setData] = useState<UserUMKM[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [debouncedSearch, setDebouncedSearch] = useState(searchQuery)

    // Debounce: Tunggu 1 detik setelah user berhenti mengetik
    useEffect(() => {
        const timer = setTimeout(() => {
            console.log("Debounced search updated to:", searchQuery);
            setDebouncedSearch(searchQuery);
        }, 1000);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                console.log("Fetching UMKM data with subscription and user data...", debouncedSearch);

                const response = await umkmAPI.getAllWithSubscription(debouncedSearch.trim() || undefined)
                console.log("Response data count:", response.data.length);
                
                const transformedData: UserUMKM[] = response.data.map((umkm: any) => {
                    // Decode nama lengkap dari data user
                    let fullName = decodeHtmlEntities(umkm.name) || '-';
                    if (umkm.user && umkm.user.name) {
                        fullName = decodeHtmlEntities(umkm.user.name);
                    }

                    // Decode nama usaha
                    const businessName = decodeHtmlEntities(umkm.name);

                    // Ambil data paket langganan dari subscription
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

                    // Parse turnover
                    let turnoverValue = 0;
                    if (umkm.turnover) {
                        const match = umkm.turnover.match(/(\d+\.?\d*)/);
                        if (match) {
                            turnoverValue = parseFloat(match[1].replace(/\./g, '')) || 0;
                        }
                    }

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
                        fullName: fullName,
                        businessName: businessName,
                        email: umkm.user?.email || umkm.email || '-',
                        phoneNumber: umkm.user?.phone || umkm.phone || '-',
                        domain_name: umkm.domain_name || '-',
                        template_id: Number(umkm.template_id) || 0,
                        packageSubcribe: packageName,
                        price: packagePrice,
                        turnover: turnoverValue,
                        status: umkmStatus,
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
                
                if (err.message.includes('Unauthorized')) {
                    window.location.href = '/'
                }
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [debouncedSearch])

    return { data, loading, error }
}

interface DemoTableUsersProps {
    searchQuery?: string;
}

export default function DemoTableUsers({ searchQuery = "" }: DemoTableUsersProps) {
    const router = useRouter()
    const pathname = usePathname()
    const { data, loading, error } = useUMKMData(searchQuery)

    const columns = useMemo<Column<UserUMKM>[]>(
        () => [
            { key: 'id', header: 'ID UMKM', width: '80px' },
            { key: 'fullName', header: 'Nama Lengkap' },
            { key: 'businessName', header: 'Nama Usaha' },
            { key: 'email', header: 'Email' },
            { key: 'phoneNumber', header: 'No Handphone' },
            { key: 'domain_name', header: 'Domain Name' },
            { 
                key: 'template_id', 
                header: 'Template',
                render: (v) => {
                    const num = Number(v);
                    if (num === 0 || !num) return '-';
                    return `Template ${num}`;
                }
            },
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
                key: 'turnover', 
                header: 'Turnover', 
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

    const handleEdit = (row: UserUMKM) => {
        console.log('Edit clicked for ID:', row.id);
        router.push(`${pathname}/edit/${row.id}`)
    }

    const handleView = (row: UserUMKM) => {
        console.log('View clicked for ID:', row.id);
        alert(`View detail UMKM ID: ${row.id}`)
    }

    return (
        <div className="max-w-full px-0 py-5" style={{ width: 'calc(100%)' }}>
            {searchQuery && (
                <div className="mb-2 text-sm text-gray-600">
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
                initialSort={{ key: 'id', dir: 'asc' }}
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
                exportMode="selected"
                filename="umkm_export.csv"
            />
        </div>
    )
}