// ============================================================
// Trang Chính sách bảo hành - /chinh-sach-bao-hanh
// Nội dung tĩnh tham khảo từ MOHO
// ============================================================

import PolicyLayout from '@/components/storefront/PolicyLayout';

export const metadata = {
  title: 'Chính sách bảo hành | Nội Thất Xinh',
  description:
    'Chính sách bảo hành sản phẩm nội thất lên đến 5 năm. Bảo trì trọn đời với chi phí hợp lý tại Nội Thất Xinh.',
};

const tableOfContents = [
  { id: 'thoi-han', label: 'Thời hạn bảo hành' },
  { id: 'pham-vi', label: 'Phạm vi bảo hành' },
  { id: 'khong-bao-hanh', label: 'Không bảo hành' },
  { id: 'bao-tri', label: 'Bảo trì trọn đời' },
  { id: 'quy-trinh', label: 'Quy trình bảo hành' },
  { id: 'huong-dan', label: 'Hướng dẫn bảo quản' },
];

const WarrantyPolicyPage = () => {
  return (
    <PolicyLayout
      title="Chính sách bảo hành"
      description="Bảo hành lên đến 5 năm – Bảo trì trọn đời với chi phí hợp lý"
      breadcrumbLabel="Chính sách bảo hành"
      tableOfContents={tableOfContents}
    >
      <h2 id="thoi-han">Thời hạn bảo hành</h2>
      <p>
        <strong>Nội Thất Xinh</strong> áp dụng chế độ bảo hành chính hãng cho tất cả sản phẩm, 
        tính từ ngày giao hàng thành công:
      </p>

      <table>
        <thead>
          <tr>
            <th>Danh mục sản phẩm</th>
            <th>Thời hạn bảo hành</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Sofa (khung gỗ & nệm)</strong></td>
            <td>5 năm</td>
          </tr>
          <tr>
            <td><strong>Giường ngủ</strong></td>
            <td>5 năm</td>
          </tr>
          <tr>
            <td><strong>Tủ quần áo, tủ kệ</strong></td>
            <td>5 năm</td>
          </tr>
          <tr>
            <td><strong>Bàn ăn, bàn làm việc</strong></td>
            <td>3 năm</td>
          </tr>
          <tr>
            <td><strong>Ghế ăn, ghế văn phòng</strong></td>
            <td>3 năm</td>
          </tr>
          <tr>
            <td><strong>Kệ sách, kệ tivi</strong></td>
            <td>3 năm</td>
          </tr>
          <tr>
            <td><strong>Đồ trang trí, phụ kiện</strong></td>
            <td>6 tháng</td>
          </tr>
          <tr>
            <td><strong>Nệm, gối</strong></td>
            <td>2 năm</td>
          </tr>
        </tbody>
      </table>

      <div className="highlight-box">
        <p>
          <strong>📋 Lưu ý:</strong> Thời hạn bảo hành được tính từ ngày giao hàng thành công, 
          ghi nhận trên hệ thống đơn hàng. Quý khách vui lòng giữ lại hóa đơn hoặc mã đơn hàng 
          để tra cứu bảo hành.
        </p>
      </div>

      <h2 id="pham-vi">Phạm vi bảo hành</h2>
      <p>
        Nội Thất Xinh bảo hành <strong>miễn phí</strong> cho các trường hợp sau:
      </p>
      <ul>
        <li>
          <strong>Lỗi chất liệu:</strong> Gỗ bị cong vênh, nứt tách do lỗi nguyên liệu; 
          vải bọc bị phai màu, bong tróc trong điều kiện sử dụng bình thường
        </li>
        <li>
          <strong>Lỗi kỹ thuật:</strong> Các khớp nối, bản lề, ray trượt bị lỏng, hỏng 
          khi sử dụng đúng cách
        </li>
        <li>
          <strong>Lỗi lắp đặt:</strong> Sản phẩm được lắp đặt bởi nhân viên Nội Thất Xinh 
          bị lỗi kết cấu do lắp đặt không đúng kỹ thuật
        </li>
        <li>
          <strong>Lỗi sơn/phủ:</strong> Bề mặt sơn, phủ PU, phủ melamine bị bong tróc, 
          ố vàng do lỗi sản xuất
        </li>
      </ul>

      <h3>Hình thức bảo hành</h3>
      <ul>
        <li><strong>Sửa chữa tại nhà:</strong> Đội ngũ kỹ thuật đến tận nơi sửa chữa (khu vực TP.HCM, Hà Nội)</li>
        <li><strong>Thay thế linh kiện:</strong> Thay thế miễn phí các phụ kiện, linh kiện bị lỗi</li>
        <li><strong>Đổi sản phẩm mới:</strong> Trong trường hợp không thể sửa chữa, đổi sản phẩm tương đương</li>
      </ul>

      <h2 id="khong-bao-hanh">Các trường hợp không bảo hành</h2>
      <p>
        Nội Thất Xinh <strong>không áp dụng bảo hành miễn phí</strong> trong các trường hợp sau:
      </p>
      <ul>
        <li>Thiệt hại do thiên tai, hỏa hoạn, ngập nước hoặc các sự kiện bất khả kháng</li>
        <li>Khách hàng tự vận chuyển, tự lắp đặt hoặc tự sửa chữa sản phẩm</li>
        <li>Tự ý thay đổi kết cấu, tháo rời hoặc sơn lại sản phẩm</li>
        <li>Sử dụng không đúng công năng (để vật nặng quá tải trọng cho phép)</li>
        <li>Để vật nóng trực tiếp lên bề mặt sản phẩm gây cháy, ố</li>
        <li>Sử dụng hóa chất tẩy rửa mạnh (axit, kiềm, cồn công nghiệp)</li>
        <li>Hư hỏng do côn trùng (mối, mọt) trong môi trường ẩm ướt</li>
        <li>Trầy xước, biến dạng do va đập hoặc tác động ngoại lực mạnh</li>
        <li>Hao mòn tự nhiên theo thời gian sử dụng</li>
        <li>Sản phẩm thuộc chương trình thanh lý, giảm giá sâu không còn bán trên website</li>
      </ul>

      <div className="info-box">
        <p>
          <strong>ℹ️ Lưu ý:</strong> Đối với các trường hợp không thuộc phạm vi bảo hành miễn phí, 
          Nội Thất Xinh vẫn hỗ trợ sửa chữa với <strong>chi phí ưu đãi</strong> dành cho khách hàng.
        </p>
      </div>

      <h2 id="bao-tri">Bảo trì trọn đời</h2>
      <p>
        Sau khi hết thời hạn bảo hành, Nội Thất Xinh tiếp tục hỗ trợ <strong>bảo trì trọn đời</strong> cho 
        tất cả sản phẩm đã mua với chi phí hợp lý:
      </p>
      <ul>
        <li><strong>Bọc lại vải/da sofa:</strong> Thay mới lớp bọc ngoài cho sofa, ghế</li>
        <li><strong>Sơn lại bề mặt:</strong> Phục hồi bề mặt gỗ bị trầy xước, ố màu</li>
        <li><strong>Thay thế phụ kiện:</strong> Bản lề, ray trượt, chân bàn ghế, tay nắm</li>
        <li><strong>Gia cố kết cấu:</strong> Siết lại ốc vít, gia cố khung gỗ bị lỏng</li>
        <li><strong>Vệ sinh chuyên sâu:</strong> Giặt sofa, đánh bóng bề mặt gỗ</li>
      </ul>
      <p>
        Chi phí bảo trì sẽ được báo giá cụ thể sau khi nhân viên kỹ thuật kiểm tra tình trạng 
        thực tế của sản phẩm.
      </p>

      <h2 id="quy-trinh">Quy trình bảo hành</h2>
      <ol>
        <li>
          <strong>Liên hệ CSKH:</strong> Gọi Hotline <strong>1900 0129</strong> hoặc gửi yêu cầu 
          qua email <strong>baohanh@noithatxinh.vn</strong>
        </li>
        <li>
          <strong>Cung cấp thông tin:</strong> Mã đơn hàng, mô tả lỗi, hình ảnh/video sản phẩm bị lỗi
        </li>
        <li>
          <strong>Xác nhận bảo hành:</strong> Bộ phận kỹ thuật xác nhận trong <strong>24 – 48 giờ</strong> làm việc
        </li>
        <li>
          <strong>Sắp lịch sửa chữa:</strong> Nhân viên kỹ thuật đến tận nhà theo lịch hẹn 
          (trong vòng 3 – 5 ngày làm việc)
        </li>
        <li>
          <strong>Hoàn tất:</strong> Ký xác nhận hoàn tất bảo hành. Sản phẩm tiếp tục được 
          bảo hành cho phần sửa chữa trong 3 tháng
        </li>
      </ol>

      <h2 id="huong-dan">Hướng dẫn bảo quản sản phẩm</h2>
      <p>
        Để sản phẩm luôn bền đẹp và kéo dài tuổi thọ, quý khách lưu ý:
      </p>

      <h3>Sản phẩm gỗ</h3>
      <ul>
        <li>Tránh đặt gần nguồn nhiệt, ánh nắng trực tiếp hoặc nơi ẩm ướt</li>
        <li>Lau chùi bằng khăn mềm, ẩm. Không dùng hóa chất tẩy rửa mạnh</li>
        <li>Không để vật nóng (chảo, nồi, ly nước nóng) trực tiếp lên bề mặt</li>
        <li>Sử dụng đế lót ly, lót bàn khi cần thiết</li>
      </ul>

      <h3>Sofa & ghế bọc vải/da</h3>
      <ul>
        <li>Hút bụi bề mặt vải định kỳ (1–2 lần/tuần)</li>
        <li>Tránh để vật nhọn, vật sắc cạnh tiếp xúc trực tiếp</li>
        <li>Xử lý ngay khi có vết bẩn bằng khăn ẩm, thấm nhẹ (không chà xát)</li>
        <li>Tránh ánh nắng trực tiếp để hạn chế phai màu vải/da</li>
        <li>Định kỳ xoay nệm ngồi để đều lực tựa</li>
      </ul>

      <h3>Nệm & Gối</h3>
      <ul>
        <li>Sử dụng tấm bảo vệ nệm để kéo dài tuổi thọ</li>
        <li>Xoay đầu nệm mỗi 3 tháng để đều độ lún</li>
        <li>Phơi nệm nơi thoáng mát (không phơi trực tiếp dưới nắng gắt)</li>
        <li>Không gập, cuộn nệm lò xo</li>
      </ul>
    </PolicyLayout>
  );
};

export default WarrantyPolicyPage;
