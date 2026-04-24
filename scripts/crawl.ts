// ============================================================
// Script Crawl Sản Phẩm từ website nội thất
// Flow: Crawl HTML → Parse data → Rewrite nội dung → Lưu DB
// ============================================================
//
// Cài đặt: npm install cheerio axios
// Chạy:    npx tsx scripts/crawl.ts
//

import axios from 'axios';
import * as cheerio from 'cheerio';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const dbUrl = process.env.DATABASE_URL || 'mysql://furniture_shop_user:123456@localhost:3306/furniture_shop';
const url = new URL(dbUrl.replace('mysql://', 'http://'));
const adapter = new PrismaMariaDb({
  host: url.hostname, port: parseInt(url.port) || 3306,
  user: url.username, password: url.password,
  database: url.pathname.slice(1), connectionLimit: 5,
});
const prisma = new PrismaClient({ adapter });

// --- Cấu hình ---
const BASE_URL = 'https://moho.com.vn';
const COLLECTION_URL = `${BASE_URL}/collections/all`;

// --- Interface cho dữ liệu crawl ---
interface CrawledProduct {
  name: string;
  slug: string;
  sku: string;
  description: string;
  price: number;
  comparePrice: number;
  material: string;
  dimensions: string;
  images: string[];
  variants: {
    color: string;
    colorHex: string;
    size: string;
    price: number;
  }[];
}

// ============================================================
// 1. Crawl danh sách URL sản phẩm từ trang collection
// ============================================================
const crawlProductUrls = async (pageUrl: string): Promise<string[]> => {
  console.log(`📥 Đang crawl danh sách sản phẩm từ: ${pageUrl}`);
  
  try {
    const { data } = await axios.get(pageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const $ = cheerio.load(data);
    const urls: string[] = [];

    // Tìm tất cả link sản phẩm trong grid
    $('a[href*="/products/"]').each((_, el) => {
      const href = $(el).attr('href');
      if (href && !urls.includes(href)) {
        urls.push(href.startsWith('http') ? href : `${BASE_URL}${href}`);
      }
    });

    console.log(`✅ Tìm thấy ${urls.length} URL sản phẩm`);
    return [...new Set(urls)]; // Loại bỏ trùng lặp
  } catch (error) {
    console.error('❌ Lỗi crawl danh sách:', error);
    return [];
  }
};

// ============================================================
// 2. Crawl chi tiết 1 sản phẩm
// ============================================================
const crawlProductDetail = async (url: string): Promise<CrawledProduct | null> => {
  console.log(`  📦 Đang crawl: ${url}`);

  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const $ = cheerio.load(data);

    // Trích xuất thông tin cơ bản
    const name = $('h1').first().text().trim();
    const priceText = $('.product-price, .price').first().text().replace(/[^\d]/g, '');
    const comparePriceText = $('.compare-price, .old-price').first().text().replace(/[^\d]/g, '');
    const description = $('.product-description, .product-content').first().text().trim();
    const sku = $('[data-sku], .sku').first().text().replace('SKU:', '').trim();

    // Trích xuất ảnh
    const images: string[] = [];
    $('img[src*="product"], .product-image img').each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src');
      if (src) images.push(src.startsWith('http') ? src : `https:${src}`);
    });

    // Tạo slug từ tên
    const slug = createSlug(name);

    const product: CrawledProduct = {
      name,
      slug,
      sku: sku || `SP-${Date.now()}`,
      description,
      price: parseInt(priceText) || 0,
      comparePrice: parseInt(comparePriceText) || 0,
      material: '',
      dimensions: '',
      images: [...new Set(images)].slice(0, 10),
      variants: [],
    };

    console.log(`    ✅ ${name} - ${product.price.toLocaleString()}₫`);
    return product;
  } catch (error) {
    console.error(`    ❌ Lỗi crawl ${url}:`, error);
    return null;
  }
};

// ============================================================
// 3. Rewrite nội dung cho SEO
// ============================================================
const rewriteContent = (product: CrawledProduct): CrawledProduct => {
  // Giữ nguyên thông tin quan trọng (giá, thông số)
  // Chỉ rewrite phần mô tả để tránh duplicate content
  const rewritten = { ...product };

  // Thêm prefix thương hiệu mới
  if (!rewritten.name.includes('Nội Thất Xinh')) {
    rewritten.name = rewritten.name
      .replace(/MOHO/gi, 'Nội Thất Xinh')
      .trim();
  }

  // Rewrite mô tả SEO-friendly
  if (rewritten.description) {
    rewritten.description = `${rewritten.name} - Sản phẩm nội thất cao cấp với thiết kế hiện đại. ${rewritten.description}. Miễn phí giao hàng & lắp đặt, bảo hành 5 năm.`;
  }

  return rewritten;
};

// ============================================================
// 4. Lưu vào Database (MySQL qua Prisma)
// ============================================================
const saveToDatabase = async (products: CrawledProduct[]): Promise<void> => {
  console.log(`\n💾 Đang lưu ${products.length} sản phẩm vào database...`);

  for (const product of products) {
    try {
      // Tạo hoặc cập nhật sản phẩm
      const savedProduct = await prisma.product.upsert({
        where: { slug: product.slug },
        update: {
          name: product.name,
          description: product.description,
          price: product.price,
          comparePrice: product.comparePrice,
          material: product.material,
          dimensions: product.dimensions,
        },
        create: {
          name: product.name,
          slug: product.slug,
          sku: product.sku,
          description: product.description,
          shortDescription: product.description?.substring(0, 200),
          price: product.price,
          comparePrice: product.comparePrice,
          material: product.material,
          dimensions: product.dimensions,
          isActive: true,
          isFeatured: false,
          seoTitle: product.name,
          seoDescription: product.description?.substring(0, 160),
        },
      });

      // Lưu ảnh sản phẩm
      for (let i = 0; i < product.images.length; i++) {
        await prisma.productImage.create({
          data: {
            productId: savedProduct.id,
            imageUrl: product.images[i],
            altText: `${product.name} - Ảnh ${i + 1}`,
            sortOrder: i,
          },
        });
      }

      console.log(`  ✅ Đã lưu: ${product.name}`);
    } catch (error) {
      console.error(`  ❌ Lỗi lưu ${product.name}:`, error);
    }
  }
};

// ============================================================
// Hàm tiện ích - Tạo slug từ tiếng Việt
// ============================================================
const createSlug = (str: string): string => {
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
  return result.replace(/[^a-z0-9\s-]/g, '').replace(/[\s-]+/g, '-').replace(/^-+|-+$/g, '');
};

// ============================================================
// Main - Chạy toàn bộ flow
// ============================================================
const main = async () => {
  console.log('🚀 Bắt đầu crawl sản phẩm...\n');

  // Bước 1: Crawl danh sách URL
  const urls = await crawlProductUrls(COLLECTION_URL);

  // Bước 2: Crawl chi tiết từng sản phẩm (giới hạn 20 SP đầu)
  const products: CrawledProduct[] = [];
  for (const url of urls.slice(0, 20)) {
    const product = await crawlProductDetail(url);
    if (product) {
      // Bước 3: Rewrite nội dung
      const rewritten = rewriteContent(product);
      products.push(rewritten);
    }
    // Delay để tránh bị block
    await new Promise((r) => setTimeout(r, 1000));
  }

  // Bước 4: Lưu vào database
  await saveToDatabase(products);

  console.log(`\n🎉 Hoàn thành! Đã crawl & lưu ${products.length} sản phẩm.`);
  await prisma.$disconnect();
};

main().catch((e) => {
  console.error('❌ Lỗi:', e);
  prisma.$disconnect();
  process.exit(1);
});
