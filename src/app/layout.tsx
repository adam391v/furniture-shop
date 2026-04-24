import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Nội Thất Cao Cấp - Thiết Kế Hiện Đại | Furniture Shop",
  description:
    "Cửa hàng nội thất cao cấp với thiết kế hiện đại phong cách Bắc Âu. Sofa, giường ngủ, tủ quần áo, bàn làm việc. Miễn phí giao hàng & bảo hành 5 năm.",
  keywords: "nội thất, sofa, giường ngủ, tủ quần áo, bàn làm việc, nội thất cao cấp",
};

// ============================================================
// Root Layout - Chỉ chứa HTML wrapper + providers
// Header/Footer được đặt trong (storefront)/layout.tsx
// Admin có layout riêng tại admin/layout.tsx
// ============================================================
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="vi">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: '8px',
                fontSize: '14px',
              },
            }}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
