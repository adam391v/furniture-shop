// ============================================================
// Trang Chính sách bảo mật - /chinh-sach-bao-mat
// Nội dung tĩnh về bảo mật thông tin khách hàng
// ============================================================

import PolicyLayout from '@/components/storefront/PolicyLayout';

export const metadata = {
  title: 'Chính sách bảo mật | Nội Thất Xinh',
  description:
    'Chính sách bảo mật thông tin cá nhân của Nội Thất Xinh. Cam kết bảo vệ dữ liệu khách hàng an toàn tuyệt đối.',
};

const tableOfContents = [
  { id: 'thu-thap', label: 'Thu thập thông tin' },
  { id: 'muc-dich', label: 'Mục đích sử dụng' },
  { id: 'bao-mat', label: 'Biện pháp bảo mật' },
  { id: 'chia-se', label: 'Chia sẻ thông tin' },
  { id: 'quyen-loi', label: 'Quyền lợi khách hàng' },
  { id: 'cookie', label: 'Cookie & Tracking' },
];

const PrivacyPolicyPage = () => {
  return (
    <PolicyLayout
      title="Chính sách bảo mật"
      description="Cam kết bảo vệ thông tin cá nhân và quyền riêng tư của khách hàng"
      breadcrumbLabel="Chính sách bảo mật"
      tableOfContents={tableOfContents}
    >
      <h2 id="thu-thap">Thu thập thông tin</h2>
      <p>
        <strong>Nội Thất Xinh</strong> thu thập thông tin cá nhân của khách hàng khi quý khách thực hiện 
        các hoạt động sau trên website:
      </p>
      <ul>
        <li>Đăng ký tài khoản thành viên</li>
        <li>Đặt hàng và thanh toán trực tuyến</li>
        <li>Đăng ký nhận bản tin, khuyến mãi</li>
        <li>Gửi yêu cầu tư vấn, liên hệ hỗ trợ</li>
        <li>Tham gia khảo sát, đánh giá sản phẩm</li>
      </ul>

      <p>Các thông tin được thu thập bao gồm:</p>
      <table>
        <thead>
          <tr>
            <th>Loại thông tin</th>
            <th>Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Thông tin cá nhân</strong></td>
            <td>Họ tên, ngày sinh, giới tính</td>
          </tr>
          <tr>
            <td><strong>Thông tin liên hệ</strong></td>
            <td>Số điện thoại, email, địa chỉ giao hàng</td>
          </tr>
          <tr>
            <td><strong>Thông tin thanh toán</strong></td>
            <td>Phương thức thanh toán (không lưu số thẻ ngân hàng)</td>
          </tr>
          <tr>
            <td><strong>Thông tin kỹ thuật</strong></td>
            <td>Địa chỉ IP, trình duyệt, thiết bị truy cập</td>
          </tr>
        </tbody>
      </table>

      <h2 id="muc-dich">Mục đích sử dụng</h2>
      <p>
        Thông tin cá nhân của quý khách được Nội Thất Xinh sử dụng cho các mục đích sau:
      </p>
      <ul>
        <li><strong>Xử lý đơn hàng:</strong> Xác nhận, vận chuyển, giao hàng và thanh toán</li>
        <li><strong>Chăm sóc khách hàng:</strong> Hỗ trợ giải đáp thắc mắc, khiếu nại, bảo hành</li>
        <li><strong>Cá nhân hóa trải nghiệm:</strong> Đề xuất sản phẩm phù hợp với sở thích và nhu cầu</li>
        <li><strong>Tiếp thị:</strong> Gửi thông tin khuyến mãi, sản phẩm mới (chỉ khi được sự đồng ý)</li>
        <li><strong>Cải thiện dịch vụ:</strong> Phân tích hành vi mua sắm để nâng cao chất lượng phục vụ</li>
        <li><strong>Pháp lý:</strong> Tuân thủ các quy định pháp luật hiện hành khi có yêu cầu từ cơ quan chức năng</li>
      </ul>

      <h2 id="bao-mat">Biện pháp bảo mật</h2>
      <p>
        Nội Thất Xinh áp dụng các biện pháp kỹ thuật và tổ chức phù hợp để bảo vệ thông tin 
        khách hàng khỏi truy cập trái phép, mất mát, tiết lộ hoặc thay đổi:
      </p>
      <ul>
        <li>
          <strong>Mã hóa SSL/TLS:</strong> Toàn bộ dữ liệu truyền tải giữa trình duyệt và máy chủ 
          được mã hóa bằng giao thức SSL 256-bit
        </li>
        <li>
          <strong>Hệ thống tường lửa:</strong> Bảo vệ máy chủ khỏi các cuộc tấn công mạng
        </li>
        <li>
          <strong>Kiểm soát truy cập:</strong> Chỉ nhân viên được ủy quyền mới có thể truy cập 
          dữ liệu khách hàng, và bị giám sát khi thao tác
        </li>
        <li>
          <strong>Sao lưu định kỳ:</strong> Dữ liệu được sao lưu tự động hàng ngày, 
          lưu trữ tại trung tâm dữ liệu đạt chuẩn Tier III
        </li>
        <li>
          <strong>Mật khẩu mã hóa:</strong> Mật khẩu tài khoản được mã hóa một chiều (hashing), 
          không ai có thể đọc được, kể cả nhân viên hệ thống
        </li>
      </ul>

      <div className="highlight-box">
        <p>
          <strong>🔒 Cam kết:</strong> Nội Thất Xinh tuyệt đối <strong>không bán, trao đổi hoặc 
          cho thuê</strong> thông tin cá nhân của khách hàng cho bất kỳ bên thứ ba nào 
          vì mục đích thương mại.
        </p>
      </div>

      <h2 id="chia-se">Chia sẻ thông tin với bên thứ ba</h2>
      <p>
        Nội Thất Xinh chỉ chia sẻ thông tin khách hàng với bên thứ ba trong các trường hợp sau:
      </p>
      <ul>
        <li>
          <strong>Đối tác vận chuyển:</strong> Chia sẻ tên, số điện thoại, địa chỉ giao hàng 
          để thực hiện giao đơn hàng
        </li>
        <li>
          <strong>Cổng thanh toán:</strong> Chuyển thông tin giao dịch đến cổng thanh toán 
          (VNPay, MoMo, ZaloPay) để xử lý thanh toán an toàn
        </li>
        <li>
          <strong>Yêu cầu pháp lý:</strong> Cung cấp thông tin khi có yêu cầu hợp lệ 
          từ cơ quan pháp luật có thẩm quyền
        </li>
      </ul>
      <p>
        Tất cả các đối tác đều phải cam kết bảo mật thông tin theo tiêu chuẩn tương đương 
        của Nội Thất Xinh.
      </p>

      <h2 id="quyen-loi">Quyền lợi của khách hàng</h2>
      <p>
        Theo quy định pháp luật Việt Nam, quý khách có các quyền sau đối với thông tin cá nhân:
      </p>
      <ul>
        <li><strong>Quyền truy cập:</strong> Xem và kiểm tra thông tin cá nhân đang được lưu trữ</li>
        <li><strong>Quyền chỉnh sửa:</strong> Cập nhật, sửa đổi thông tin không chính xác</li>
        <li><strong>Quyền xóa:</strong> Yêu cầu xóa tài khoản và dữ liệu cá nhân</li>
        <li><strong>Quyền từ chối:</strong> Hủy nhận email, tin nhắn quảng cáo bất cứ lúc nào</li>
        <li><strong>Quyền khiếu nại:</strong> Phản ánh về việc xử lý thông tin không đúng quy định</li>
      </ul>

      <p>
        Để thực hiện các quyền trên, quý khách vui lòng liên hệ:
      </p>
      <div className="info-box">
        <p>
          <strong>📧 Email:</strong> baomat@noithatxinh.vn<br />
          <strong>📞 Hotline:</strong> 1900 0129 (nhánh 3 – Bảo mật)<br />
          <strong>⏰ Thời gian xử lý:</strong> 3 – 5 ngày làm việc
        </p>
      </div>

      <h2 id="cookie">Cookie & Tracking</h2>
      <p>
        Website của Nội Thất Xinh sử dụng cookie và các công nghệ theo dõi tương tự để:
      </p>
      <ul>
        <li>Ghi nhớ thông tin đăng nhập và giỏ hàng của quý khách</li>
        <li>Phân tích lưu lượng truy cập và hành vi người dùng (Google Analytics)</li>
        <li>Hiển thị quảng cáo liên quan trên các nền tảng đối tác (Facebook, Google Ads)</li>
        <li>Cải thiện tốc độ và trải nghiệm sử dụng website</li>
      </ul>
      <p>
        Quý khách có thể tắt cookie trong phần cài đặt trình duyệt. Tuy nhiên, việc này có thể ảnh hưởng 
        đến một số tính năng của website (ví dụ: giỏ hàng, đăng nhập tự động).
      </p>

      <p>
        <em>
          Chính sách bảo mật này có hiệu lực từ ngày 01/01/2026 và có thể được cập nhật định kỳ. 
          Mọi thay đổi sẽ được thông báo trên website.
        </em>
      </p>
    </PolicyLayout>
  );
};

export default PrivacyPolicyPage;
