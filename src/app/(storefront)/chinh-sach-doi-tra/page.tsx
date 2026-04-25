// ============================================================
// Trang Chính sách đổi trả - /chinh-sach-doi-tra
// Nội dung tĩnh tham khảo từ MOHO
// ============================================================

import PolicyLayout from '@/components/storefront/PolicyLayout';

export const metadata = {
  title: 'Chính sách đổi trả | Nội Thất Xinh',
  description:
    'Chính sách đổi trả hàng hóa của Nội Thất Xinh. Hỗ trợ đổi hàng trong 14 ngày, trả hàng tại thời điểm giao nhận.',
};

const tableOfContents = [
  { id: 'dieu-kien', label: 'Điều kiện đổi trả' },
  { id: 'doi-hang', label: 'Chính sách đổi hàng' },
  { id: 'tra-hang', label: 'Chính sách trả hàng' },
  { id: 'khong-ap-dung', label: 'Không áp dụng' },
  { id: 'quy-trinh', label: 'Quy trình đổi trả' },
];

const ReturnPolicyPage = () => {
  return (
    <PolicyLayout
      title="Chính sách đổi trả"
      description="14 ngày đổi hàng trọn vẹn – Trải nghiệm mua sắm không lo lắng"
      breadcrumbLabel="Chính sách đổi trả"
      tableOfContents={tableOfContents}
    >
      <h2 id="dieu-kien">Điều kiện đổi trả</h2>
      <p>
        <strong>Nội Thất Xinh</strong> cam kết mang đến trải nghiệm mua sắm hài lòng nhất. 
        Trong trường hợp sản phẩm không đáp ứng kỳ vọng, quý khách có thể yêu cầu đổi hoặc trả hàng 
        theo các điều kiện sau:
      </p>
      <ul>
        <li>Sản phẩm còn nguyên vẹn, chưa qua sử dụng, không bị trầy xước hoặc hư hỏng</li>
        <li>Còn đầy đủ bao bì, nhãn mác, tem bảo hành và phụ kiện đi kèm (nếu có)</li>
        <li>Có hóa đơn mua hàng hoặc đơn hàng trực tuyến hợp lệ</li>
        <li>Yêu cầu đổi/trả được gửi trong thời hạn quy định</li>
      </ul>

      <h2 id="doi-hang">Chính sách đổi hàng</h2>

      <h3>Đổi hàng trong 14 ngày</h3>
      <p>
        Nội Thất Xinh áp dụng chương trình <strong>&ldquo;14 ngày đổi hàng trọn vẹn&rdquo;</strong> cho 
        các dòng sản phẩm thuộc danh mục áp dụng, tính từ ngày giao hàng thành công:
      </p>
      <ul>
        <li>Khách hàng được đổi sang sản phẩm khác có giá trị tương đương hoặc cao hơn</li>
        <li>Trường hợp sản phẩm mới có giá trị cao hơn, quý khách thanh toán phần chênh lệch</li>
        <li>Trường hợp sản phẩm mới có giá trị thấp hơn, Nội Thất Xinh sẽ hoàn lại phần chênh lệch</li>
        <li>Mỗi đơn hàng chỉ được đổi <strong>01 lần duy nhất</strong></li>
      </ul>

      <div className="highlight-box">
        <p>
          <strong>⚠️ Quan trọng:</strong> Chương trình 14 ngày đổi hàng chỉ áp dụng đổi sản phẩm, 
          không áp dụng hoàn tiền. Chi phí vận chuyển đổi hàng do khách hàng chịu.
        </p>
      </div>

      <h3>Đổi hàng do lỗi nhà sản xuất</h3>
      <p>
        Trong trường hợp sản phẩm bị lỗi do nhà sản xuất (lỗi kết cấu, lỗi chất liệu, lỗi lắp ráp), 
        Nội Thất Xinh sẽ:
      </p>
      <ul>
        <li>Đổi sản phẩm mới tương đương <strong>miễn phí hoàn toàn</strong></li>
        <li>Thời hạn: trong suốt thời gian bảo hành</li>
        <li>Bao gồm miễn phí vận chuyển và lắp đặt sản phẩm thay thế</li>
      </ul>

      <h2 id="tra-hang">Chính sách trả hàng</h2>
      <p>
        Khách hàng có quyền trả hàng trong các trường hợp sau:
      </p>

      <h3>Trả hàng tại thời điểm giao hàng</h3>
      <ul>
        <li>Sản phẩm giao không đúng mẫu mã, màu sắc, kích thước đã đặt</li>
        <li>Sản phẩm bị hư hỏng, trầy xước nghiêm trọng trong quá trình vận chuyển</li>
        <li>Nội Thất Xinh sẽ giao lại sản phẩm đúng trong thời gian sớm nhất (1–3 ngày)</li>
      </ul>

      <h3>Trả hàng sau khi nhận</h3>
      <p>
        Trường hợp khách hàng muốn trả hàng do thay đổi ý kiến (không phải lỗi sản phẩm):
      </p>
      <ul>
        <li>Thời hạn: trong vòng <strong>3 ngày</strong> kể từ ngày nhận hàng</li>
        <li>Khách hàng chịu phí vận chuyển: <strong>300.000₫</strong></li>
        <li>Chịu chi phí lắp đặt (tùy sản phẩm) nếu áp dụng</li>
        <li>Sản phẩm phải đảm bảo nguyên vẹn 100%</li>
      </ul>

      <h2 id="khong-ap-dung">Trường hợp không áp dụng đổi trả</h2>
      <ul>
        <li>Sản phẩm đã qua sử dụng, bị trầy xước, biến dạng hoặc hư hỏng do lỗi người dùng</li>
        <li>Sản phẩm đã tự ý sửa chữa, thay đổi kết cấu hoặc tháo rời</li>
        <li>Sản phẩm mua trong chương trình <strong>Flash Sale, thanh lý, giảm giá sâu</strong></li>
        <li>Sản phẩm thuộc danh mục <strong>Đồ trang trí và Phụ kiện</strong></li>
        <li>Sản phẩm <strong>đặt riêng theo yêu cầu</strong> (custom order)</li>
        <li>Đã quá thời hạn đổi/trả theo quy định</li>
      </ul>

      <h2 id="quy-trinh">Quy trình đổi trả</h2>
      <ol>
        <li>
          <strong>Liên hệ CSKH:</strong> Gọi Hotline <strong>1900 0129</strong> hoặc gửi email 
          đến <strong>cskh@noithatxinh.vn</strong> để thông báo yêu cầu đổi/trả hàng.
        </li>
        <li>
          <strong>Cung cấp thông tin:</strong> Mã đơn hàng, lý do đổi/trả, hình ảnh sản phẩm 
          (nếu có lỗi).
        </li>
        <li>
          <strong>Xác nhận:</strong> Bộ phận CSKH sẽ xác nhận yêu cầu trong vòng <strong>24 giờ</strong> 
          làm việc.
        </li>
        <li>
          <strong>Thu hồi sản phẩm:</strong> Đội ngũ giao hàng sẽ đến nhận lại sản phẩm cũ theo lịch hẹn.
        </li>
        <li>
          <strong>Giao sản phẩm mới:</strong> Sản phẩm thay thế sẽ được giao trong vòng 
          <strong> 3 – 7 ngày làm việc</strong> sau khi hoàn tất thủ tục.
        </li>
      </ol>

      <div className="info-box">
        <p>
          <strong>ℹ️ Hoàn tiền:</strong> Đối với trường hợp được duyệt hoàn tiền, thời gian xử lý 
          là 7 – 14 ngày làm việc. Tiền sẽ được hoàn qua hình thức thanh toán ban đầu 
          (chuyển khoản ngân hàng hoặc ví điện tử).
        </p>
      </div>
    </PolicyLayout>
  );
};

export default ReturnPolicyPage;
