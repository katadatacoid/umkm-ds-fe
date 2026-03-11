/**
 * Decode HTML entities untuk ditampilkan sebagai text biasa
 * Gunakan untuk data yang mungkin ter-encode dari backend
 */
 export function decodeHtmlEntities(text: string | null | undefined): string {
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

/**
 * Decode object fields yang mungkin mengandung HTML entities
 */
export function decodeObjectFields<T extends Record<string, any>>(
  obj: T,
  fields: (keyof T)[]
): T {
  const decoded = { ...obj };
  
  fields.forEach(field => {
    if (typeof decoded[field] === 'string') {
      decoded[field] = decodeHtmlEntities(decoded[field] as string) as T[keyof T];
    }
  });
  
  return decoded;
}

// ============================================================================
// JWT & User Authentication Utils
// ============================================================================

/**
 * Interface untuk payload JWT user
 */
export interface UserPayload {
  user_id: string;
  email: string;
  name: string;
  client_id: string;
  scope?:'admin' | 'user';
  iat: number;
  exp: number;
}

/**
 * Decode JWT token tanpa verifikasi signature
 * Catatan: Ini hanya untuk membaca payload, bukan untuk validasi keamanan
 * Validasi signature dilakukan di backend
 */
export function decodeJWT(token: string): UserPayload | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

// Ambil access token dari localStorage
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

// Ambil data user dari JWT token yang tersimpan
export function getUserFromToken(): UserPayload | null {
  const token = getAccessToken();
  if (!token) return null;
  return decodeJWT(token);
}

//Cek apakah token sudah expired
export function isTokenExpired(token: string): boolean {
  try {
    const payload = decodeJWT(token);
    if (!payload || !payload.exp) return true;
    
    // exp dalam seconds, Date.now() dalam milliseconds
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

// Cek apakah user sudah login dan tokennya masih valid
export function isUserAuthenticated(): boolean {
  const token = getAccessToken();
  if (!token) return false;
  return !isTokenExpired(token);
}

// Generate default avatar URL menggunakan UI Avatars
export function getDefaultAvatar(name: string, size: number = 128): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10b981&color=fff&size=${size}`;
}

export function getUserScope(): 'admin' | 'user' | null {
  const user = getUserFromToken();
  return user?.scope ?? null;
}


// Hapus token dan logout user
export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('access_token');
  // Tambahkan logic lain jika perlu, seperti redirect ke login page
}