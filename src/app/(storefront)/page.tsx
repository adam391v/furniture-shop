// ============================================================
// Trang Chủ - Furniture Shop
// Bố cục giống MOHO: Banner → Danh mục → SP nổi bật → Promo → Phòng → Testimonials
// ============================================================

import HeroBanner from '@/components/home/HeroBanner';
import CategoryGrid from '@/components/home/CategoryGrid';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import PromoBanner from '@/components/home/PromoBanner';
import RoomCollections from '@/components/home/RoomCollections';
import Testimonials from '@/components/home/Testimonials';

const HomePage = () => {
  return (
    <>
      <HeroBanner />
      <CategoryGrid />
      <FeaturedProducts />
      <PromoBanner />
      <RoomCollections />
      <Testimonials />
    </>
  );
};

export default HomePage;
