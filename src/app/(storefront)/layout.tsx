// ============================================================
// Storefront Layout - Header + Footer cho các trang người dùng
// Chỉ áp dụng cho các route trong group (storefront)
// ============================================================

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const StorefrontLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
};

export default StorefrontLayout;
