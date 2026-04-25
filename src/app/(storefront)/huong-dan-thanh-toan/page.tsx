// ============================================================
// Trang Hướng dẫn thanh toán - /huong-dan-thanh-toan
// Nội dung tĩnh: các phương thức thanh toán chi tiết
// ============================================================

import PolicyLayout from '@/components/storefront/PolicyLayout';

export const metadata = {
  title: 'Hướng dẫn thanh toán | Nội Thất Xinh',
  description:
    'Hướng dẫn chi tiết các phương thức thanh toán tại Nội Thất Xinh: COD, chuyển khoản ngân hàng, ví điện tử.',
};

const tableOfContents = [
  { id: 'tong-quan', label: 'Tổng quan' },
  { id: 'cod', label: 'Thanh toán khi nhận hàng' },
  { id: 'chuyen-khoan', label: 'Chuyển khoản ngân hàng' },
  { id: 'vi-dien-tu', label: 'Ví điện tử' },
  { id: 'tra-gop', label: 'Trả góp 0%' },
  { id: 'hoa-don', label: 'Xuất hóa đơn VAT' },
  { id: 'luu-y', label: 'Lưu ý chung' },
];

const PaymentGuidePage = () => {
  return (
    <PolicyLayout
      title="Hướng dẫn thanh toán"
      description="Đa dạng phương thức thanh toán – An toàn, tiện lợi, nhanh chóng"
      breadcrumbLabel="Hướng dẫn thanh toán"
      tableOfContents={tableOfContents}
    >
      {/* Tổng quan */}
      <h2 id="tong-quan">Tổng quan các phương thức thanh toán</h2>
      <p>
        <strong>Nội Thất Xinh</strong> hỗ trợ nhiều phương thức thanh toán linh hoạt để quý khách 
        có thể lựa chọn cách thuận tiện nhất:
      </p>

      <table>
        <thead>
          <tr>
            <th>Phương thức</th>
            <th>Phí</th>
            <th>Thời gian xử lý</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>COD (tiền mặt khi nhận hàng)</strong></td>
            <td>Miễn phí</td>
            <td>Xử lý ngay</td>
          </tr>
          <tr>
            <td><strong>Chuyển khoản ngân hàng</strong></td>
            <td>Miễn phí</td>
            <td>Xác nhận trong 1–4 giờ</td>
          </tr>
          <tr>
            <td><strong>Ví MoMo / VNPay / ZaloPay</strong></td>
            <td>Miễn phí</td>
            <td>Xác nhận tự động</td>
          </tr>
          <tr>
            <td><strong>Trả góp 0% qua thẻ tín dụng</strong></td>
            <td>Miễn phí lãi suất</td>
            <td>Xác nhận tự động</td>
          </tr>
        </tbody>
      </table>

      {/* COD */}
      <h2 id="cod">Thanh toán khi nhận hàng (COD)</h2>
      <p>
        Đây là phương thức thanh toán phổ biến và tiện lợi nhất. Quý khách chỉ thanh toán khi 
        nhận được hàng và kiểm tra sản phẩm đạt yêu cầu.
      </p>

      <h3>Cách thực hiện</h3>
      <ol>
        <li>Khi đặt hàng, chọn phương thức <strong>&ldquo;Thanh toán khi nhận hàng (COD)&rdquo;</strong></li>
        <li>Bộ phận CSKH sẽ gọi điện <strong>xác nhận đơn hàng</strong> trong vòng 24 giờ</li>
        <li>Nhân viên giao hàng đến giao sản phẩm theo lịch hẹn</li>
        <li>Kiểm tra sản phẩm trước mặt nhân viên giao hàng</li>
        <li>Thanh toán <strong>tiền mặt</strong> hoặc <strong>quẹt thẻ</strong> cho nhân viên</li>
        <li>Nhận biên lai và phiếu bảo hành</li>
      </ol>

      <div className="highlight-box">
        <p>
          <strong>💰 Lưu ý:</strong> Vui lòng chuẩn bị đúng số tiền để nhân viên dễ dàng thối lại. 
          Nhân viên giao hàng có trang bị máy POS để quẹt thẻ ngân hàng nếu cần.
        </p>
      </div>

      {/* Chuyển khoản */}
      <h2 id="chuyen-khoan">Chuyển khoản ngân hàng</h2>
      <p>
        Quý khách chuyển khoản trước toàn bộ giá trị đơn hàng. Đơn hàng sẽ được xử lý 
        ngay sau khi chúng tôi xác nhận nhận được tiền.
      </p>

      <h3>Thông tin chuyển khoản</h3>
      <table>
        <thead>
          <tr>
            <th>Thông tin</th>
            <th>Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Ngân hàng</strong></td>
            <td>Vietcombank – Chi nhánh TP.HCM</td>
          </tr>
          <tr>
            <td><strong>Số tài khoản</strong></td>
            <td>0071 0012 3456 78</td>
          </tr>
          <tr>
            <td><strong>Chủ tài khoản</strong></td>
            <td>CÔNG TY TNHH NỘI THẤT XINH</td>
          </tr>
        </tbody>
      </table>

      <h3>Nội dung chuyển khoản</h3>
      <div className="info-box">
        <p>
          <strong>Cú pháp:</strong> <code style={{ background: '#E2E8F0', padding: '2px 8px', borderRadius: '4px', fontSize: '0.875rem' }}>
            [Mã đơn hàng] [Họ tên] [SĐT]
          </code>
          <br />
          <strong>Ví dụ:</strong> NTX20260425001 Nguyen Van A 0901234567
        </p>
      </div>

      <h3>Các bước thực hiện</h3>
      <ol>
        <li>Chọn phương thức <strong>&ldquo;Chuyển khoản ngân hàng&rdquo;</strong> khi thanh toán</li>
        <li>Đặt hàng thành công – hệ thống sẽ gửi <strong>mã đơn hàng</strong> qua email/SMS</li>
        <li>Mở app ngân hàng hoặc Internet Banking</li>
        <li>Chuyển khoản theo thông tin ở trên với <strong>đúng nội dung chuyển khoản</strong></li>
        <li>Chụp ảnh biên lai và gửi qua Zalo/Email cho CSKH (nếu muốn xác nhận nhanh)</li>
        <li>Bộ phận kế toán xác nhận trong vòng <strong>1–4 giờ</strong> (giờ hành chính)</li>
        <li>Đơn hàng được chuyển sang trạng thái &ldquo;Đã xác nhận&rdquo; và bắt đầu xử lý giao hàng</li>
      </ol>

      <div className="highlight-box">
        <p>
          <strong>⏰ Lưu ý:</strong> Vui lòng chuyển khoản trong vòng <strong>24 giờ</strong> sau 
          khi đặt hàng. Đơn hàng chưa thanh toán sau 48 giờ sẽ tự động hủy.
        </p>
      </div>

      {/* Ví điện tử */}
      <h2 id="vi-dien-tu">Ví điện tử (MoMo / VNPay / ZaloPay)</h2>
      <p>
        Thanh toán tự động, nhanh chóng qua các ví điện tử phổ biến tại Việt Nam.
      </p>

      <h3>Các bước thực hiện</h3>
      <ol>
        <li>Chọn phương thức ví điện tử tương ứng (MoMo, VNPay, hoặc ZaloPay)</li>
        <li>Hệ thống sẽ chuyển hướng sang trang thanh toán của ví điện tử</li>
        <li>Đăng nhập tài khoản ví và <strong>xác nhận thanh toán</strong></li>
        <li>Sau khi thanh toán thành công, bạn sẽ được chuyển về trang xác nhận đơn hàng</li>
        <li>Đơn hàng được <strong>xác nhận tự động</strong> và bắt đầu xử lý giao hàng</li>
      </ol>

      <p>
        <strong>Ưu điểm:</strong> Xác nhận tức thì, không cần chờ đợi. Thường xuyên có 
        chương trình cashback và khuyến mãi từ các ví điện tử.
      </p>

      {/* Trả góp */}
      <h2 id="tra-gop">Trả góp 0% qua thẻ tín dụng</h2>
      <p>
        Nội Thất Xinh hợp tác cùng các ngân hàng lớn để cung cấp chương trình 
        <strong> trả góp 0% lãi suất</strong> cho các đơn hàng từ <strong>5.000.000₫</strong> trở lên.
      </p>

      <h3>Ngân hàng hỗ trợ</h3>
      <ul>
        <li>Vietcombank – Kỳ hạn: 3, 6, 12 tháng</li>
        <li>Techcombank – Kỳ hạn: 3, 6, 9, 12 tháng</li>
        <li>VPBank – Kỳ hạn: 3, 6, 12 tháng</li>
        <li>Sacombank – Kỳ hạn: 3, 6, 12 tháng</li>
        <li>ACB – Kỳ hạn: 3, 6 tháng</li>
      </ul>

      <h3>Điều kiện</h3>
      <ul>
        <li>Giá trị đơn hàng từ <strong>5.000.000₫</strong> trở lên</li>
        <li>Sử dụng thẻ tín dụng quốc tế (Visa, Mastercard, JCB) của các ngân hàng hỗ trợ</li>
        <li>Chủ thẻ phải là người đặt hàng hoặc người thân trực hệ</li>
      </ul>

      <div className="info-box">
        <p>
          <strong>ℹ️ Ví dụ:</strong> Đơn hàng 12.000.000₫ trả góp 12 tháng = mỗi tháng chỉ 
          <strong> 1.000.000₫</strong>, không phát sinh lãi suất hay phí ẩn.
        </p>
      </div>

      {/* Hóa đơn VAT */}
      <h2 id="hoa-don">Xuất hóa đơn VAT</h2>
      <p>
        Nội Thất Xinh hỗ trợ xuất hóa đơn giá trị gia tăng (VAT) cho tất cả đơn hàng. 
        Quý khách vui lòng cung cấp thông tin xuất hóa đơn <strong>trước hoặc tại thời điểm nhận hàng</strong>:
      </p>
      <ul>
        <li>Tên công ty / Tên cá nhân</li>
        <li>Mã số thuế</li>
        <li>Địa chỉ công ty</li>
        <li>Email nhận hóa đơn điện tử</li>
      </ul>
      <p>
        Hóa đơn điện tử sẽ được gửi qua email trong vòng <strong>3 ngày làm việc</strong> sau 
        khi giao hàng thành công.
      </p>

      {/* Lưu ý */}
      <h2 id="luu-y">Lưu ý chung</h2>
      <ul>
        <li>
          Tất cả các phương thức thanh toán đều <strong>không phát sinh phí</strong> cho khách hàng
        </li>
        <li>
          Trường hợp hủy đơn hàng đã thanh toán, tiền sẽ được hoàn trong vòng 
          <strong> 7–14 ngày làm việc</strong>
        </li>
        <li>
          Mọi giao dịch thanh toán đều được bảo mật bằng <strong>SSL 256-bit</strong>
        </li>
        <li>
          Nếu gặp vấn đề trong quá trình thanh toán, vui lòng liên hệ Hotline 
          <strong> 1900 0129</strong> để được hỗ trợ
        </li>
        <li>
          Nội Thất Xinh <strong>không chấp nhận thanh toán bằng tiền mã hóa</strong> (cryptocurrency)
        </li>
      </ul>
    </PolicyLayout>
  );
};

export default PaymentGuidePage;
