"use client";

import React, { useMemo, useState } from "react";
import DataTable, { Column, formatDate, classNames } from "@/app/ui/datatables/datatable";

type Transaction = {
  id: number;
  transactionId: string;
  name: string;
  email: string;
  commission: number;
  date: string;
  status: "Success" | "Pending" | "Cancelled";
};

// Example dummy data
const transactions: Transaction[] = [
  {
    id: 1,
    transactionId: "318162823",
    name: "Ahmad Susanto",
    email: "ahmad.susanto@email.com",
    commission: 75000,
    date: "2025-01-15",
    status: "Success",
  },
  {
    id: 2,
    transactionId: "827362918",
    name: "Budi Hartono",
    email: "budi.hartono@email.com",
    commission: 50000,
    date: "2025-02-01",
    status: "Pending",
  },
  {
    id: 3,
    transactionId: "738192736",
    name: "Siti Rahmawati",
    email: "siti.rahmawati@email.com",
    commission: 100000,
    date: "2025-02-20",
    status: "Cancelled",
  },
  {
    id: 4,
    transactionId: "738162918",
    name: "Andi Prasetyo",
    email: "andi.prasetyo@email.com",
    commission: 85000,
    date: "2025-03-03",
    status: "Success",
  },
  {
    id: 5,
    transactionId: "827162728",
    name: "Rina Anggraini",
    email: "rina.anggraini@email.com",
    commission: 60000,
    date: "2025-04-08",
    status: "Success",
  },
];

export default function TransactionHistoryTable() {
  const [selectedRange, setSelectedRange] = useState("Semua Waktu");

  const columns = useMemo<Column<Transaction>[]>(
    () => [
      {
        key: "id",
        header: "No",
        width: "50px",
        render: (_, row) => row.id,
      },
      {
        key: "transactionId",
        header: "ID",
        width: "140px",
      },
      {
        key: "name",
        header: "Nama",
      },
      {
        key: "email",
        header: "Email",
      },
      {
        key: "commission",
        header: "Komisi",
        render: (v) => `Rp ${v.toLocaleString("id-ID")}`,
      },
      {
        key: "date",
        header: "Tanggal daftar",
        render: (_, row) => {
          const date = new Date(row.date);
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();
          return `${month}/${day}/${year}`;
        },
      },
      {
        key: "status",
        header: "Status",
        width: "120px",
        render: (v) => {
          const colorClass =
            v === "Success"
              ? "bg-green-50 text-green-700"
              : v === "Pending"
              ? "bg-gray-100 text-gray-600"
              : "bg-red-50 text-red-700";
          return (
            <span className={classNames("rounded-full px-2 py-1 text-xs font-medium", colorClass)}>
              {v}
            </span>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="w-full mt-8">
      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Riwayat Transaksi</h2>
          <p className="text-sm text-gray-600 mb-2">
            Detail komisi dari setiap referral yang berhasil mendaftar
          </p>
        </div>

        {/* Dropdown filter (Semua Waktu) */}
        <div>
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-green-200 outline-none"
          >
            <option>Semua Waktu</option>
            <option>7 Hari Terakhir</option>
            <option>30 Hari Terakhir</option>
            <option>Tahun Ini</option>
          </select>
        </div>
      </div>

      {/* DataTable */}
      <DataTable<Transaction>
        rows={transactions}
        columns={columns}
        showToolbar={false}
        initialSort={{ key: "id", dir: "asc" }}
        selectable={false}
        getRowId={(row) => row.id}
        isLoading={false}
        error={null}
        pageSizes={[10, 25, 50, 100]}
      />
    </div>
  );
}
