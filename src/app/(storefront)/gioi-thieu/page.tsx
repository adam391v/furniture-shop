// ============================================================
// Trang Giới thiệu - /gioi-thieu
// Nội dung tĩnh về thương hiệu Nội Thất Xinh
// ============================================================

import PolicyLayout from '@/components/storefront/PolicyLayout';

export const metadata = {
  title: 'Giới thiệu | Nội Thất Xinh',
  description:
    'Nội Thất Xinh - Thương hiệu nội thất hiện đại, tối giản, chất lượng quốc tế với giá Việt Nam. Tìm hiểu câu chuyện, sứ mệnh và giá trị cốt lõi của chúng tôi.',
};

const tableOfContents = [
  { id: 'cau-chuyen', label: 'Câu chuyện thương hiệu' },
  { id: 'su-menh', label: 'Sứ mệnh & Tầm nhìn' },
  { id: 'gia-tri', label: 'Giá trị cốt lõi' },
  { id: 'cam-ket', label: 'Cam kết của chúng tôi' },
  { id: 'he-thong', label: 'Hệ thống cửa hàng' },
];

const AboutPage = () => {
  return (
    <PolicyLayout
      title="Giới thiệu"
      description="Tìm hiểu về câu chuyện, sứ mệnh và giá trị cốt lõi của Nội Thất Xinh"
      breadcrumbLabel="Giới thiệu"
      tableOfContents={tableOfContents}
    >
      {/* Câu chuyện thương hiệu */}
      <h2 id="cau-chuyen">Câu chuyện thương hiệu</h2>
      <p>
        <strong>Nội Thất Xinh</strong> được thành lập với niềm đam mê mang đến những sản phẩm nội thất 
        chất lượng cao, thiết kế hiện đại và phù hợp với không gian sống của người Việt. Chúng tôi tin rằng 
        mỗi ngôi nhà đều xứng đáng được trang hoàng bằng những món đồ nội thất đẹp, bền và thoải mái.
      </p>
      <p>
        Xuất phát từ một xưởng sản xuất nhỏ tại TP. Hồ Chí Minh, qua nhiều năm nỗ lực không ngừng, 
        Nội Thất Xinh đã phát triển thành thương hiệu nội thất uy tín được hàng ngàn gia đình Việt tin tưởng 
        lựa chọn. Chúng tôi tự hào là đơn vị tiên phong trong việc ứng dụng công nghệ sản xuất hiện đại, 
        kết hợp với thiết kế tối giản mang đậm phong cách Bắc Âu – Nhật Bản.
      </p>

      <div className="highlight-box">
        <p>
          <strong>💡 Triết lý:</strong> &ldquo;Tạo ra những không gian sống đẹp, tiện nghi và bền vững 
          cho mọi gia đình Việt Nam, với mức giá hợp lý nhất.&rdquo;
        </p>
      </div>

      {/* Sứ mệnh & Tầm nhìn */}
      <h2 id="su-menh">Sứ mệnh & Tầm nhìn</h2>

      <h3>Sứ mệnh</h3>
      <p>
        Nội Thất Xinh cam kết mang đến cho khách hàng trải nghiệm mua sắm nội thất trọn vẹn nhất, 
        từ tư vấn thiết kế, sản xuất đến giao hàng và lắp đặt tận nhà. Chúng tôi không ngừng nghiên cứu 
        và phát triển để tạo ra những sản phẩm vượt trội về chất lượng, an toàn cho sức khỏe và thân thiện 
        với môi trường.
      </p>

      <h3>Tầm nhìn 2030</h3>
      <ul>
        <li>Trở thành thương hiệu nội thất hàng đầu Việt Nam về thiết kế và chất lượng</li>
        <li>Mở rộng hệ thống cửa hàng trải nghiệm tại các thành phố lớn trên toàn quốc</li>
        <li>Phát triển nền tảng thương mại điện tử nội thất tiện lợi nhất cho người tiêu dùng</li>
        <li>Đưa sản phẩm nội thất Việt Nam ra thị trường quốc tế</li>
      </ul>

      {/* Giá trị cốt lõi */}
      <h2 id="gia-tri">Giá trị cốt lõi</h2>
      <p>
        Bốn giá trị cốt lõi định hình nên mọi hoạt động của Nội Thất Xinh:
      </p>

      <h3>🎨 Thiết kế tinh tế</h3>
      <p>
        Đội ngũ thiết kế của chúng tôi không ngừng cập nhật xu hướng nội thất toàn cầu, 
        kết hợp với đặc điểm không gian sống tại Việt Nam để tạo ra những sản phẩm vừa đẹp mắt, 
        vừa thực dụng. Mỗi sản phẩm đều trải qua quy trình thiết kế kỹ lưỡng, đảm bảo tính thẩm mỹ 
        và công năng sử dụng tối ưu.
      </p>

      <h3>🏗️ Chất lượng vượt trội</h3>
      <p>
        100% sản phẩm được sản xuất tại nhà máy đạt tiêu chuẩn ISO 9001:2015. Nguyên vật liệu 
        được nhập khẩu từ các nhà cung cấp uy tín: gỗ tự nhiên FSC, ván MDF đạt chuẩn E1 an toàn 
        cho sức khỏe, vải bọc chống bám bụi, kháng khuẩn.
      </p>

      <h3>💚 Bền vững & Xanh</h3>
      <p>
        Chúng tôi cam kết sử dụng các nguyên liệu thân thiện với môi trường và quy trình sản xuất 
        tiết kiệm năng lượng. Gỗ sử dụng trong sản phẩm đều có chứng nhận nguồn gốc hợp pháp, 
        đảm bảo không phá rừng tự nhiên.
      </p>

      <h3>🤝 Khách hàng là trọng tâm</h3>
      <p>
        Từ khâu tư vấn, đặt hàng, giao nhận đến hậu mãi – Nội Thất Xinh luôn đặt trải nghiệm 
        khách hàng lên hàng đầu. Đội ngũ chăm sóc khách hàng chuyên nghiệp, nhiệt tình sẵn sàng 
        hỗ trợ bạn 7 ngày trong tuần.
      </p>

      {/* Cam kết */}
      <h2 id="cam-ket">Cam kết của chúng tôi</h2>
      <ul>
        <li><strong>Bảo hành lên đến 5 năm</strong> cho tất cả sản phẩm nội thất</li>
        <li><strong>Miễn phí giao hàng và lắp đặt</strong> tại TP.HCM, Hà Nội và các tỉnh lân cận</li>
        <li><strong>Đổi trả trong 14 ngày</strong> nếu sản phẩm không đúng mô tả hoặc bị lỗi do nhà sản xuất</li>
        <li><strong>Tư vấn thiết kế miễn phí</strong> với đội ngũ kiến trúc sư nội thất chuyên nghiệp</li>
        <li><strong>Bảo trì trọn đời</strong> với chi phí hợp lý cho tất cả sản phẩm đã mua</li>
      </ul>

      <div className="info-box">
        <p>
          <strong>ℹ️ Cam kết chất lượng:</strong> Tất cả sản phẩm của Nội Thất Xinh đều sử dụng 
          vật liệu đạt tiêu chuẩn E1 châu Âu, an toàn tuyệt đối cho sức khỏe người sử dụng, 
          kể cả trẻ nhỏ và phụ nữ mang thai.
        </p>
      </div>

      {/* Hệ thống cửa hàng */}
      <h2 id="he-thong">Hệ thống cửa hàng</h2>
      <p>
        Hiện tại, Nội Thất Xinh có hệ thống showroom trải nghiệm tại các thành phố lớn:
      </p>

      <table>
        <thead>
          <tr>
            <th>Khu vực</th>
            <th>Địa chỉ</th>
            <th>Hotline</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>TP. Hồ Chí Minh</strong></td>
            <td>162 Nguyễn Văn Trỗi, Phường 8, Quận Phú Nhuận</td>
            <td>028 7300 6886</td>
          </tr>
          <tr>
            <td><strong>Hà Nội</strong></td>
            <td>39 Trần Duy Hưng, Quận Cầu Giấy</td>
            <td>024 7300 6886</td>
          </tr>
          <tr>
            <td><strong>Đà Nẵng</strong></td>
            <td>258 Nguyễn Văn Linh, Quận Hải Châu</td>
            <td>023 6300 6886</td>
          </tr>
        </tbody>
      </table>

      <p>
        Quý khách có thể ghé thăm showroom để trực tiếp trải nghiệm sản phẩm hoặc mua sắm 
        trực tuyến tại website với dịch vụ giao hàng toàn quốc.
      </p>
    </PolicyLayout>
  );
};

export default AboutPage;
