# 🧪 Testing — Smart Restaurant

Thư mục chứa bộ kiểm thử bổ sung bằng **Postman** (API Functional Testing) và **JMeter** (Performance Testing).

---

## 📂 Cấu trúc thư mục

```
testing/
├── postman/
│   ├── Smart_Restaurant_API.postman_collection.json   ← Import vào Postman
│   └── Smart_Restaurant_Local.postman_environment.json ← Biến môi trường
├── jmeter/
│   └── Smart_Restaurant_Performance.jmx               ← Mở bằng JMeter
└── README.md
```

---

## 📮 Postman — Kiểm thử chức năng API

### Yêu cầu
- [Postman Desktop](https://www.postman.com/downloads/) hoặc Postman Web

### Cách sử dụng

1. **Import Collection:**
   - Mở Postman → `File` → `Import` → Kéo thả file `Smart_Restaurant_API.postman_collection.json`

2. **Import Environment:**
   - `File` → `Import` → Kéo thả file `Smart_Restaurant_Local.postman_environment.json`
   - Chọn Environment `Smart Restaurant — Local` ở góc trên phải

3. **Chạy Backend trước:**
   ```bash
   cd backend
   npm run dev
   ```

4. **Chạy test:**
   - **Chạy từng request:** Click vào request → `Send`
   - **Chạy toàn bộ collection:** Click vào tên Collection → `Run` → `Run Smart Restaurant`
   - Sau khi chạy Login (Admin), token sẽ **tự động lưu** vào biến `{{admin_token}}`

### Nội dung Collection

| Nhóm | Số request | Số assertions | Mô tả |
|------|:----------:|:-------------:|-------|
| 🔐 Authentication | 13 | 27 | Register, Login (Admin/Staff/Chef/Invalid), Refresh, Forgot/Reset Password |
| 👑 Admin | 13 | 21 | CRUD Users, Menu Categories, Menu Items, Tables, Dashboard, Orders, Reviews, Phân quyền RBAC |
| 👷 Staff | 9 | 10 | Tables, Menu, Pending Orders/Items, Serving Items, Service Requests, Create/Approve Order |
| 🍳 Chef | 4 | 4 | Kitchen Board (KDS), Kitchen Stats, Kitchen History, Toggle Availability |
| 💰 Cashier | 5 | 5 | Tables, Orders, Checkout, Reservations, Service Requests |
| 🌐 Public | 13 | 17 | Menu (list/grouped/detail/search/404), Create Order (valid/invalid BVA), Session Status |

**Tổng cộng: 57 requests (84 assertions tự động)** kiểm tra status code, response body schema, và response time.

### Kỹ thuật kiểm thử áp dụng
- **Equivalence Partitioning:** Test valid/invalid inputs cho Register, Login, Create Order
- **Boundary Value Analysis:** Quantity = 0, Items rỗng
- **Phân quyền:** Test truy cập Admin API với token Staff (expect 403), không token (expect 401)

---

## ⚡ JMeter — Kiểm thử hiệu năng

### Yêu cầu
- [Apache JMeter 5.6+](https://jmeter.apache.org/download_jmeter.cgi) (cần Java 8+)

### Cách sử dụng

1. **Mở JMeter:**
   ```bash
   # Windows
   jmeter.bat

   # Linux/Mac
   ./jmeter.sh
   ```

2. **Import Test Plan:**
   - `File` → `Open` → Chọn file `Smart_Restaurant_Performance.jmx`

3. **Chạy Backend:**
   ```bash
   cd backend
   npm run dev
   ```

4. **Chạy test:**
   - Click nút ▶️ (Start) trên toolbar
   - Xem kết quả trong các Listener:
     - **View Results Tree:** Chi tiết từng request
     - **Summary Report:** Tổng hợp thống kê
     - **Aggregate Report:** Thống kê theo endpoint
     - **Response Time Graph:** Biểu đồ thời gian phản hồi

### 4 Kịch bản kiểm thử

| # | Kịch bản | Users | Ramp-up | Duration | Mục đích | Mặc định |
|---|----------|-------|---------|----------|----------|----------|
| 1 | **Smoke Test** | 1 | 1s | 1 lần | Xác minh API hoạt động bình thường | ✅ Enabled |
| 2 | **Load Test** | 50 | 10s | 60s | Kiểm tra khả năng chịu tải thông thường | ✅ Enabled |
| 3 | **Stress Test** | 200 | 30s | 120s | Tìm giới hạn chịu tải của hệ thống | ❌ Disabled |
| 4 | **Spike Test** | 100 | 5s | 30s | Kiểm tra phản ứng khi lượng truy cập đột biến | ❌ Disabled |

> ⚠️ **Lưu ý:** Stress Test và Spike Test mặc định **tắt** (disabled) để tránh gây quá tải server. Bật từng kịch bản bằng cách right-click → `Enable`.

### Các API được kiểm thử hiệu năng

| API | Phương thức | Lý do chọn |
|-----|-------------|------------|
| `/api/auth/login` | POST | Endpoint xác thực — bottleneck do bcrypt hash |
| `/api/public/menu` | GET | API phổ biến nhất — mọi thực khách đều gọi |
| `/api/public/menu/grouped` | GET | Truy vấn phức tạp — JOIN nhiều bảng |
| `/api/admin/dashboard` | GET | Aggregate data — tính toán nhiều metrics |

### Chỉ số đánh giá (KPI)

| Chỉ số | Mục tiêu Smoke | Mục tiêu Load | Mục tiêu Stress |
|--------|----------------|---------------|-----------------|
| **Response Time (Avg)** | < 500ms | < 2000ms | < 5000ms |
| **Error Rate** | 0% | < 1% | < 5% |
| **Throughput** | N/A | > 50 req/s | > 100 req/s |

### Chạy JMeter từ Command Line (không cần GUI)

```powershell
# Lệnh 1 dòng tự động xóa kết quả cũ và xuất báo cáo HTML
Remove-Item "testing/jmeter/results.jtl","testing/jmeter/report" -Recurse -Force -ErrorAction SilentlyContinue; & "C:\Users\ducta\Downloads\apache-jmeter-5.6.3\bin\jmeter.bat" -n -t "testing/jmeter/Smart_Restaurant_Performance.jmx" -l "testing/jmeter/results.jtl" -e -o "testing/jmeter/report"

# Mở báo cáo Dashboard HTML
Start-Process "testing/jmeter/report/index.html"
```

---

## 📊 Tổng hợp bộ kiểm thử toàn hệ thống

| Công cụ | Loại kiểm thử | Số lượng | Tầng Testing Pyramid |
|---------|---------------|----------|---------------------|
| **Vitest** | Unit Test (Backend) | 61 tests | Đáy — Đơn vị |
| **Vitest** | Component & Hook Test (Frontend) | 37 tests | Giữa — Component |
| **Postman** | API Functional Test | 57 requests (84 assertions) | Giữa — Integration |
| **JMeter** | Performance / Load Test | 4 kịch bản (2,615 samples) | Đỉnh — System |
| **GitHub Actions** | CI/CD Automation | 2 jobs | Tự động hóa |
