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