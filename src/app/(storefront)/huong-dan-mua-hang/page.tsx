// ============================================================
// Trang Hướng dẫn mua hàng - /huong-dan-mua-hang
// Nội dung tĩnh: step-by-step mua hàng trên website
// ============================================================

import PolicyLayout from '@/components/storefront/PolicyLayout';

export const metadata = {
  title: 'Hướng dẫn mua hàng | Nội Thất Xinh',
  description:
    'Hướng dẫn chi tiết các bước mua hàng trực tuyến tại Nội Thất Xinh. Từ chọn sản phẩm đến nhận hàng tận nhà.',
};

const tableOfContents = [
  { id: 'tong-quan', label: 'Tổng quan quy trình' },
  { id: 'buoc-1', label: 'Bước 1: Tìm sản phẩm' },
  { id: 'buoc-2', label: 'Bước 2: Thêm vào giỏ hàng' },
  { id: 'buoc-3', label: 'Bước 3: Kiểm tra giỏ hàng' },
  { id: 'buoc-4', label: 'Bước 4: Thanh toán' },
  { id: 'buoc-5', label: 'Bước 5: Nhận hàng' },
  { id: 'luu-y', label: 'Lưu ý khi mua hàng' },
];

const ShoppingGuidePage = () => {
  return (
    <PolicyLayout
      title="Hướng dẫn mua hàng"
      description="Mua sắm nội thất trực tuyến dễ dàng chỉ với 5 bước đơn giản"
      breadcrumbLabel="Hướng dẫn mua hàng"
      tableOfContents={tableOfContents}
    >
      {/* Tổng quan */}
      <h2 id="tong-quan">Tổng quan quy trình mua hàng</h2>
      <p>
        Mua sắm tại <strong>Nội Thất Xinh</strong> vô cùng đơn giản và nhanh chóng. Bạn chỉ cần 
        thực hiện theo 5 bước dưới đây để sở hữu những sản phẩm nội thất chất lượng cao với mức giá tốt nhất.
      </p>

      {/* Step indicators */}
      <div className="flex flex-wrap items-center justify-center gap-2 my-8">
        {['Tìm sản phẩm', 'Thêm giỏ hàng', 'Kiểm tra giỏ', 'Thanh toán', 'Nhận hàng'].map(
          (step, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-white border border-border-light rounded-lg px-4 py-2.5 shadow-sm">
                <span className="w-7 h-7 flex items-center justify-center bg-primary text-white text-xs font-bold rounded-full">
                  {i + 1}
                </span>
                <span className="text-sm font-medium text-navy whitespace-nowrap">{step}</span>
              </div>
              {i < 4 && (
                <span className="text-text-muted hidden sm:inline">→</span>
              )}
            </div>
          )
        )}
      </div>

      {/* Bước 1 */}
      <h2 id="buoc-1">Bước 1: Tìm sản phẩm yêu thích</h2>
      <p>Bạn có thể tìm sản phẩm bằng nhiều cách:</p>

      <h3>📂 Duyệt theo danh mục</h3>
      <ul>
        <li>Trên thanh menu chính, di chuột vào <strong>&ldquo;Sản phẩm&rdquo;</strong></li>
        <li>Chọn danh mục phù hợp: Sofa, Giường ngủ, Bàn ghế ăn, Tủ kệ, Phụ kiện...</li>
        <li>Sử dụng bộ lọc bên trái để lọc theo khoảng giá, kích thước, chất liệu</li>
      </ul>

      <h3>🔍 Tìm kiếm nhanh</h3>
      <ul>
        <li>Nhấp vào ô <strong>Tìm kiếm</strong> ở đầu trang</li>
        <li>Nhập tên sản phẩm, mã sản phẩm hoặc từ khóa mô tả</li>
        <li>Nhấn Enter hoặc nhấp vào biểu tượng kính lúp để tìm</li>
      </ul>

      <h3>⭐ Sản phẩm nổi bật</h3>
      <ul>
        <li>Tại trang chủ, phần <strong>&ldquo;Sản phẩm nổi bật&rdquo;</strong> hiển thị những sản phẩm được yêu thích nhất</li>
        <li>Nhấp vào sản phẩm để xem chi tiết: hình ảnh, mô tả, giá, đánh giá từ khách hàng</li>
      </ul>

      {/* Bước 2 */}
      <h2 id="buoc-2">Bước 2: Thêm vào giỏ hàng</h2>
      <p>Sau khi chọn được sản phẩm ưng ý:</p>
      <ol>
        <li>Trên trang chi tiết sản phẩm, chọn <strong>màu sắc / kích thước</strong> (nếu có)</li>
        <li>Điều chỉnh <strong>số lượng</strong> muốn mua</li>
        <li>
          Nhấn nút <strong>&ldquo;Thêm vào giỏ hàng&rdquo;</strong> – 
          sản phẩm sẽ được thêm vào giỏ hàng ngay lập tức
        </li>
        <li>Bạn sẽ thấy số lượng trên biểu tượng giỏ hàng (góc phải trên) tăng lên</li>
      </ol>

      <div className="highlight-box">
        <p>
          <strong>💡 Mẹo:</strong> Bạn có thể nhấn vào biểu tượng ❤️ để lưu sản phẩm yêu thích, 
          tiện theo dõi khi có giảm giá.
        </p>
      </div>

      {/* Bước 3 */}
      <h2 id="buoc-3">Bước 3: Kiểm tra giỏ hàng</h2>
      <p>Nhấp vào biểu tượng <strong>Giỏ hàng</strong> ở góc phải trên cùng để xem lại:</p>
      <ul>
        <li>Danh sách sản phẩm đã chọn (tên, hình ảnh, giá, số lượng)</li>
        <li>Điều chỉnh <strong>số lượng</strong> hoặc <strong>xóa</strong> sản phẩm nếu cần</li>
        <li>Xem <strong>tổng tiền tạm tính</strong> trước khi thanh toán</li>
        <li>Nhập <strong>mã giảm giá</strong> (nếu có) và nhấn &ldquo;Áp dụng&rdquo;</li>
      </ul>
      <p>
        Khi đã hài lòng với giỏ hàng, nhấn nút <strong>&ldquo;Tiến hành thanh toán&rdquo;</strong>.
      </p>

      {/* Bước 4 */}
      <h2 id="buoc-4">Bước 4: Điền thông tin & Thanh toán</h2>
      <p>Tại trang thanh toán, bạn cần điền đầy đủ các thông tin:</p>

      <h3>📋 Thông tin giao hàng</h3>
      <ul>
        <li>Họ và tên người nhận</li>
        <li>Số điện thoại liên hệ</li>
        <li>Địa chỉ giao hàng chi tiết (số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố)</li>
        <li>Ghi chú cho đơn hàng (nếu có): ví dụ &ldquo;Giao giờ hành chính&rdquo;, &ldquo;Gọi trước khi giao&rdquo;</li>
      </ul>

      <h3>💳 Phương thức thanh toán</h3>
      <p>Chọn 1 trong các phương thức:</p>
      <ul>
        <li><strong>Thanh toán khi nhận hàng (COD):</strong> Thanh toán tiền mặt cho nhân viên giao hàng</li>
        <li><strong>Chuyển khoản ngân hàng:</strong> Chuyển khoản trước, đơn hàng được xử lý sau khi nhận tiền</li>
        <li><strong>Ví điện tử:</strong> MoMo, VNPay, ZaloPay</li>
      </ul>

      <p>
        Kiểm tra lại toàn bộ thông tin, rồi nhấn <strong>&ldquo;Đặt hàng&rdquo;</strong>. 
        Bạn sẽ nhận được email/SMS xác nhận đơn hàng.
      </p>

      <div className="info-box">
        <p>
          <strong>ℹ️ Tài khoản:</strong> Nếu bạn đã có tài khoản và đăng nhập, thông tin giao hàng 
          sẽ được tự động điền. Nếu chưa có tài khoản, bạn vẫn có thể đặt hàng với tư cách khách 
          (không cần đăng ký).
        </p>
      </div>

      {/* Bước 5 */}
      <h2 id="buoc-5">Bước 5: Nhận hàng & Kiểm tra</h2>
      <ol>
        <li>
          Sau khi đặt hàng, bộ phận CSKH sẽ gọi điện <strong>xác nhận đơn hàng</strong> trong 
          vòng 24 giờ (giờ hành chính)
        </li>
        <li>
          Nhân viên giao hàng sẽ liên hệ trước <strong>ít nhất 24 giờ</strong> để hẹn lịch giao cụ thể
        </li>
        <li>
          Khi nhận hàng, vui lòng <strong>kiểm tra kỹ sản phẩm</strong> cùng nhân viên giao hàng: 
          đúng mẫu mã, màu sắc, số lượng, không bị trầy xước hay hư hỏng
        </li>
        <li>
          Ký xác nhận <strong>biên bản giao nhận</strong> sau khi hài lòng với sản phẩm
        </li>
        <li>
          Nhân viên kỹ thuật sẽ <strong>lắp đặt tận nơi</strong> (với các sản phẩm cần lắp ráp) 
          và hướng dẫn sử dụng
        </li>
      </ol>

      {/* Lưu ý */}
      <h2 id="luu-y">Lưu ý khi mua hàng</h2>
      <ul>
        <li>
          Nên <strong>đăng ký tài khoản</strong> để theo dõi đơn hàng, tích lũy điểm thưởng 
          và nhận thông báo khuyến mãi
        </li>
        <li>
          Kiểm tra kỹ <strong>kích thước sản phẩm</strong> và so sánh với không gian thực tế 
          trước khi đặt hàng
        </li>
        <li>
          Đọc phần <strong>mô tả chi tiết</strong> và <strong>đánh giá từ khách hàng</strong> để 
          hiểu rõ hơn về sản phẩm
        </li>
        <li>
          Nếu cần tư vấn, hãy gọi Hotline <strong>1900 0129</strong> hoặc nhắn tin qua 
          Live Chat trên website
        </li>
        <li>
          Giữ lại <strong>mã đơn hàng</strong> để tra cứu trạng thái giao hàng và bảo hành sau này
        </li>
      </ul>

      <div className="highlight-box">
        <p>
          <strong>🎁 Ưu đãi thành viên:</strong> Đăng ký tài khoản ngay hôm nay để nhận 
          <strong> giảm 5%</strong> cho đơn hàng đầu tiên và nhiều ưu đãi độc quyền khác!
        </p>
      </div>
    </PolicyLayout>
  );
};

export default ShoppingGuidePage;
