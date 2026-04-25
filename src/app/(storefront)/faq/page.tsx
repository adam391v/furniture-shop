// ============================================================
// Trang FAQ - /faq
// Câu hỏi thường gặp với giao diện Accordion
// ============================================================

'use client';

import PolicyLayout from '@/components/storefront/PolicyLayout';
import Accordion from '@/components/ui/Accordion';

const faqSections = [
  {
    title: '🛒 Đặt hàng & Mua sắm',
    items: [
      {
        question: 'Làm sao để đặt hàng trên website Nội Thất Xinh?',
        answer: (
          <div>
            <p>Bạn chỉ cần thực hiện 5 bước đơn giản:</p>
            <ol className="list-decimal pl-5 mt-2 space-y-1">
              <li>Tìm và chọn sản phẩm yêu thích</li>
              <li>Chọn màu sắc/kích thước và nhấn &ldquo;Thêm vào giỏ hàng&rdquo;</li>
              <li>Kiểm tra giỏ hàng, nhập mã giảm giá (nếu có)</li>
              <li>Điền thông tin giao hàng và chọn phương thức thanh toán</li>
              <li>Nhấn &ldquo;Đặt hàng&rdquo; và chờ nhận hàng</li>
            </ol>
            <p className="mt-2">
              Xem chi tiết tại trang{' '}
              <a href="/huong-dan-mua-hang" className="text-primary hover:underline font-medium">
                Hướng dẫn mua hàng
              </a>.
            </p>
          </div>
        ),
      },
      {
        question: 'Tôi có thể đặt hàng mà không cần đăng ký tài khoản không?',
        answer: (
          <p>
            Có, bạn hoàn toàn có thể đặt hàng với tư cách khách (Guest Checkout) mà không cần đăng ký. 
            Tuy nhiên, chúng tôi khuyến khích bạn tạo tài khoản để theo dõi đơn hàng, 
            nhận ưu đãi thành viên và lưu thông tin giao hàng cho lần mua sau.
          </p>
        ),
      },
      {
        question: 'Tôi muốn thay đổi hoặc hủy đơn hàng thì phải làm sao?',
        answer: (
          <div>
            <p>
              Bạn có thể thay đổi hoặc hủy đơn hàng <strong>trước khi đơn được xác nhận</strong> bằng cách:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Gọi Hotline: <strong>1900 0129</strong></li>
              <li>Gửi email: cskh@noithatxinh.vn kèm mã đơn hàng</li>
              <li>Nhắn tin qua Zalo / Live Chat trên website</li>
            </ul>
            <p className="mt-2">
              Sau khi đơn hàng đã được xác nhận và chuẩn bị giao, việc hủy đơn sẽ phát sinh phí 
              theo chính sách đổi trả.
            </p>
          </div>
        ),
      },
      {
        question: 'Website có chương trình khuyến mãi thường xuyên không?',
        answer: (
          <p>
            Có! Nội Thất Xinh thường xuyên có các chương trình khuyến mãi hấp dẫn vào các dịp lễ, 
            Tết và ngày đặc biệt (Black Friday, 11.11, 12.12...). Để không bỏ lỡ, hãy đăng ký nhận 
            bản tin qua email hoặc theo dõi Fanpage Facebook của chúng tôi.
          </p>
        ),
      },
    ],
  },
  {
    title: '🚚 Giao hàng & Lắp đặt',
    items: [
      {
        question: 'Nội Thất Xinh có giao hàng toàn quốc không?',
        answer: (
          <p>
            Có, chúng tôi giao hàng toàn quốc. Riêng tại TP.HCM, Hà Nội và một số tỉnh lân cận 
            (Bình Dương, Đồng Nai, Long An), chúng tôi <strong>miễn phí giao hàng và lắp đặt</strong>. 
            Các khu vực khác sẽ tính phí theo khoảng cách.
          </p>
        ),
      },
      {
        question: 'Thời gian giao hàng mất bao lâu?',
        answer: (
          <div>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Nội thành TP.HCM, Hà Nội:</strong> 1–3 ngày làm việc (hàng có sẵn)</li>
              <li><strong>Bình Dương, Đồng Nai, Long An:</strong> 2–4 ngày làm việc</li>
              <li><strong>Các tỉnh khác:</strong> 5–7 ngày làm việc</li>
              <li><strong>Sản phẩm đặt trước:</strong> 7–25 ngày tùy khu vực</li>
            </ul>
            <p className="mt-2">
              Nhân viên giao hàng sẽ liên hệ trước ít nhất 24 giờ để hẹn lịch.
            </p>
          </div>
        ),
      },
      {
        question: 'Sản phẩm có được lắp đặt tận nhà không?',
        answer: (
          <p>
            Có, đội ngũ kỹ thuật viên sẽ trực tiếp lắp đặt và hướng dẫn sử dụng tại nhà bạn, 
            <strong> hoàn toàn miễn phí</strong> (trong khu vực miễn phí giao hàng). 
            Chúng tôi chỉ lắp đặt theo tiêu chuẩn sản phẩm, không hỗ trợ khoan tường 
            hoặc gắn sản phẩm lên tường.
          </p>
        ),
      },
      {
        question: 'Tôi có thể đổi lịch giao hàng không?',
        answer: (
          <p>
            Có, bạn có thể đổi lịch giao hàng bằng cách liên hệ CSKH trước ít nhất <strong>24 giờ</strong>. 
            Lưu ý: nếu dời lịch quá 2 lần, Nội Thất Xinh có quyền hủy đơn hàng.
          </p>
        ),
      },
    ],
  },
  {
    title: '💳 Thanh toán',
    items: [
      {
        question: 'Nội Thất Xinh hỗ trợ những phương thức thanh toán nào?',
        answer: (
          <div>
            <p>Chúng tôi hỗ trợ 4 phương thức thanh toán:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>COD:</strong> Thanh toán tiền mặt khi nhận hàng</li>
              <li><strong>Chuyển khoản ngân hàng:</strong> Chuyển khoản trước qua Vietcombank</li>
              <li><strong>Ví điện tử:</strong> MoMo, VNPay, ZaloPay</li>
              <li><strong>Trả góp 0%:</strong> Qua thẻ tín dụng Visa/Mastercard/JCB</li>
            </ul>
            <p className="mt-2">
              Chi tiết tại{' '}
              <a href="/huong-dan-thanh-toan" className="text-primary hover:underline font-medium">
                Hướng dẫn thanh toán
              </a>.
            </p>
          </div>
        ),
      },
      {
        question: 'Thanh toán qua website có an toàn không?',
        answer: (
          <p>
            Hoàn toàn an toàn! Nội Thất Xinh sử dụng mã hóa <strong>SSL 256-bit</strong> cho 
            toàn bộ giao dịch. Chúng tôi không lưu trữ thông tin thẻ ngân hàng của bạn. 
            Các cổng thanh toán (VNPay, MoMo) đều đạt tiêu chuẩn bảo mật quốc tế PCI DSS.
          </p>
        ),
      },
      {
        question: 'Tôi có thể trả góp 0% lãi suất không?',
        answer: (
          <p>
            Có, với đơn hàng từ <strong>5.000.000₫</strong> trở lên, bạn có thể trả góp 0% lãi suất 
            qua thẻ tín dụng của các ngân hàng: Vietcombank, Techcombank, VPBank, Sacombank, ACB. 
            Kỳ hạn từ 3 đến 12 tháng tùy ngân hàng.
          </p>
        ),
      },
    ],
  },
  {
    title: '🔄 Đổi trả & Bảo hành',
    items: [
      {
        question: 'Tôi có thể đổi trả sản phẩm không?',
        answer: (
          <div>
            <p>Có, Nội Thất Xinh áp dụng chương trình:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>14 ngày đổi hàng:</strong> Đổi sang sản phẩm khác (sản phẩm còn nguyên vẹn)</li>
              <li><strong>3 ngày trả hàng:</strong> Trả hàng do thay đổi ý kiến (chịu phí vận chuyển 300.000₫)</li>
              <li><strong>Đổi miễn phí:</strong> Nếu sản phẩm bị lỗi do nhà sản xuất</li>
            </ul>
            <p className="mt-2">
              Chi tiết tại{' '}
              <a href="/chinh-sach-doi-tra" className="text-primary hover:underline font-medium">
                Chính sách đổi trả
              </a>.
            </p>
          </div>
        ),
      },
      {
        question: 'Thời hạn bảo hành sản phẩm là bao lâu?',
        answer: (
          <div>
            <p>Thời hạn bảo hành tùy theo danh mục sản phẩm:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Sofa, Giường, Tủ:</strong> Bảo hành 5 năm</li>
              <li><strong>Bàn, Ghế, Kệ:</strong> Bảo hành 3 năm</li>
              <li><strong>Nệm, Gối:</strong> Bảo hành 2 năm</li>
              <li><strong>Phụ kiện, Trang trí:</strong> Bảo hành 6 tháng</li>
            </ul>
            <p className="mt-2">
              Sau bảo hành, chúng tôi hỗ trợ <strong>bảo trì trọn đời</strong> với chi phí hợp lý.
            </p>
          </div>
        ),
      },
      {
        question: 'Quy trình yêu cầu bảo hành như thế nào?',
        answer: (
          <ol className="list-decimal pl-5 space-y-1">
            <li>Liên hệ Hotline <strong>1900 0129</strong> hoặc email baohanh@noithatxinh.vn</li>
            <li>Cung cấp mã đơn hàng và hình ảnh/video sản phẩm bị lỗi</li>
            <li>Bộ phận kỹ thuật xác nhận trong 24–48 giờ</li>
            <li>Nhân viên kỹ thuật đến sửa chữa tại nhà (3–5 ngày làm việc)</li>
            <li>Ký xác nhận hoàn tất bảo hành</li>
          </ol>
        ),
      },
    ],
  },
  {
    title: '👤 Tài khoản & Thông tin',
    items: [
      {
        question: 'Làm sao để đăng ký tài khoản?',
        answer: (
          <p>
            Nhấp vào biểu tượng <strong>Tài khoản</strong> ở góc phải trên cùng, chọn 
            &ldquo;Đăng ký&rdquo;. Điền họ tên, email, mật khẩu và thông tin cá nhân. 
            Tài khoản sẽ được kích hoạt ngay lập tức sau khi đăng ký.
          </p>
        ),
      },
      {
        question: 'Tôi quên mật khẩu thì phải làm sao?',
        answer: (
          <p>
            Tại trang Đăng nhập, nhấp vào <strong>&ldquo;Quên mật khẩu?&rdquo;</strong>. 
            Nhập email đã đăng ký, chúng tôi sẽ gửi link đặt lại mật khẩu qua email. 
            Link có hiệu lực trong 24 giờ. Nếu không nhận được email, 
            hãy kiểm tra hộp thư Spam hoặc liên hệ CSKH.
          </p>
        ),
      },
      {
        question: 'Thông tin cá nhân của tôi có được bảo mật không?',
        answer: (
          <p>
            Tuyệt đối! Nội Thất Xinh cam kết bảo mật thông tin khách hàng theo tiêu chuẩn cao nhất. 
            Chúng tôi sử dụng mã hóa SSL, không chia sẻ dữ liệu cho bên thứ ba vì mục đích thương mại. 
            Chi tiết tại{' '}
            <a href="/chinh-sach-bao-mat" className="text-primary hover:underline font-medium">
              Chính sách bảo mật
            </a>.
          </p>
        ),
      },
      {
        question: 'Làm sao để liên hệ với Nội Thất Xinh?',
        answer: (
          <div>
            <p>Bạn có thể liên hệ qua:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Hotline:</strong> 1900 0129 (8h–21h mỗi ngày)</li>
              <li><strong>Email:</strong> cskh@noithatxinh.vn</li>
              <li><strong>Zalo:</strong> 090 123 4567</li>
              <li><strong>Live Chat:</strong> Nhấp vào biểu tượng chat ở góc phải dưới cùng website</li>
              <li><strong>Showroom:</strong> Ghé thăm trực tiếp tại TP.HCM, Hà Nội hoặc Đà Nẵng</li>
            </ul>
          </div>
        ),
      },
    ],
  },
];

const FAQPage = () => {
  return (
    <PolicyLayout
      title="Câu hỏi thường gặp"
      description="Tìm câu trả lời nhanh cho các thắc mắc phổ biến về mua sắm tại Nội Thất Xinh"
      breadcrumbLabel="FAQ"
    >
      <p className="mb-6">
        Dưới đây là danh sách các câu hỏi thường gặp nhất từ khách hàng. Nếu bạn không tìm thấy 
        câu trả lời cho thắc mắc của mình, đừng ngần ngại liên hệ với chúng tôi qua Hotline 
        <strong> 1900 0129</strong>.
      </p>

      {/* Render từng nhóm FAQ */}
      {faqSections.map((section, index) => (
        <div key={index} className="mb-8 last:mb-0">
          <h2 id={`faq-section-${index}`} className="!border-none !pb-0 !mb-4">
            {section.title}
          </h2>
          <Accordion items={section.items} allowMultiple />
        </div>
      ))}

      {/* CTA cuối trang */}
      <div className="mt-10 text-center bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-8 border border-primary/20">
        <h3 className="text-lg font-bold text-navy mb-2">
          Vẫn chưa tìm được câu trả lời?
        </h3>
        <p className="text-sm text-text-secondary mb-4">
          Đội ngũ CSKH của chúng tôi luôn sẵn sàng hỗ trợ bạn từ 8h – 21h mỗi ngày.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="tel:19000129"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors"
          >
            📞 Gọi 1900 0129
          </a>
          <a
            href="mailto:cskh@noithatxinh.vn"
            className="inline-flex items-center gap-2 bg-white text-navy border border-border px-6 py-3 rounded-lg text-sm font-semibold hover:bg-bg-secondary transition-colors"
          >
            ✉️ Gửi email CSKH
          </a>
        </div>
      </div>
    </PolicyLayout>
  );
};

export default FAQPage;
