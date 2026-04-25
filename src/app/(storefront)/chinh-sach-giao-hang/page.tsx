// ============================================================
// Trang Chính sách giao hàng - /chinh-sach-giao-hang
// Nội dung tĩnh tham khảo từ MOHO
// ============================================================

import PolicyLayout from '@/components/storefront/PolicyLayout';

export const metadata = {
  title: 'Chính sách giao hàng | Nội Thất Xinh',
  description:
    'Tìm hiểu chính sách giao hàng và lắp đặt miễn phí của Nội Thất Xinh. Giao hàng nhanh trong 3 ngày tại TP.HCM, Hà Nội và các tỉnh lân cận.',
};

const tableOfContents = [
  { id: 'pham-vi', label: 'Phạm vi giao hàng' },
  { id: 'thoi-gian', label: 'Thời gian giao hàng' },
  { id: 'phi-giao-hang', label: 'Phí giao hàng' },
  { id: 'lap-dat', label: 'Lắp đặt sản phẩm' },
  { id: 'luu-y', label: 'Lưu ý quan trọng' },
];

const ShippingPolicyPage = () => {
  return (
    <PolicyLayout
      title="Chính sách giao hàng"
      description="Miễn phí giao hàng & lắp đặt tận nhà tại các khu vực trọng điểm"
      breadcrumbLabel="Chính sách giao hàng"
      tableOfContents={tableOfContents}
    >
      <h2 id="pham-vi">Phạm vi giao hàng</h2>
      <p>
        <strong>Nội Thất Xinh</strong> cung cấp dịch vụ giao hàng trên toàn quốc. Chúng tôi hỗ trợ 
        miễn phí giao hàng và lắp đặt tại các khu vực sau:
      </p>
      <ul>
        <li><strong>TP. Hồ Chí Minh:</strong> Tất cả các quận/huyện bao gồm TP. Thủ Đức</li>
        <li><strong>Hà Nội:</strong> Tất cả các quận/huyện nội thành và vùng ven</li>
        <li><strong>Bình Dương:</strong> TP. Thủ Dầu Một, TP. Dĩ An, TP. Thuận An</li>
        <li><strong>Đồng Nai:</strong> TP. Biên Hòa</li>
        <li><strong>Long An:</strong> TP. Tân An, huyện Bến Lức, Đức Hòa</li>
      </ul>

      <div className="highlight-box">
        <p>
          <strong>🚚 Lưu ý:</strong> Đối với các khu vực khác, phí giao hàng sẽ được tính theo khoảng cách 
          và thông báo cụ thể khi xác nhận đơn hàng.
        </p>
      </div>

      <h2 id="thoi-gian">Thời gian giao hàng</h2>
      <p>
        Thời gian giao hàng được tính từ thời điểm đơn hàng được xác nhận thành công:
      </p>

      <table>
        <thead>
          <tr>
            <th>Khu vực</th>
            <th>Sản phẩm có sẵn</th>
            <th>Sản phẩm đặt trước</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Nội thành TP.HCM, Hà Nội</td>
            <td>1 – 3 ngày làm việc</td>
            <td>7 – 15 ngày làm việc</td>
          </tr>
          <tr>
            <td>Bình Dương, Đồng Nai, Long An</td>
            <td>2 – 4 ngày làm việc</td>
            <td>10 – 18 ngày làm việc</td>
          </tr>
          <tr>
            <td>Các tỉnh thành khác</td>
            <td>5 – 7 ngày làm việc</td>
            <td>15 – 25 ngày làm việc</td>
          </tr>
        </tbody>
      </table>

      <p>
        Bộ phận giao hàng sẽ liên hệ trước <strong>ít nhất 24 giờ</strong> để xác nhận lịch giao cụ thể 
        với khách hàng.
      </p>

      <h2 id="phi-giao-hang">Phí giao hàng</h2>

      <h3>Khu vực miễn phí</h3>
      <p>
        Áp dụng cho tất cả đơn hàng giao trong phạm vi miễn phí (TP.HCM, Hà Nội, Bình Dương, 
        Đồng Nai, Long An) bao gồm:
      </p>
      <ul>
        <li>Miễn phí vận chuyển sản phẩm</li>
        <li>Miễn phí lắp đặt theo tiêu chuẩn nhà máy</li>
        <li>Miễn phí thu gom bao bì sau lắp đặt</li>
      </ul>

      <h3>Khu vực tính phí</h3>
      <p>
        Đối với các khu vực ngoài phạm vi miễn phí, phí giao hàng được tính dựa trên khoảng cách:
      </p>
      <table>
        <thead>
          <tr>
            <th>Khoảng cách</th>
            <th>Phí giao hàng</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Dưới 50km từ kho hàng</td>
            <td>200.000₫ – 400.000₫</td>
          </tr>
          <tr>
            <td>50 – 100km</td>
            <td>400.000₫ – 800.000₫</td>
          </tr>
          <tr>
            <td>Trên 100km</td>
            <td>Liên hệ để báo giá</td>
          </tr>
        </tbody>
      </table>

      <h2 id="lap-dat">Lắp đặt sản phẩm</h2>
      <p>
        Đội ngũ kỹ thuật viên chuyên nghiệp của Nội Thất Xinh sẽ trực tiếp lắp đặt sản phẩm 
        tại nhà khách hàng, đảm bảo:
      </p>
      <ul>
        <li>Lắp đặt đúng kỹ thuật theo tiêu chuẩn nhà sản xuất</li>
        <li>Kiểm tra chất lượng sản phẩm trước khi bàn giao</li>
        <li>Hướng dẫn sử dụng và bảo quản sản phẩm</li>
        <li>Thu gom toàn bộ bao bì, thùng carton sau khi lắp đặt</li>
      </ul>

      <div className="info-box">
        <p>
          <strong>ℹ️ Lưu ý:</strong> Nội Thất Xinh chỉ thực hiện lắp đặt theo tiêu chuẩn sản phẩm. 
          Chúng tôi không hỗ trợ các yêu cầu riêng như khoan tường, gắn sản phẩm lên tường, 
          hoặc sửa đổi kết cấu sản phẩm.
        </p>
      </div>

      <h2 id="luu-y">Lưu ý quan trọng</h2>
      <ol>
        <li>
          Vui lòng kiểm tra kỹ sản phẩm <strong>tại thời điểm nhận hàng</strong>. 
          Mọi khiếu nại về ngoại quan (trầy xước, vỡ, móp méo) cần được phản hồi ngay 
          cho nhân viên giao hàng.
        </li>
        <li>
          Nếu cần <strong>thay đổi lịch giao hàng</strong>, vui lòng thông báo trước ít nhất 24 giờ. 
          Trường hợp dời lịch quá 2 lần, Nội Thất Xinh có quyền hủy đơn hàng.
        </li>
        <li>
          Khách hàng cần đảm bảo <strong>đường vào và không gian lắp đặt</strong> đủ rộng 
          để đưa sản phẩm vào (đặc biệt với sofa, giường, tủ lớn). Nếu cần sử dụng thang máy 
          hoặc cần bốc dỡ đặc biệt, vui lòng thông báo trước.
        </li>
        <li>
          Chính sách giao hàng miễn phí <strong>không áp dụng</strong> cho các sản phẩm 
          thuộc danh mục Đồ trang trí và Phụ kiện nhỏ (dưới 500.000₫).
        </li>
      </ol>
    </PolicyLayout>
  );
};

export default ShippingPolicyPage;
