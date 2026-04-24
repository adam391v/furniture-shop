// ============================================================
// Hàm tiện ích dùng chung trong toàn bộ dự án
// ============================================================

/**
 * Format số tiền sang định dạng VNĐ
 * Ví dụ: 9990000 → "9,990,000₫"
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN').format(price) + '₫';
};

/**
 * Tính phần trăm giảm giá
 * Ví dụ: (9990000, 13990000) → 29
 */
export const calcDiscount = (price: number, comparePrice: number): number => {
  if (!comparePrice || comparePrice <= price) return 0;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
};

/**
 * Tạo slug từ chuỗi tiếng Việt
 */
export const createSlug = (str: string): string => {
  const map: Record<string, string> = {
    'à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ': 'a',
    'è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ': 'e',
    'ì|í|ị|ỉ|ĩ': 'i',
    'ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ': 'o',
    'ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ': 'u',
    'ỳ|ý|ỵ|ỷ|ỹ': 'y',
    'đ': 'd',
  };

  let result = str.toLowerCase();
  for (const pattern in map) {
    result = result.replace(new RegExp(pattern, 'g'), map[pattern]);
  }
  return result
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Rút gọn chuỗi text
 */
export const truncate = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
};

/**
 * Merge class names (dạng đơn giản thay cho clsx)
 */
export const cn = (...classes: (string | boolean | undefined | null)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Tạo mảng số cho rating stars
 */
export const getStarArray = (rating: number): ('full' | 'half' | 'empty')[] => {
  const stars: ('full' | 'half' | 'empty')[] = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) stars.push('full');
    else if (i - 0.5 <= rating) stars.push('half');
    else stars.push('empty');
  }
  return stars;
};

/**
 * Format ngày tháng tiếng Việt
 */
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};
