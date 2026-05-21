# AI Context — Media Storage (Image Upload)

Dokumen handoff untuk AI / FE developer yang akan memakai endpoint **storage file image** sebagai backend upload untuk landing/blog/testimonial/footer. Update terakhir: **2026-05-18**.

> **Scope**: dokumen ini fokus pada endpoint generik media library (image-only) — dipakai sebagai pengganti hardcoding URL di field landing/blog/footer. Upload logo/produk masih pakai endpoint inline lama di [umkmController](src/controllers/umkmController.ts) & [productRoutes](src/routes/productRoutes.ts).
>
> **Base URL dev**: `http://localhost:3001`
> **Base URL prod**: `https://dashboard.rumahdigitalumkm.id`
> **Mount**: `app.use("/media", mediaRoutes)` di [src/server.ts:96](src/server.ts#L96).
> **Static file serve**: `app.use("/images", express.static(...))` di [src/server.ts:60](src/server.ts#L60) → URL hasil upload bersifat **public** (tidak butuh JWT untuk ditampilkan di landing publik).

---

## 1. Ringkasan Modul

Satu tabel, satu owner per row, 4 endpoint:

| Method | Endpoint              | Tujuan                                            | Auth         |
| ------ | --------------------- | ------------------------------------------------- | ------------ |
| POST   | `/media/upload`       | Upload 1 image (multipart `file`)                 | ✅ Bearer    |
| GET    | `/media`              | List image milik user yang login (paginated)      | ✅ Bearer    |
| GET    | `/media/:id`          | Detail 1 image milik user yang login              | ✅ Bearer    |
| DELETE | `/media/:id`          | Soft-delete record + unlink file fisik            | ✅ Bearer    |
| GET    | `/images/media/<name>`| **Public** — render file di browser (no auth)     | ❌ no auth   |

Tabel DB: `user_media` (lihat [prisma/sql/create_user_media.sql](prisma/sql/create_user_media.sql) dan model [`user_media` di schema.prisma](prisma/schema.prisma)).
Storage fisik: `public/images/media/<filename>` (folder auto-created saat upload pertama).

---

## 2. Autentikasi

Semua endpoint `/media/*` (kecuali public static `/images/...`) wajib `Authorization: Bearer <ACCESS_TOKEN>`.

```bash
# 1. Dapatkan authorization_code
curl -X POST http://localhost:3001/login/authorize \
  -H "Content-Type: application/json" \
  -d '{ "email": "owner@example.com", "password": "secret" }'

# 2. Tukar ke access_token
curl -X POST http://localhost:3001/login/token \
  -H "Content-Type: application/json" \
  -d '{ "grant_type": "authorization_code", "code": "<CODE>" }'
```

Owner ditentukan **otomatis dari JWT** (`req.user.user_id`). Tidak ada parameter `user_id` di body/query — user hanya bisa melihat/menghapus media miliknya sendiri.

---

## 3. Response Shape

**Sukses upload (201):**
```json
{
  "success": true,
  "data": {
    "id": "12",
    "path": "/images/media/media_3_1715920873421_a1b2c3d4e5f6.png",
    "url": "https://dashboard.rumahdigitalumkm.id/images/media/media_3_1715920873421_a1b2c3d4e5f6.png"
  }
}
```

**Sukses list (200):**
```json
{
  "success": true,
  "data": [ /* Media[] */ ],
  "pagination": { "page": 1, "limit": 20, "total": 42, "total_pages": 3 }
}
```

**Sukses detail (200):**
```json
{
  "success": true,
  "data": { /* Media — lihat skema di §6 */ }
}
```

**Sukses delete (200):**
```json
{ "success": true, "message": "Media deleted" }
```

**Error:**
```json
{ "success": false, "message": "..." }
```

HTTP status:
- `200` — OK (list/get/delete)
- `201` — Created (upload sukses)
- `400` — File hilang, MIME/ext ditolak, magic-byte fail, atau >5MB
- `401` — Token hilang / invalid / expired
- `404` — Media tidak ditemukan atau bukan milik user (sengaja samakan, tidak bocor keberadaan record)
- `500` — Error DB / unexpected

---

## 4. Endpoint Reference

### 4.1 POST `/media/upload` — Upload image

Request: **multipart/form-data**, field wajib `file`.

```bash
curl -X POST http://localhost:3001/media/upload \
  -H "Authorization: Bearer <TOKEN>" \
  -F "file=@/path/to/banner.png"
```

Validasi (semua harus pass):
1. Ada field `file`.
2. MIME header: `image/jpeg | image/png | image/webp | image/gif`.
3. Ekstensi filename (lowercase): `.jpg | .jpeg | .png | .webp | .gif`.
4. Ukuran ≤ **5 MB**.
5. Magic-byte: file harus bisa di-parse oleh `sharp` sebagai image valid (mencegah file palsu seperti `.exe` di-rename `.png`). Kalau fail, file di-unlink dari disk + return 400.

Penamaan file di disk: `media_<userId>_<timestamp>_<rand8>.<ext>` (tidak pakai `originalname` untuk cegah path traversal & double-extension attack). `original_name` tetap disimpan di DB (sudah disanitasi).

Response 201:
```json
{
  "success": true,
  "data": {
    "id": "12",
    "path": "/images/media/media_3_1715920873421_a1b2c3d4e5f6.png",
    "url": "https://dashboard.rumahdigitalumkm.id/images/media/media_3_1715920873421_a1b2c3d4e5f6.png"
  }
}
```

URL di response sudah lengkap (dengan host) — bisa langsung di-pakai sebagai value untuk field `image_url`/`cover_image_url`/`avatar_url` di endpoint landing/blog/testimonial/footer.

Error contoh:
| Kondisi                          | Status | `message`                                  |
| -------------------------------- | ------ | ------------------------------------------ |
| Field `file` tidak dikirim       | 400    | `No file uploaded (field 'file' required)` |
| Ekstensi/MIME bukan image        | 400    | `Only image files are allowed`             |
| Magic-byte fail (file palsu)     | 400    | `File is not a valid image`                |
| Ukuran >5MB                      | 400    | `File size exceeds limit`                  |
| Tanpa bearer / token invalid     | 401    | `No token provided` / `Invalid token`      |

---

### 4.2 GET `/media` — List paginated milik user

Query (semua opsional):
- `page` — default `1`, min `1`
- `limit` — default `20`, max `100`

```bash
curl -H "Authorization: Bearer <TOKEN>" \
  'http://localhost:3001/media?page=1&limit=20'
```

Filter: hanya record dengan `user_id = req.user.user_id` **dan** `deleted_at IS NULL`. Ordered by `created_at DESC`.

Response 200:
```json
{
  "success": true,
  "data": [
    {
      "id": "12",
      "user_id": "3",
      "file_name": "media_3_1715920873421_a1b2c3d4e5f6.png",
      "original_name": "banner-toko.png",
      "mime_type": "image/png",
      "size_bytes": 245678,
      "width": 1920,
      "height": 1080,
      "path": "/images/media/media_3_1715920873421_a1b2c3d4e5f6.png",
      "url": "https://dashboard.rumahdigitalumkm.id/images/media/media_3_1715920873421_a1b2c3d4e5f6.png",
      "created_at": "2026-05-18T03:53:27.476Z"
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 1, "total_pages": 1 }
}
```

---

### 4.3 GET `/media/:id` — Detail 1 image

```bash
curl -H "Authorization: Bearer <TOKEN>" http://localhost:3001/media/12
```

Return 404 baik untuk record yang tidak ada **maupun** bukan milik user — supaya tidak bisa enumerate keberadaan record user lain.

Response 200 sama dengan elemen array di GET `/media`.

---

### 4.4 DELETE `/media/:id` — Soft-delete

```bash
curl -X DELETE -H "Authorization: Bearer <TOKEN>" http://localhost:3001/media/12
```

Yang dilakukan:
1. Cek ownership (404 kalau bukan milik user).
2. Set `deleted_at = NOW()` di tabel `user_media`.
3. `fs.unlinkSync()` file fisik di `public/images/media/` (try/catch — abaikan kalau file sudah hilang).

⚠️ **Konsekuensi**: URL yang sudah ter-pasang di landing/blog/footer akan **404** setelah dihapus. Konfirmasi ke user sebelum delete kalau ada referensi aktif.

Response 200:
```json
{ "success": true, "message": "Media deleted" }
```

---

### 4.5 GET `/images/media/<filename>` — Public render

```bash
curl http://localhost:3001/images/media/media_3_1715920873421_a1b2c3d4e5f6.png
# atau langsung buka di browser / pakai di tag <img src="...">
```

Tidak butuh JWT. Di-serve oleh `express.static` di [server.ts:60](src/server.ts#L60). Nama file mengandung user_id + timestamp + 8 byte random hex → **unguessable**, tidak bisa di-enumerate dari luar.

---

## 5. Tabel `user_media`

DDL: [prisma/sql/create_user_media.sql](prisma/sql/create_user_media.sql). Model Prisma: `user_media` di [schema.prisma](prisma/schema.prisma).

| Kolom           | Tipe           | Catatan                                            |
| --------------- | -------------- | -------------------------------------------------- |
| `id`            | BIGSERIAL PK   | Dikembalikan sebagai **string** di JSON            |
| `user_id`       | BIGINT FK→users(id) ON DELETE CASCADE | Owner               |
| `file_name`     | VARCHAR(255)   | Nama file di disk (generated, safe)                |
| `original_name` | VARCHAR(255)   | Nama asli dari client (sudah disanitasi)           |
| `mime_type`     | VARCHAR(100)   | `image/jpeg` \| `image/png` \| `image/webp` \| `image/gif` |
| `size_bytes`    | INTEGER        | Ukuran file dalam bytes                            |
| `width`         | INTEGER nullable | Dari `sharp.metadata()` — bisa null kalau format nyentrik |
| `height`        | INTEGER nullable |                                                    |
| `path`          | VARCHAR(500)   | Relative path: `/images/media/<file_name>`         |
| `storage_disk`  | VARCHAR(50)    | Default `local`. Reserved untuk migrasi ke S3/GCS  |
| `deleted_at`    | TIMESTAMP nullable | Soft-delete marker — filter `IS NULL` di query  |
| `created_at`    | TIMESTAMP      | Auto                                               |
| `updated_at`    | TIMESTAMP      | Auto                                               |

Index: `(user_id)`, `(created_at)`, `(deleted_at)`.

---

## 6. Skema `Media` (JSON)

Dipakai konsisten di semua response GET (kecuali POST yang hanya balikin `{id, path, url}`).

```ts
type Media = {
  id: string;             // BigInt as string, e.g. "12"
  user_id: string;        // BigInt as string
  file_name: string;
  original_name: string;
  mime_type: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  path: string;           // "/images/media/<file_name>"
  url: string;            // "<protocol>://<host><path>"
  created_at: string;     // ISO 8601
};
```

**Kenapa `url` di-generate on-read, bukan disimpan di DB?** Kalau base domain berubah (mis. pindah ke CDN), URL existing tetap valid — tidak perlu migrate DB.

---

## 7. Security Checklist

| Layer            | Implementasi                                                                                              |
| ---------------- | --------------------------------------------------------------------------------------------------------- |
| **Auth**         | `verifyToken` middleware di semua route `/media/*` ([middlewares/authMiddleware.ts](src/middlewares/authMiddleware.ts)) |
| **Ownership**    | Semua query GET/DELETE pakai `where: { user_id: BigInt(req.user.user_id), ... }` — return 404 (bukan 403) kalau bukan miliknya |
| **MIME**         | Whitelist eksplisit: jpeg/png/webp/gif                                                                    |
| **Extension**    | Whitelist eksplisit (lowercased) — bukan diambil dari `originalname` saat tulis ke disk                   |
| **Magic-byte**   | `sharp(filePath).metadata()` setelah file ter-tulis — fail → unlink + 400                                 |
| **Filename**    | Generated: `media_<uid>_<ts>_<rand8>.<ext>` — cegah path traversal & overwrite                            |
| **Size**         | Multer `limits.fileSize: 5 * 1024 * 1024` — auto-reject di stream sebelum disk write penuh                |
| **Soft-delete**  | `deleted_at` di-set, file fisik di-unlink — record tetap untuk audit                                      |
| **Logging**      | 2 layer: per-request middleware di [mediaRoutes.ts:13-21](src/routes/mediaRoutes.ts#L13-L21) + `logUserAction` per operasi di controller. Winston otomatis redact bearer/token. |

---

## 8. Flow Integrasi di CMS (FE)

Pola umum saat FE perlu URL image untuk dipasang di landing/blog/footer:

```js
// 1. User pilih file di <input type="file">
const file = input.files[0];

// 2. Upload ke /media/upload — dapat URL public
const fd = new FormData();
fd.append("file", file);
const res = await fetch("/media/upload", {
  method: "POST",
  headers: { Authorization: `Bearer ${token}` },
  body: fd,
});
const { data } = await res.json();  // { id, path, url }

// 3. Pakai `data.url` di body request endpoint lain
await fetch("/storefront/landing/hero", {
  method: "PUT",
  headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  body: JSON.stringify({
    template_id: 4,
    image_url: data.url,      // ← URL hasil upload langsung
    judul: "Hero baru",
  }),
});
```

⚠️ **FE harus melacak `id` media** kalau mau menyediakan tombol "hapus dari library" — tanpa `id`, hanya URL bisa di-overwrite di landing, tapi file fisik & record tetap ada.

---

## 9. Konvensi & Catatan

- **BigInt → string**: semua `id` di response. FE jangan parse jadi Number (overflow).
- **Soft-delete vs hard-delete**: pakai DELETE → soft. Tidak ada endpoint hard-delete sekarang. Kalau perlu purge audit log, query langsung di DB.
- **Tidak ada update endpoint**: image-nya immutable. Mau ganti? Upload baru, hapus yang lama.
- **Tidak ada rate-limit khusus**: tergantung infrastructure umum. Pertimbangkan tambah nanti kalau muncul abuse upload.
- **Tidak ada thumbnail / resize on-the-fly**: `sharp` sudah di-import, bisa ditambah belakangan kalau perlu varian ukuran.
- **Multipart parser**: pakai `multer` v2 (memori → disk via `diskStorage`). Bukan `express.json` / `express.urlencoded` — keduanya tidak menangkap multipart.

---

## 10. Smoke Test Checklist

Setelah deploy / restart, verifikasi cepat:

```bash
TOKEN=<bearer>
BASE=http://localhost:3001

# Auth gating
curl -s -o /dev/null -w "%{http_code}\n" $BASE/media               # 401
curl -s -o /dev/null -w "%{http_code}\n" -X POST $BASE/media/upload # 401

# Happy path
curl -X POST $BASE/media/upload -H "Authorization: Bearer $TOKEN" -F "file=@./valid.png"  # 201

# List + detail
curl $BASE/media -H "Authorization: Bearer $TOKEN"                       # 200
curl $BASE/media/<id> -H "Authorization: Bearer $TOKEN"                  # 200

# Public access
curl $BASE/images/media/<file_name>                                       # 200 + image bytes

# Fail cases
echo "not an image" > fake.png
curl -X POST $BASE/media/upload -H "Authorization: Bearer $TOKEN" -F "file=@./fake.png"   # 400 magic-byte
curl -X POST $BASE/media/upload -H "Authorization: Bearer $TOKEN" -F "file=@./doc.txt"    # 400 mime
dd if=/dev/zero of=huge.png bs=1M count=6
curl -X POST $BASE/media/upload -H "Authorization: Bearer $TOKEN" -F "file=@./huge.png"   # 400 size

# Delete
curl -X DELETE $BASE/media/<id> -H "Authorization: Bearer $TOKEN"        # 200
curl $BASE/media/<id> -H "Authorization: Bearer $TOKEN"                  # 404
curl -s -o /dev/null -w "%{http_code}\n" $BASE/images/media/<file_name>  # 404 (file unlinked)
```

---

## 11. File Referensi

- Route: [src/routes/mediaRoutes.ts](src/routes/mediaRoutes.ts)
- Controller: [src/controllers/mediaController.ts](src/controllers/mediaController.ts)
- DB migration: [prisma/sql/create_user_media.sql](prisma/sql/create_user_media.sql)
- Prisma model: `user_media` di [prisma/schema.prisma](prisma/schema.prisma)
- Mount: [src/server.ts:96](src/server.ts#L96)
- Static serving: [src/server.ts:60](src/server.ts#L60)
- Multer error handler global: [src/server.ts:117-131](src/server.ts#L117-L131)
- Auth middleware: [src/middlewares/authMiddleware.ts](src/middlewares/authMiddleware.ts)
- Swagger spec: tag `Media` di [src/configs/swagger.ts](src/configs/swagger.ts) — render di `/api-docs`.
