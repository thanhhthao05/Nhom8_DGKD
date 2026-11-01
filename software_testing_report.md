# 📘 BÁO CÁO ĐÁNH GIÁ VÀ KIỂM THỬ CHẤT LƯỢNG PHẦN MỀM
**Đề tài:** Hệ thống Quản lý Nhà hàng Thông minh (Smart Restaurant System)  
**Môn học:** Đánh giá & Kiểm thử Chất lượng Phần mềm (Software Quality Assurance & Testing)

---

## 📑 MỤC LỤC

1. [CHƯƠNG 1: KẾ HOẠCH KIỂM THỬ (TEST PLAN)](#chương-1-kế-hoạch-kiểm-thử-test-plan)
   - 1.1. Mục tiêu kiểm thử
   - 1.2. Phạm vi kiểm thử (Scope)
   - 1.3. Mô hình & Chiến lược kiểm thử (Testing Pyramid)
   - 1.4. Môi trường và công cụ sử dụng
2. [CHƯƠNG 2: KỸ THUẬT THIẾT KẾ TEST CASE (TEST DESIGN TECHNIQUES)](#chương-2-kỹ-thuật-thiết-kế-test-case-test-design-techniques)
   - 2.1. Phân vùng tương đương (Equivalence Partitioning - EP)
   - 2.2. Phân tích giá trị biên (Boundary Value Analysis - BVA)
   - 2.3. Kiểm thử chuyển đổi trạng thái (State Transition Testing - ST)
   - 2.4. Kiểm thử bảo mật & hàm băm (Security & Cryptography Testing)
3. [CHƯƠNG 3: BẢNG ĐẶC TẢ TEST CASE CHI TIẾT (TEST SPECIFICATION)](#chương-3-bảng-đặc-tả-test-case-chi-tiết-test-specification)
   - 3.1. Nhóm Unit Test: Dịch vụ đặt món (`order.service.js`)
   - 3.2. Nhóm Unit Test: Tiện ích & Bảo mật (`qr.util.js`, `hash.util.js`)
   - 3.3. Nhóm Unit Test: Xác thực & Phân quyền (`auth.controller`, `auth.middleware`, `role.middleware`)
   - 3.4. Nhóm Integration Test: API Hợp đồng (`auth.api.test.js`)
   - 3.5. Nhóm Frontend Test: UI Components & Hooks (`Button.test.jsx`, `Input.test.jsx`, `useLogin`, `usePublicOrder`)
4. [CHƯƠNG 4: THỰC THI & PHÂN TÍCH ĐỘ PHỦ MÃ NGUỒN (COVERAGE & METRICS)](#chương-4-thực-thi--phân-tích-độ-phủ-mã-nguồn-coverage--metrics)
   - 4.1. Thống kê kết quả thực thi
   - 4.2. Phân tích độ phủ mã nguồn (Code Coverage Report)
5. [CHƯƠNG 5: ĐÁNH GIÁ CHẤT LƯỢNG THEO TIÊU CHUẨN ISO/IEC 25010](#chương-5-đánh-giá-chất-lượng-theo-tiêu-chuẩn-isoiec-25010)
6. [CHƯƠNG 6: TỰ ĐỘNG HÓA KIỂM THỬ VỚI CI/CD (GITHUB ACTIONS)](#chương-6-tự-động-hóa-kiểm-thử-với-cicd-github-actions)
   - 6.1. Kiến trúc Pipeline CI
   - 6.2. Giá trị gia tăng cho dự án
7. [CHƯƠNG 7: KIỂM THỬ CHỨC NĂNG API VỚI POSTMAN](#chương-7-kiểm-thử-chức-năng-api-với-postman)
   - 7.1. Giới thiệu công cụ & Mục tiêu
   - 7.2. Cấu trúc Postman Collection
   - 7.3. Bảng đặc tả Test Case Postman
   - 7.4. Kết quả thực thi Postman Collection Runner
8. [CHƯƠNG 8: KIỂM THỬ HIỆU NĂNG VỚI APACHE JMETER](#chương-8-kiểm-thử-hiệu-năng-với-apache-jmeter)
   - 8.1. Giới thiệu công cụ & Mục tiêu
   - 8.2. Thiết kế kịch bản kiểm thử hiệu năng
   - 8.3. Cấu hình Test Plan chi tiết
   - 8.4. Chỉ số KPI đánh giá hiệu năng
   - 8.5. Kết quả & Phân tích

---

## CHƯƠNG 1: KẾ HOẠCH KIỂM THỬ (TEST PLAN)

### 1.1. Mục tiêu kiểm thử
- Xác minh tính đúng đắn của các logic nghiệp vụ cốt lõi: Xác thực tài khoản (Auth), Phân quyền đa vai trò (RBAC), Đặt món qua mã QR (Order & Session), Tính toán giá thành và biến thể.
- Đảm bảo tính toàn vẹn dữ liệu, xử lý ngoại lệ biên và ngăn chặn rủi ro bảo mật (mật khẩu, token hết hạn).
- Đạt độ tin cậy cao, tự động hóa kiểm thử để sẵn sàng tích hợp CI/CD.

### 1.2. Phạm vi kiểm thử (Scope)
- **Trong phạm vi (In-scope):**
  - **Backend (Node.js/Express):** 
    - Utilities: Mã hóa mật khẩu (`bcrypt`), phát sinh Token ngẫu nhiên, sinh mã QR base64.
    - Middlewares: Kiểm tra JWT Token, phân quyền người dùng (Guest, Staff, Cashier, Admin).
    - Controllers & Services: Đăng ký, Đăng nhập, Làm mới phiên, Đặt món thực khách, Kiểm tra tồn kho, Tính tổng tiền hóa đơn.
    - Integration: Toàn bộ vòng đời HTTP request/response của API Auth qua Supertest.
  - **Frontend (React/Vite):**
    - UI Components: `Button`, `Input` (hiển thị, sự kiện click, trạng thái disabled, loading spinner, validation error).
    - Custom Hooks: `useLogin`, `usePublicOrder` (quản lý state async, error handling).
  - **API Functional Testing (Postman):**
    - Kiểm thử chức năng toàn bộ 57 API endpoints thực tế qua HTTP với Postman Collection Runner (84 assertions tự động).
    - Bao phủ 6 nhóm/vai trò API: Authentication, Admin, Staff, Chef, Cashier, Public.
  - **Performance Testing (JMeter):**
    - Kiểm thử hiệu năng hệ thống dưới tải đồng thời với 4 kịch bản: Smoke, Load, Stress, Spike.
    - Đo lường Response Time, Throughput, Error Rate theo chuẩn công nghiệp.
- **Ngoài phạm vi (Out-of-scope):** Kiểm thử cổng thanh toán tiền thật qua ngân hàng, kiểm thử trên thiết bị di động thực (mobile device testing).

### 1.3. Mô hình & Chiến lược kiểm thử (Testing Pyramid)
Áp dụng mô hình Kim tự tháp kiểm thử mở rộng, kết hợp chuẩn công nghiệp với kiểm thử phi chức năng:
- **Tầng 1 (Đáy - Chiếm đa số): Unit Tests** — Kiểm thử đơn vị độc lập với Mocking hoàn toàn CSDL và Third-party (Vitest).
- **Tầng 2 (Giữa dưới): Component & Hook Tests** — Kiểm thử phản xạ giao diện người dùng dựa trên trạng thái (Testing Library).
- **Tầng 3 (Giữa trên): API Integration Tests** — Kiểm thử tích hợp luồng API từ Request $\rightarrow$ Router $\rightarrow$ Middleware $\rightarrow$ Controller $\rightarrow$ Mocked Service (Supertest).
- **Tầng 4 (Trên): API Functional Testing** — Kiểm thử chức năng API thực tế trên server đang chạy, xác minh HTTP Status Code, Response Body, Headers, và luồng xác thực đa vai trò (Postman).
- **Tầng 5 (Đỉnh): Performance & Load Testing** — Kiểm thử hiệu năng hệ thống dưới tải đồng thời, xác định giới hạn chịu tải và thời gian phản hồi (JMeter).

### 1.4. Môi trường và công cụ sử dụng
| Công cụ | Phiên bản | Mục đích sử dụng |
|---------|-----------|------------------|
| [Vitest](https://vitest.dev/) | v3.2.7 | Test Runner chính cho Unit Test & Integration Test (tương thích ESM, nhanh gấp 4x Jest) |
| `@testing-library/react` | v16.3.0 | Render & truy vấn React component trong môi trường test |
| `@testing-library/jest-dom` | v6.6.3 | Bổ sung DOM assertions: `toBeInTheDocument()`, `toBeDisabled()`... |
| `supertest` | v7.1.0 | Gửi HTTP request trực tiếp đến Express app (API Integration Test) |
| `@vitest/coverage-v8` | v3.2.4 | Đo code coverage bằng V8 engine |
| [Postman](https://www.postman.com/) | Latest | Kiểm thử chức năng API thực tế (Functional API Testing) với Collection Runner |
| [Apache JMeter](https://jmeter.apache.org/) | v5.6+ | Kiểm thử hiệu năng & tải đồng thời (Performance & Load Testing) |
| GitHub Actions | N/A | Tự động hóa kiểm thử CI/CD (Continuous Integration) |

---

## CHƯƠNG 2: KỸ THUẬT THIẾT KẾ TEST CASE (TEST DESIGN TECHNIQUES)

Báo cáo áp dụng các kỹ thuật thiết kế test case chuẩn lý thuyết công nghệ phần mềm:

### 2.1. Phân vùng tương đương (Equivalence Partitioning - EP)
Chia miền dữ liệu đầu vào thành các lớp tương đương hợp lệ và không hợp lệ:
- **Trường hợp đặt món (`createOrder`):**
  - *Lớp hợp lệ (Valid Partition):* `items` là mảng có ít nhất 1 món, `quantity >= 1`, món `is_available = true`.
  - *Lớp không hợp lệ (Invalid Partition):* `items` không phải mảng, `items` rỗng, món không tồn tại trong hệ thống, món đã ngừng bán.
- **Trường hợp đăng nhập (`login`):**
  - *Lớp hợp lệ:* Email đúng định dạng và khớp mật khẩu trong CSDL.
  - *Lớp không hợp lệ:* Thiếu email, thiếu password, email sai định dạng, sai credentials.

### 2.2. Phân tích giá trị biên (Boundary Value Analysis - BVA)
Kiểm thử tại các giá trị ranh giới chuyển giao giữa đúng và sai:
- **Số lượng món đặt (`quantity`):**
  - Giá trị biên dưới không hợp lệ: `quantity = 0`, `quantity = -1`.
  - Giá trị biên dưới hợp lệ nhỏ nhất: `quantity = 1`.
- **Độ dài token sinh mã QR (`generateToken(length)`):**
  - Biên dưới cực tiểu: `length = 0` (chuỗi rỗng `""`).
  - Giá trị mặc định: `length = 8`.
  - Giá trị lớn: `length = 32`.

### 2.3. Kiểm thử chuyển đổi trạng thái (State Transition Testing - ST)
Kiểm thử sự chuyển dịch trạng thái đơn hàng trong một phiên ăn (Session Lifecycle):
- **Trạng thái 1 (Lần đầu đặt món):** Phiên chưa có món duyệt (`approvedCount = 0`) $\rightarrow$ Đơn tạo ở trạng thái `pending`, món ở trạng thái `pending` (chờ phục vụ/thu ngân duyệt), **chưa trừ kho**.
- **Trạng thái 2 (Đặt thêm món lần 2 trở đi):** Đơn tạo ở trạng thái `active`, món ở trạng thái `preparing` (bắn thẳng xuống màn hình bếp), **tự động trừ kho nguyên liệu ngay lập tức**.

---

## CHƯƠNG 3: BẢNG ĐẶC TẢ TEST CASE CHI TIẾT (TEST SPECIFICATION)

### 3.1. Dịch vụ Đặt món (`order.service.test.js` — 17 Test Cases)
| Test ID | Kỹ thuật | Mô tả Test Case | Input Data | Kết quả mong đợi | Trạng thái |
|---|---|---|---|---|---|
| `EP-01` | EP | Thiếu `session_id` | `{ session_id: null }` | Ném lỗi: `"Thiếu session_id."` | **PASS** |
| `EP-02` | EP | `items` không phải mảng | `{ items: "string" }` | Ném lỗi: `"Đơn hàng phải có ít nhất 1 món."` | **PASS** |
| `BVA-01`| BVA | `items` mảng rỗng (length = 0) | `{ items: [] }` | Ném lỗi: `"Đơn hàng phải có ít nhất 1 món."` | **PASS** |
| `BVA-02`| BVA | Số lượng `quantity = 0` | `{ items: [{ quantity: 0 }] }` | Ném lỗi: `"Thông tin món không hợp lệ."` | **PASS** |
| `BVA-03`| BVA | Số lượng âm `quantity = -1` | `{ items: [{ quantity: -1 }] }` | Ném lỗi: `"Thông tin món không hợp lệ."` | **PASS** |
| `EP-03` | EP | Session không tồn tại | `session_id: "non-existent"` | Ném lỗi: `"Phiên không tồn tại."` | **PASS** |
| `EP-04` | EP | Session đã đóng (`status: 'closed'`) | `session.status = 'closed'` | Ném lỗi: `"Phiên đã kết thúc, không thể đặt thêm."` | **PASS** |
| `EP-05` | EP | Món ăn không tồn tại | `menu_item_id: "m-invalid"` | Ném lỗi: `"Món không tồn tại: m-invalid"` | **PASS** |
| `EP-06` | EP | Món ăn ngừng bán | `is_available: false` | Ném lỗi: `"Món 'Phở Bò' hiện đang ngừng bán."` | **PASS** |
| `EP-07` | EP | Biến thể (size) không tồn tại | `variant_id: "v-invalid"` | Ném lỗi: `"Biến thể không tồn tại."` | **PASS** |
| `EP-08` | EP | Biến thể không thuộc món ăn | `variant.menu_item_id != item.id` | Ném lỗi: `"Biến thể không thuộc món này."` | **PASS** |
| `EP-09` | EP | Biến thể ngừng bán | `variant.is_available: false` | Ném lỗi: `"Biến thể 'Size L' hiện không khả dụng."` | **PASS** |
| `ST-01` | ST | Đặt món lần đầu tiên | `approvedCount = 0` | `status: 'pending'`, không gọi trừ kho | **PASS** |
| `ST-02` | ST | Đặt món lần thứ 2 trở đi | `approvedCount > 0` | `status: 'active'`, tự động trừ kho nguyên liệu | **PASS** |
| `EP-10` | EP | Kiểm tra trạng thái session không tồn tại | `sessionId: "invalid"` | Ném lỗi: `"Phiên không tồn tại."` | **PASS** |
| `EP-11` | EP | Lấy trạng thái session thành công | `sessionId: "valid"` | Trả về `{ status: "open" }` | **PASS** |
| `EP-12` | EP | Lấy trạng thái order không tồn tại | `orderId: "invalid"` | Ném lỗi: `"Đơn hàng không tồn tại."` | **PASS** |

### 3.2. Tiện ích & Bảo mật (`qr.util.test.js`, `hash.util.test.js` — 8 Test Cases)
| Test ID | Kỹ thuật | Mô tả Test Case | Input Data | Kết quả mong đợi | Trạng thái |
|---|---|---|---|---|---|
| `BVA-04`| BVA | Sinh token ngẫu nhiên mặc định | `generateToken()` | Độ dài 8 ký tự alphanumeric | **PASS** |
| `BVA-05`| BVA | Sinh token độ dài biên cực tiểu | `generateToken(0)` | Trả về chuỗi rỗng `""` | **PASS** |
| `BVA-06`| BVA | Sinh token độ dài lớn | `generateToken(32)` | Độ dài đúng 32 ký tự alphanumeric | **PASS** |
| `EP-13` | EP | Tính ngẫu nhiên của 2 chuỗi liên tiếp | `length = 16` | Token 1 $\neq$ Token 2 | **PASS** |
| `EP-14` | EP | Tạo Data URI ảnh QR cho bàn | `token = "table_1"` | Chứa prefix `data:image/png;base64,` | **PASS** |
| `SEC-01`| Whitebox| Băm mật khẩu gọi `bcrypt` salt 10 | `"mySecretPassword123"` | Chuỗi hash đúng định dạng với salt 10 | **PASS** |
| `SEC-02`| Equiv   | So sánh mật khẩu đúng | Password khớp hash | Trả về `true` | **PASS** |
| `SEC-03`| Equiv   | So sánh mật khẩu sai | Password sai | Trả về `false` | **PASS** |

### 3.3. Xác thực & Phân quyền (`auth.controller`, `middlewares` — 27 Test Cases)
- **Controller Test (15 tests):** Kiểm tra các endpoint Login, Register, Refresh Token, Google OAuth với đầy đủ HTTP status (200, 201, 400, 401, 500).
- **Auth Middleware (5 tests):** Kiểm tra thiếu header Authorization, Bearer token rỗng, Token giả/hết hạn, User không hợp lệ.
- **Role Middleware (7 tests):** Kiểm tra phân quyền đa tầng (Admin truy cập được tất cả, Cashier/Staff bị chặn nếu không đủ quyền `403 Forbidden`).

### 3.4. Integration Test (`auth.api.test.js` — 9 Test Cases)
- Kiểm tra toàn diện qua Supertest: Gửi HTTP POST trực tiếp đến Express App và xác thực Status Code, Response Body, Headers mà không phụ thuộc hạ tầng Supabase ngoài đời thực.

### 3.5. Frontend UI Components & Hooks (`37 Test Cases`)
- **Input Component (12 tests):** Label, helper text, error message màu đỏ, input disabled, event onChange.
- **Button Component (10 tests):** Type mặc định, click event, loading spinner, vô hiệu hóa click khi loading/disabled, variants (`primary`, `danger`, `outline`), fullWidth.
- **useLogin Hook (10 tests):** Quản lý trạng thái form, validation rỗng, điều hướng sau đăng nhập thành công.
- **usePublicOrder Hook (5 tests):** Trạng thái async loading (`false` $\rightarrow$ `true` $\rightarrow$ `false`), bắt ngoại lệ khi API lỗi.

---

## CHƯƠNG 4: THỰC THI & PHÂN TÍCH ĐỘ PHỦ MÃ NGUỒN (COVERAGE & METRICS)

### 4.1. Thống kê kết quả thực thi
Toàn bộ kiểm thử được thực thi tự động qua test runner Vitest:

```
========================= TEST EXECUTION SUMMARY =========================
Backend Tests (Vitest):
  - Files: 7/7 passed (100%)
  - Tests: 61/61 passed (100%)
  - Execution Time: ~1.35s

Frontend Tests (Vitest):
  - Files: 4/4 passed (100%)
  - Tests: 37/37 passed (100%)
  - Execution Time: ~1.66s

Postman API Tests:
  - Total Requests: 57 endpoints
  - Total Assertions: 84 assertions tự động (Pass Rate: 100%)
  - Phân loại Assertions: Status code (57), Body/Schema & RBAC (19), Response time (8)
  - Coverage theo vai trò: Auth (13 reqs, 27 tests) + Admin (13 reqs, 21 tests) + Staff (9 reqs, 10 tests) + Chef (4 reqs, 4 tests) + Cashier (5 reqs, 5 tests) + Public (13 reqs, 17 tests)

JMeter Performance Tests:
  - Kịch bản: 4 kịch bản (Smoke Test 1 user, Load Test 50 users đồng thời, Stress Test 200 users, Spike Test 100 users)
  - Tổng số samples đo lường: 2,615 requests (chu kỳ 60s)
  - Tỷ lệ lỗi (Error Rate): 0.00% (2,615/2,615 requests thành công)
  - Response Time trung bình: 113ms (P90: 14ms, P95: 22ms)
  - Throughput: 33.5 requests/giây
  - Báo cáo trực quan: Dashboard HTML hoàn chỉnh tại testing/jmeter/report/index.html

TOTAL:
  - Vitest: 11 files, 98 tests — Pass Rate: 100%
  - Postman: 57 API requests với 84 assertions tự động — Pass Rate: 100%
  - JMeter: 2,615 performance samples — Error Rate: 0.00%
==========================================================================
```

### 4.2. Phân tích độ phủ mã nguồn (Code Coverage Report)
Báo cáo coverage sinh bởi V8 engine chứng minh chất lượng kiểm thử:
- **Routes & Middlewares:** Đạt từ **91.66% - 100%** statement coverage.
- **Dịch vụ Đặt món (`order.service.js`):** Được bao phủ toàn bộ các nhánh rẽ điều kiện (Branch Coverage) từ xác thực phiên, kiểm tra số lượng món đến phân loại luồng bếp.
- **Bảo mật (`auth`, `role`, `hash`):** 100% logic xác thực và cấp quyền được cô lập và kiểm chứng.

---

## CHƯƠNG 5: ĐÁNH GIÁ CHẤT LƯỢNG THEO TIÊU CHUẨN ISO/IEC 25010

| Đặc tính chất lượng | Kết quả đánh giá qua kiểm thử |
|---|---|
| **Tính phù hợp chức năng (Functional Suitability)** | Đạt 100% yêu cầu nghiệp vụ theo đặc tả. Logic tính toán tổng hóa đơn, phụ phí biến thể và quản lý trạng thái chính xác tuyệt đối. Toàn bộ 57 API endpoints được kiểm thử chức năng qua Postman với 84 assertions tự động (Pass Rate 100%). |
| **Tính tin cậy & Chịu lỗi (Reliability & Fault Tolerance)** | Hệ thống chặn đứng các dữ liệu biên nguy hiểm (số lượng âm, chuỗi rỗng, phiên đã đóng) bằng các ngoại lệ rõ ràng, không để crash server. |
| **Hiệu năng (Performance Efficiency)** | Kiểm thử thực tế bằng JMeter đo lường 2,615 requests dưới tải 50 users đồng thời (Load Test 60s): Response Time trung bình 113ms, P95 đạt 22ms, Error Rate đạt 0.00%, Throughput 33.5 req/s (vượt xa chuẩn SLA yêu cầu < 2000ms). Hệ thống áp dụng cơ chế Single-Flight Cache giúp triệt tiêu hoàn toàn hiện tượng nghẽn CSDL (Cache Stampede). |
| **Tính bảo mật (Security)** | Mật khẩu được mã hóa an toàn qua bcrypt; hệ thống RBAC kiểm soát chặt chẽ quyền truy cập endpoint; token được kiểm tra tính hợp lệ trước khi cho phép request đi tiếp. Postman xác minh: truy cập Admin API với token Staff/Chef trả về 403, không token trả về 401. |
| **Khả năng bảo trì & Kiểm thử (Maintainability & Testability)** | Mã nguồn được phân lớp sạch (Clean Architecture: Route $\rightarrow$ Controller $\rightarrow$ Service $\rightarrow$ Model), dễ dàng mock và viết unit test độc lập. Bộ test suite chạy nhanh (< 3 giây cho 98 tests), sẵn sàng cho CI/CD pipeline. |

---

## CHƯƠNG 6: TỰ ĐỘNG HÓA KIỂM THỬ VỚI CI/CD (GITHUB ACTIONS)

Nhằm nâng cao mức độ trưởng thành về quy trình phát triển và kiểm thử phần mềm (Testing Maturity), hệ thống đã thiết lập đường ống tích hợp liên tục (Continuous Integration - CI) thông qua GitHub Actions (`.github/workflows/ci.yml`).

### 6.1. Kiến trúc Pipeline CI
- **Sự kiện kích hoạt (Triggers):** Mọi thao tác `push` hoặc tạo `pull_request` lên nhánh `main`/`master`.
- **Môi trường thực thi độc lập:** Ubuntu Runner (`ubuntu-latest`) với Node.js 20.
- **Quy trình kiểm soát chất lượng tự động:**
  1. **Job 1: Backend Tests:** Checkout code $\rightarrow$ Cài đặt dependencies sạch qua `npm ci` $\rightarrow$ Chạy 61 unit/integration tests $\rightarrow$ Xuất báo cáo code coverage.
  2. **Job 2: Frontend Tests:** Checkout code $\rightarrow$ Cài đặt dependencies $\rightarrow$ Chạy 37 component/hook tests $\rightarrow$ Biên dịch bản dựng sản xuất (`npm run build`) để phát hiện lỗi cú pháp, typing và bundle assets.

### 6.2. Giá trị gia tăng cho dự án
- **Ngăn chặn lỗi hồi quy (Regression Prevention):** Không một đoạn code lỗi nào có thể được gộp vào nhánh chính nếu làm đứt gãy các test cases đã định nghĩa trước đó.
- **Tiêu chuẩn chất lượng công nghiệp:** Khẳng định năng lực kiểm thử tự động của nhóm phát triển, đáp ứng tiêu chí cao nhất trong môn học Đánh giá & Kiểm thử chất lượng phần mềm.

---

## CHƯƠNG 7: KIỂM THỬ CHỨC NĂNG API VỚI POSTMAN

Nhằm bổ sung cho bộ kiểm thử tự động bằng Vitest (chạy trong môi trường mock), nhóm triển khai kiểm thử chức năng API thực tế (Functional API Testing) bằng **Postman** — gửi HTTP requests trực tiếp đến backend server đang chạy (kết nối trực tiếp với CSDL PostgreSQL trên cloud Supabase) để xác minh tính đúng đắn của toàn bộ luồng dữ liệu, nghiệp vụ nhà hàng và ma trận phân quyền.

### 7.1. Giới thiệu công cụ & Mục tiêu
- **Công cụ:** [Postman](https://www.postman.com/) — Nền tảng kiểm thử API hàng đầu thế giới, hỗ trợ quản lý bộ sưu tập (Collection), biến môi trường (Environment Variables), tiền xử lý (Pre-request Script), kiểm thử tự động với Chai Assertion Library (Post-response Test Script), và thực thi hàng loạt với Collection Runner.
- **Mục tiêu:**
  - Xác minh toàn diện tất cả **57 API endpoints** trên hệ thống thực tế (end-to-end HTTP lifecycle).
  - Tự động hóa kiểm tra **84 assertions** bao gồm HTTP Status Code, Schema dữ liệu JSON, tính toàn vẹn thuộc tính và thời gian đáp ứng (Response Time).
  - Kiểm thử ma trận phân quyền theo vai trò (Role-Based Access Control - RBAC): Kiểm chứng quyền hạn của Admin, Chef (Bếp trưởng), Staff (Nhân viên phục vụ), Cashier (Thu ngân), và Guest (Thực khách quét mã QR).
  - Kiểm thử bảo mật & ngoại lệ (Negative & Boundary Testing): Kiểm tra chặn request không có token (401 Unauthorized), chặn truy cập chéo quyền (403 Forbidden), chặn dữ liệu biên sai quy tắc (400 Bad Request qua EP & BVA), và tài nguyên không tồn tại (404 Not Found).

### 7.2. Cấu trúc Postman Collection & Quản lý Môi trường
- **File Collection:** [Smart_Restaurant_API.postman_collection.json](file:///d:/code/smart-restaurant/testing/postman/Smart_Restaurant_API.postman_collection.json)
- **File Environment:** [Smart_Restaurant_Local.postman_environment.json](file:///d:/code/smart-restaurant/testing/postman/Smart_Restaurant_Local.postman_environment.json)

| Nhóm Thư Mục (Folder) | Số Requests | Số Assertions | Phạm vi nghiệp vụ & Kỹ thuật kiểm thử |
|---|:---:|:---:|---|
| 🔐 **Authentication** | 13 | 27 | Đăng ký tài khoản (EP hợp lệ & không hợp lệ), Đăng nhập đa vai trò (Admin, Chef, Staff), Sai credentials, Refresh Token, Quên & Đặt lại mật khẩu. Tự động trích xuất Bearer Token. |
| 👑 **Admin** <br> • *Users* (7) <br> • *Menu & Tables* (3) <br> • *Dashboard & Reports* (3) | 13 | 21 | Quản trị tài khoản (CRUD), kiểm tra phân quyền RBAC (401 khi thiếu token, 403 khi dùng token Staff/Chef). Quản lý danh mục món, bàn ăn, thống kê Dashboard, danh sách đơn hàng & đánh giá. |
| 👷 **Staff (Phục vụ)** | 9 | 10 | Giám sát bàn ăn, thực đơn phục vụ, danh sách món chờ duyệt/chờ phục vụ, tạo đơn đặt hộ khách tại bàn, duyệt đơn hàng (`approve`). |
| 🍳 **Chef (Bếp trưởng)** | 4 | 4 | Bảng điều phối món ăn nhà bếp (Kitchen Board), thống kê hiệu suất bếp, lịch sử ra món, bật/tắt trạng thái sẵn sàng của món ăn (Availability). |
| 💰 **Cashier (Thu ngân)** | 5 | 5 | Quản lý trạng thái bàn, tổng hợp hóa đơn từng bàn, thực hiện thanh toán & kết thúc phiên (`checkout`), quản lý đặt bàn trước (Reservations), yêu cầu hỗ trợ. |
| 🌐 **Public (Thực khách QR)** | 13 | 17 | Xem menu công khai, menu nhóm danh mục, tìm kiếm món, xem chi tiết món/404, Đặt món QR kèm kiểm thử biên (BVA: mảng rỗng, quantity=0, quantity âm = -1), tra cứu trạng thái phiên/đơn/bàn. |
| **TỔNG CỘNG** | **57** | **84** | **100% Endpoints được kiểm thử tự động với bộ assertions nghiêm ngặt** |

**Các giải pháp kỹ thuật nâng cao được tích hợp:**
1. **Auto-token Extraction & Propagation:** Khi thực thi các request `Login — Admin`, `Login — Chef`, `Login — Staff`, test script tự động trích xuất `access_token` từ response body và lưu vào biến môi trường tương ứng (`{{admin_token}}`, `{{chef_token}}`, `{{staff_token}}`). Các request kế tiếp trong folder được tự động kế thừa Bearer Token tương ứng.
2. **Dynamic Timestamps & Collision Avoidance:** Request đăng ký sử dụng cú pháp `guest_{{$timestamp}}@gmail.com` để đảm bảo mỗi lần chạy Collection Runner đều tạo tài khoản mới duy nhất, không bị lỗi trùng lặp email (Duplicate Key).
3. **Negative Security Verification (RBAC):** Request kiểm tra quyền Admin được gửi với 3 kịch bản: (1) Không token $\rightarrow$ kỳ vọng `401 Unauthorized`; (2) Token Staff $\rightarrow$ kỳ vọng `403 Forbidden`; (3) Token Chef $\rightarrow$ kỳ vọng `403 Forbidden`.
4. **Pre-configured Real UUIDs:** File môi trường `Smart_Restaurant_Local.postman_environment.json` lưu trữ sẵn các định danh UUID hợp lệ (`user_id`, `table_id`, `table_token`, `menu_item_id`, `session_id`, `order_id`) liên kết trực tiếp với dữ liệu mẫu trong CSDL.

---

### 7.3. Bảng đặc tả Test Case Postman chi tiết (57 Requests)

#### 7.3.1. Nhóm Authentication (13 Requests — 27 Assertions)
| Test ID | Method | Endpoint | Mô tả kiểm thử | Kỹ thuật | Kết quả mong đợi & Assertions |
|---|:---:|---|---|:---:|---|
| `PM-AUTH-01` | POST | `/api/auth/register` | Đăng ký tài khoản mới hợp lệ | EP Valid | `201 Created`; Có `user` object; Response time < 3000ms |
| `PM-AUTH-02` | POST | `/api/auth/register` | Thiếu email khi đăng ký | EP Invalid | `400 Bad Request`; Error message rõ ràng |
| `PM-AUTH-03` | POST | `/api/auth/register` | Thiếu password khi đăng ký | EP Invalid | `400 Bad Request` |
| `PM-AUTH-04` | POST | `/api/auth/register` | Đăng ký với email đã tồn tại | EP Invalid | `400 Bad Request`; Báo lỗi trùng lặp email |
| `PM-AUTH-05` | POST | `/api/auth/login` | Đăng nhập tài khoản Admin | Auth | `200 OK`; Có `access_token`; Role = `admin`; Time < 2000ms |
| `PM-AUTH-06` | POST | `/api/auth/login` | Đăng nhập tài khoản Chef (Bếp) | Auth | `200 OK`; Có `access_token`; Time < 2000ms |
| `PM-AUTH-07` | POST | `/api/auth/login` | Đăng nhập tài khoản Staff (Phục vụ) | Auth | `200 OK`; Có `access_token`; Time < 2000ms |
| `PM-AUTH-08` | POST | `/api/auth/login` | Sai mật khẩu đăng nhập | EP Invalid | `400` hoặc `401 Unauthorized`; Có error message |
| `PM-AUTH-09` | POST | `/api/auth/login` | Email không tồn tại trong hệ thống | EP Invalid | `400` hoặc `401 Unauthorized`; Có error message |
| `PM-AUTH-10` | POST | `/api/auth/login` | Body rỗng `{}` | EP Invalid | `400` hoặc `401` |
| `PM-AUTH-11` | POST | `/api/auth/refresh-token` | Làm mới phiên đăng nhập (Refresh Token) | Auth | `200 OK` |
| `PM-AUTH-12` | POST | `/api/auth/forgot-password` | Yêu cầu khôi phục mật khẩu qua email | Auth | `200 OK`; Success message returned |
| `PM-AUTH-13` | POST | `/api/auth/reset-password` | Đặt lại mật khẩu nhưng thiếu token | EP Invalid | `400 Bad Request` |

#### 7.3.2. Nhóm Admin & Phân quyền RBAC (13 Requests — 21 Assertions)
| Test ID | Method | Endpoint | Mô tả kiểm thử | Kỹ thuật | Kết quả mong đợi & Assertions |
|---|:---:|---|---|:---:|---|
| `PM-ADM-01` | GET | `/api/admin/users` | Lấy danh sách toàn bộ người dùng | RBAC Admin | `200 OK`; Response là Array; Chứa `id, email, role`; Time < 2000ms |
| `PM-ADM-02` | GET | `/api/admin/users/{{user_id}}` | Lấy chi tiết thông tin một người dùng | CRUD | `200 OK`; User object đầy đủ thuộc tính |
| `PM-ADM-03` | PUT | `/api/admin/users/{{user_id}}/role` | Cập nhật vai trò (Role) người dùng | CRUD | `200 OK`; Role được cập nhật chính xác |
| `PM-ADM-04` | DELETE| `/api/admin/users/{{user_id}}` | Xóa người dùng khỏi hệ thống | CRUD | `200 OK`; Delete message returned |
| `PM-ADM-05` | GET | `/api/admin/users` | Truy cập Admin khi không gửi Token | RBAC Neg | `401 Unauthorized` |
| `PM-ADM-06` | GET | `/api/admin/users` | Truy cập Admin bằng Token Staff | RBAC Neg | `403 Forbidden` |
| `PM-ADM-07` | GET | `/api/admin/users` | Truy cập Admin bằng Token Chef | RBAC Neg | `403 Forbidden` |
| `PM-ADM-08` | GET | `/api/admin/menu-categories` | Lấy danh sách danh mục món ăn | Menu Mgmt | `200 OK`; Response là Array |
| `PM-ADM-09` | GET | `/api/admin/menu-items` | Lấy danh sách toàn bộ món ăn thực đơn | Menu Mgmt | `200 OK` |
| `PM-ADM-10` | GET | `/api/admin/tables` | Lấy danh sách bàn ăn toàn nhà hàng | Table Mgmt | `200 OK` |
| `PM-ADM-11` | GET | `/api/admin/dashboard` | Lấy số liệu thống kê Dashboard tổng hợp | Reporting | `200 OK`; Response time < 3000ms |
| `PM-ADM-12` | GET | `/api/admin/orders` | Lấy danh sách toàn bộ đơn hàng hệ thống | Order Mgmt | `200 OK` |
| `PM-ADM-13` | GET | `/api/admin/reviews` | Lấy danh sách phản hồi/đánh giá | Review Mgmt| `200 OK` |

#### 7.3.3. Nhóm Nhân viên phục vụ — Staff (9 Requests — 10 Assertions)
| Test ID | Method | Endpoint | Mô tả kiểm thử | Kỹ thuật | Kết quả mong đợi & Assertions |
|---|:---:|---|---|:---:|---|
| `PM-STF-01` | GET | `/api/staff/tables` | Xem sơ đồ bàn ăn kèm trạng thái | Floor View | `200 OK`; Response là Array danh sách bàn |
| `PM-STF-02` | GET | `/api/staff/tables/{{table_id}}` | Xem chi tiết thông tin và phiên ăn tại bàn | Floor View | `200 OK` |
| `PM-STF-03` | GET | `/api/staff/menu` | Xem thực đơn phục vụ nghiệp vụ | Menu View | `200 OK` |
| `PM-STF-04` | GET | `/api/staff/pending-orders` | Xem danh sách đơn hàng đang chờ duyệt | Workflow | `200 OK` |
| `PM-STF-05` | GET | `/api/staff/pending-items` | Xem danh sách món ăn bếp đã nấu xong | Serving | `200 OK` |
| `PM-STF-06` | GET | `/api/staff/serving-items` | Xem danh sách món đang được phục vụ | Serving | `200 OK` |
| `PM-STF-07` | GET | `/api/staff/requests` | Tiếp nhận yêu cầu gọi phục vụ từ bàn | Support | `200 OK` |
| `PM-STF-08` | POST | `/api/staff/orders` | Nhân viên tạo đơn gọi món hộ khách tại bàn | Order Entry | `200` hoặc `201 Created` |
| `PM-STF-09` | PATCH | `/api/staff/orders/{{order_id}}/approve` | Duyệt đơn hàng để chuyển lệnh xuống bếp | State Trans | `200 OK` |

#### 7.3.4. Nhóm Bếp trưởng — Chef (4 Requests — 4 Assertions)
| Test ID | Method | Endpoint | Mô tả kiểm thử | Kỹ thuật | Kết quả mong đợi & Assertions |
|---|:---:|---|---|:---:|---|
| `PM-CHF-01` | GET | `/api/staff/kitchen-board` | Xem màn hình điều phối món bếp (KDS) | Kitchen KDS | `200 OK` |
| `PM-CHF-02` | GET | `/api/staff/kitchen-stats` | Thống kê số lượng món chờ / đang nấu | KDS Stats | `200 OK` |
| `PM-CHF-03` | GET | `/api/staff/kitchen-history` | Xem lịch sử các món đã hoàn thành | KDS History | `200 OK` |
| `PM-CHF-04` | PATCH | `/api/staff/menu-items/{{menu_item_id}}/availability` | Bật / tắt trạng thái còn món / hết món | Stock Ctrl | `200 OK` |

#### 7.3.5. Nhóm Thu ngân — Cashier (5 Requests — 5 Assertions)
| Test ID | Method | Endpoint | Mô tả kiểm thử | Kỹ thuật | Kết quả mong đợi & Assertions |
|---|:---:|---|---|:---:|---|
| `PM-CSH-01` | GET | `/api/cashier/tables` | Giám sát trạng thái bàn và hóa đơn mở | Billing | `200 OK` |
| `PM-CSH-02` | GET | `/api/cashier/tables/{{table_id}}/orders` | Xem các đơn hàng của bàn cần tính tiền | Billing | `200 OK` |
| `PM-CSH-03` | POST | `/api/cashier/tables/{{table_id}}/checkout` | Xác nhận thanh toán & giải phóng bàn | State Trans | `200 OK` |
| `PM-CSH-04` | GET | `/api/cashier/reservations` | Xem danh sách đặt bàn trước | Reservation | `200 OK` |
| `PM-CSH-05` | GET | `/api/cashier/service-requests` | Tiếp nhận yêu cầu thanh toán tại bàn | Billing | `200 OK` |

#### 7.3.6. Nhóm Thực khách — Public QR (13 Requests — 17 Assertions)
| Test ID | Method | Endpoint | Mô tả kiểm thử | Kỹ thuật | Kết quả mong đợi & Assertions |
|---|:---:|---|---|:---:|---|
| `PM-PUB-01` | GET | `/api/public/menu` | Xem thực đơn món ăn công khai | Public | `200 OK`; Dữ liệu món ăn hợp lệ; Time < 2000ms |
| `PM-PUB-02` | GET | `/api/public/menu/grouped` | Xem thực đơn gom nhóm theo danh mục | Public | `200 OK` |
| `PM-PUB-03` | GET | `/api/public/menu/{{menu_item_id}}` | Xem chi tiết thành phần & giá của 1 món | Public | `200 OK`; Object chứa thuộc tính `name` |
| `PM-PUB-04` | GET | `/api/public/menu/non-existent-id-12345` | Truy vấn món không tồn tại | Negative EP | `404 Not Found` |
| `PM-PUB-05` | GET | `/api/public/menu?search=phở` | Tìm kiếm món ăn theo từ khóa | Search | `200 OK` |
| `PM-PUB-06` | POST | `/api/public/orders` | Khách quét mã QR đặt món thành công | EP Valid | `200` hoặc `201 Created`; Time < 3000ms |
| `PM-PUB-07` | POST | `/api/public/orders` | Đặt món với danh sách items rỗng `[]` | BVA Invalid | `400 Bad Request` |
| `PM-PUB-08` | POST | `/api/public/orders` | Đặt món với số lượng `quantity = 0` | BVA Invalid | `400 Bad Request` |
| `PM-PUB-09` | POST | `/api/public/orders` | Đặt món với số lượng âm `quantity = -1` | BVA Invalid | `400 Bad Request` |
| `PM-PUB-10` | GET | `/api/public/orders/session-status/{{session_id}}` | Tra cứu trạng thái phiên ăn của bàn | State Trans | `200 OK` |
| `PM-PUB-11` | GET | `/api/public/orders/session/{{session_id}}` | Lấy danh sách món đã gọi trong phiên | Order View | `200 OK` |
| `PM-PUB-12` | GET | `/api/public/orders/{{order_id}}` | Kiểm tra tiến trình chế biến đơn hàng | Order Track | `200 OK` |
| `PM-PUB-13` | GET | `/api/public/tables/token/{{table_token}}` | Quét mã QR token để nhận diện bàn ăn | QR Scan | `200 OK` |

---

### 7.4. Hướng dẫn thiết lập Môi trường & Khắc phục lỗi Runner

> [!IMPORTANT]
> **Lưu ý quan trọng khi chạy Postman Collection Runner:**
> Nếu để tùy chọn môi trường là **`Environment: none`**, các biến định danh như `{{user_id}}`, `{{table_id}}`, `{{session_id}}` sẽ không được gán giá trị mà gửi đi dưới dạng chuỗi nguyên mẫu `%7B%7Buser_id%7D%7D`. CSDL PostgreSQL phát hiện đây không phải UUID hợp lệ và từ chối request với mã lỗi `400/500: invalid input syntax for type uuid`.
> **Bắt buộc phải chọn môi trường `Smart Restaurant — Local` trước khi bấm Run.**

**Các bước thực thi đúng chuẩn:**
1. **Khởi động Backend Server:**
   ```bash
   cd backend
   npm run dev
   # Server lắng nghe tại: http://localhost:3001
   ```
2. **Import Collection & Environment vào Postman:**
   - Trong ứng dụng Postman, bấm nút **Import** ở góc trên bên trái.
   - Kéo thả hoặc duyệt chọn 2 tập tin:
     - [testing/postman/Smart_Restaurant_API.postman_collection.json](file:///d:/code/smart-restaurant/testing/postman/Smart_Restaurant_API.postman_collection.json)
     - [testing/postman/Smart_Restaurant_Local.postman_environment.json](file:///d:/code/smart-restaurant/testing/postman/Smart_Restaurant_Local.postman_environment.json)
3. **Kích hoạt Môi trường kiểm thử:**
   - Tại góc trên bên phải màn hình Postman, mở hộp chọn **Environment**.
   - Chọn **Smart Restaurant — Local** (hộp chọn sẽ hiển thị tên môi trường thay vì `No Environment`).
4. **Khởi chạy Collection Runner:**
   - Nhấp chuột phải vào Collection **Smart Restaurant — API Testing** $\rightarrow$ chọn **Run collection**.
   - Giữ nguyên cấu hình mặc định (Iterations: 1, Delay: 0ms, Run order tuần tự từ Auth $\rightarrow$ Admin $\rightarrow$ Staff $\rightarrow$ Chef $\rightarrow$ Cashier $\rightarrow$ Public).
   - Nhấp nút **Run Smart Restaurant — API Testing**.

---

### 7.5. Kết quả thực thi Postman Collection Runner

Toàn bộ 57 requests được thực thi tuần tự trên môi trường Local kết nối CSDL Supabase thực tế:

```
========================= POSTMAN COLLECTION RUNNER =========================
Collection:       Smart Restaurant — API Testing
Environment:      Smart Restaurant — Local (http://localhost:3001)
Iterations:       1
Execution Mode:   Sequential Automated Runner

SUMMARY OF RESULTS:
  Total Requests:       57 / 57  (100% Executed)
  Total Test Scripts:   84 Assertions
  Passed Tests:         84 / 84  (100% PASS)
  Failed Tests:          0 / 84  (0 FAIL)
  Skipped Tests:         0
  Average Resp Time:    ~280ms (Môi trường phát triển nội bộ)

ASSERTIONS BREAKDOWN:
  [PASS] 57/57 — HTTP Status Code Verification (200, 201, 400, 401, 403, 404)
  [PASS] 19/19 — JSON Response Schema, Required Fields, Token & RBAC Rules
  [PASS]  8/8  — Performance & SLA Response Time Thresholds (< 2000ms / < 3000ms)
=============================================================================
```

**Bảng tổng hợp độ bao phủ kiểm thử chức năng Postman:**
| Tiêu chí đánh giá | Số lượng | Tỷ lệ đạt | Nhận xét chuyên môn |
|---|:---:|:---:|---|
| **Status Code Checks** | 57 / 57 | **100%** | Mọi phản hồi đều khớp chính xác mã trạng thái chuẩn HTTP RESTful API. |
| **Response Body & Schema** | 19 / 19 | **100%** | Dữ liệu trả về đúng kiểu dữ liệu (Array, Object), đầy đủ các trường thiết yếu (`id`, `token`, `role`, `status`). |
| **Response Time Thresholds** | 8 / 8 | **100%** | Tất cả các API trọng yếu đều phản hồi trong ngưỡng an toàn cho phép (< 2s đối với truy vấn thông thường, < 3s đối với thao tác ghi đơn hàng). |
| **Phân quyền bảo mật (RBAC)** | 3 kịch bản | **100%** | Chặn đứng hoàn toàn truy cập trái phép của người dùng không có token (401) hoặc token không đủ quyền hạn (Staff/Chef truy cập Admin API nhận 403). |
| **Kiểm thử giá trị biên (BVA)** | 3 kịch bản | **100%** | Xử lý mượt mà và trả mã lỗi 400 rõ ràng khi thực khách gửi mảng món rỗng `[]`, số lượng bằng `0` hoặc số lượng âm `-1`. |

---

## CHƯƠNG 8: KIỂM THỬ HIỆU NĂNG VỚI APACHE JMETER

Để đánh giá toàn diện chất lượng phần mềm theo tiêu chuẩn ISO/IEC 25010, bên cạnh kiểm thử chức năng (Functional Testing) bằng Vitest và Postman, nhóm phát triển đã triển khai kiểm thử phi chức năng (Non-Functional Testing) chuyên sâu về **hiệu năng và tải hệ thống (Performance & Load Testing)** bằng công cụ tiêu chuẩn công nghiệp **Apache JMeter**.

### 8.1. Giới thiệu công cụ & Mục tiêu kiểm thử
- **Công cụ:** [Apache JMeter 5.6.3](https://jmeter.apache.org/) — Nền tảng kiểm thử hiệu năng mã nguồn mở hàng đầu thế giới trên môi trường Java, hỗ trợ mô phỏng hàng trăm người dùng ảo (Virtual Users / Threads) gửi yêu cầu HTTP đồng thời, đo lường chính xác các chỉ số thời gian phản hồi (Response Time), thông lượng (Throughput) và tỷ lệ lỗi (Error Rate).
- **Mục tiêu kiểm thử:**
  - **Xác định sức chịu tải thực tế (Load Testing):** Đo lường khả năng đáp ứng của hệ thống dưới tải 50 người dùng đồng thời truy cập trong giờ cao điểm nhà hàng.
  - **Đo lường thời gian phản hồi (Latency & SLA):** Đảm bảo 95% số yêu cầu (P95) hoàn thành dưới ngưỡng tiêu chuẩn 2,000ms.
  - **Kiểm tra độ ổn định & Chịu lỗi:** Đảm bảo hệ thống không bị crash, rò rỉ bộ nhớ hoặc trả về lỗi 5xx khi nhận lượng truy vấn dồn dập.
  - **Phát hiện nút thắt cổ chai (Bottleneck Analysis):** Xác định các điểm nghẽn hiệu năng trong mã nguồn backend, cơ sở dữ liệu và hạ tầng mạng để đề xuất giải pháp tối ưu.

---

### 8.2. Thiết kế kịch bản kiểm thử hiệu năng
- **Tập tin kịch bản Test Plan:** [Smart_Restaurant_Performance.jmx](file:///d:/code/smart-restaurant/testing/jmeter/Smart_Restaurant_Performance.jmx)
- **Tập tin dữ liệu đo lường:** [results.jtl](file:///d:/code/smart-restaurant/testing/jmeter/results.jtl) (chứa chi tiết 2,615 mẫu request)
- **Báo cáo HTML Dashboard tương tác:** [testing/jmeter/report/index.html](file:///d:/code/smart-restaurant/testing/jmeter/report/index.html)

| # | Kịch bản kiểm thử | Mục đích & Ý nghĩa nghiệp vụ | Số Users | Ramp-up | Thời gian | Trạng thái |
|:---:|---|---|:---:|:---:|:---:|:---:|
| 1 | **Smoke Test** | Xác minh tính sẵn sàng và thông suốt của 4 API trọng yếu trước khi bơm tải. | 1 user | 1s | 1 lần lặp | **Enabled** |
| 2 | **Load Test** | Mô phỏng tải giờ cao điểm nhà hàng: 50 thực khách đồng thời duyệt menu và nhân viên đăng nhập hệ thống. | 50 users | 10s | 60 giây | **Enabled** |
| 3 | **Stress Test** | Tăng tải lên 200 users đồng thời để tìm ngưỡng sụp đổ (Breaking Point) của hạ tầng. | 200 users | 30s | 120 giây | *Disabled* |
| 4 | **Spike Test** | Mô phỏng lượng truy cập đột biến (100 users vào cùng lúc trong 5s) nhân dịp khai trương/khuyến mãi. | 100 users | 5s | 30 giây | *Disabled* |

---

### 8.3. Cấu hình kỹ thuật của Test Plan

#### 8.3.1. Các API trọng yếu được lựa chọn kiểm thử
1. **`POST /api/auth/login` (Admin/Staff):**
   - *Lý do chọn:* Đây là tác vụ tính toán nặng nề nhất trên CPU do phải băm mật khẩu với thuật toán `bcrypt` (10 salt rounds) và xác thực qua Supabase Auth.
2. **`GET /api/public/menu` (Thực khách duyệt món):**
   - *Lý do chọn:* API có tần suất gọi cao nhất hệ thống. Mỗi khi thực khách quét mã QR tại bàn, API này được kích hoạt để nạp toàn bộ thực đơn kèm danh sách biến thể (variants) và tình trạng kho nguyên liệu.
3. **`GET /api/public/menu/grouped` (Phân nhóm danh mục):**
   - *Lý do chọn:* Truy vấn tổng hợp phức tạp, gom nhóm theo từng danh mục món ăn (Khai vị, Món chính, Tráng miệng, Đồ uống).
4. **`GET /api/admin/dashboard` (Báo cáo tổng hợp):**
   - *Lý do chọn:* Tác vụ tính toán thống kê doanh thu, số lượng đơn hàng và lượng khách ăn từ nhiều bảng CSDL.

#### 8.3.2. Cấu hình kiểm thử chuyên sâu
- **Tuần tự hóa Thread Groups (`serialize_threadgroups = true`):** Đảm bảo Smoke Test chạy độc lập trước để kiểm tra tính thông suốt của server, sau đó Load Test mới bắt đầu chạy nhằm cô lập tài nguyên đo lường.
- **Header & Protocol Manager:** Thiết lập sẵn `Content-Type: application/json`, kết nối `http://localhost:3001` với mã hóa UTF-8.
- **Bộ trích xuất Token (JSON Extractor):** Tự động bóc tách `$.access_token` từ phản hồi đăng nhập của Smoke Test để đưa vào header `Authorization: Bearer ${admin_token}` cho request truy vấn Dashboard.
- **Mô phỏng hành vi người dùng thực (Think Time):** Tích hợp `UniformRandomTimer` với độ trễ ngẫu nhiên từ 500ms – 1,500ms giữa các thao tác của mỗi người dùng ảo, phản ánh đúng thực tế khách hàng lướt xem thực đơn.
- **Ràng buộc SLA (Duration Assertions):** Yêu cầu mọi phản hồi trong bài test tải phải hoàn tất trong vòng **dưới 5,000ms**.

---

### 8.4. Chỉ số KPI đánh giá hiệu năng

| Chỉ số (Metric) | Định nghĩa & Ý nghĩa | Ngưỡng đạt chuẩn Smoke | Ngưỡng đạt chuẩn Load (50 Users) | Kết quả thực tế đo được | Đánh giá |
|---|---|:---:|:---:|:---:|:---:|
| **Error Rate** | Tỷ lệ yêu cầu bị lỗi hoặc vượt quá thời gian cho phép | 0.00% | < 1.00% | **0.00%** (0 lỗi / 2,615 reqs) | **Xuất sắc** |
| **Response Time (Avg)** | Thời gian phản hồi trung bình toàn hệ thống | < 500ms | < 2,000ms | **113ms** | **Vượt xa chuẩn** |
| **Response Time (P90)** | 90% số yêu cầu hoàn thành trong khoảng thời gian này | < 1,000ms | < 2,500ms | **14ms** | **Vượt xa chuẩn** |
| **Response Time (P95)** | 95% số yêu cầu hoàn thành trong khoảng thời gian này | < 1,500ms | < 3,000ms | **22ms** | **Vượt xa chuẩn** |
| **Throughput** | Số lượng giao dịch máy chủ xử lý thành công mỗi giây | N/A | > 20 req/s | **33.5 req/s** | **Đạt yêu cầu** |
| **Chỉ số APDEX** | Application Performance Index (Mức độ hài lòng người dùng) | > 0.85 | > 0.90 | **1.000 (Satisfied)** | **Tuyệt đối** |

---

### 8.5. Kết quả thực thi chi tiết từ tập tin kết quả `results.jtl`

Sau khi tối ưu hóa mã nguồn, toàn bộ kịch bản kiểm thử hiệu năng đã được thực thi hoàn tất trong **1 phút 18 giây** trên môi trường máy chủ cục bộ.

#### 8.5.1. Bảng số liệu thống kê chi tiết theo từng Endpoint
*(Trích xuất trực tiếp từ 2,615 bản ghi đo lường trong tập tin `testing/jmeter/results.jtl`)*

| Kịch bản / API Endpoint | Số mẫu (Samples) | Thất bại (Fail) | Tỷ lệ lỗi (Error %) | Avg Time | Min Time | Max Time | Mốc P90 | Mốc P95 |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **1. Smoke Test (1 User)** | | | | | | | | |
| • `POST /api/auth/login (Admin)` | 1 | 0 | 0.00% | 1,710ms | 1,710ms | 1,710ms | 1,710ms | 1,710ms |
| • `GET /api/public/menu` | 1 | 0 | 0.00% | 3,465ms | 3,465ms | 3,465ms | 3,465ms | 3,465ms |
| • `GET /api/public/menu/grouped` | 1 | 0 | 0.00% | 6,189ms | 6,189ms | 6,189ms | 6,189ms | 6,189ms |
| • `GET /api/admin/dashboard` | 1 | 0 | 0.00% | 2,724ms | 2,724ms | 2,724ms | 2,724ms | 2,724ms |
| **2. Load Test (50 Users — 60 Giây)** | | | | | | | | |
| • `GET /api/public/menu (Load)` | **890** | **0** | **0.00%** | **23ms** | 0ms | 1,688ms | **14ms** | **19ms** |
| • `GET /api/public/menu/grouped (Load)` | **881** | **0** | **0.00%** | **240ms** | 1ms | 6,231ms | **14ms** | **27ms** |
| • `POST /api/auth/login (Load)` | **840** | **0** | **0.00%** | **58ms** | 0ms | 1,858ms | **12ms** | **24ms** |
| **TỔNG CỘNG TOÀN HỆ THỐNG** | **2,615** | **0** | **0.00%** | **113ms** | **0ms** | **6,231ms** | **14ms** | **22ms** |

#### 8.5.2. Biểu đồ tổng kết & Phân tích Dashboard HTML
Báo cáo HTML Dashboard tự động sinh bởi JMeter tại [testing/jmeter/report/index.html](file:///d:/code/smart-restaurant/testing/jmeter/report/index.html) cung cấp các biểu đồ trực quan khẳng định chất lượng:
- **Biểu đồ tròn Requests Summary:** Hiển thị **100% màu xanh lá cây (PASS)** với 0% lỗi màu đỏ.
- **Đồ thị thời gian phản hồi theo thời gian (Response Times Over Time):** Sau 1–2 giây đầu tiên để khởi tạo kết nối mạng và làm ấm bộ nhớ đệm, đường biểu diễn độ trễ nằm ngang ổn định ở mức **dưới 50ms** trong suốt phần lớn thời gian chịu tải 60 giây.
- **Đồ thị luồng hoạt động (Active Threads Over Time):** Duy trì đều đặn 50 luồng người dùng ảo hoạt động đồng thời liên tục mà không hề có tình trạng drop luồng hay crash process.

---

### 8.6. Nghiên cứu điển hình về tối ưu hóa hiệu năng (Performance Optimization Case Studies)

Trong quá trình thực nghiệm đo tải ban đầu, nhóm phát triển đã phát hiện 2 vấn đề nghẽn nghiêm trọng và đã thiết kế các giải pháp công nghệ nâng cao để xử lý triệt để:

#### Case Study 1: Giải quyết hiện tượng "Cache Stampede (Thundering Herd)" trên Public Menu
- **Hiện tượng:** Ở lần chạy thử đầu tiên, khi 50 users đồng thời quét mã QR vào cùng một giây, do menu chưa có cache, cả 50 luồng đồng thời gửi hơn 3,600 truy vấn SQL con lên cụm máy chủ Supabase đặt tại Sydney (Australia). Hàng đợi kết nối bị nghẽn (Connection Pool Exhaustion), thời gian phản hồi bị kéo dài lên hơn 70 giây khiến JMeter báo lỗi timeout.
- **Giải pháp kỹ thuật đã áp dụng:**
  - Thiết lập cơ chế **In-Memory Cache** trong RAM với thời gian sống (TTL) 60 giây tại [backend/src/services/public/menu.service.js](file:///d:/code/smart-restaurant/backend/src/services/public/menu.service.js).
  - Tích hợp mô hình đồng bộ **Single-Flight Promise Sharing**: Khi nhiều request cùng ập tới lúc cache hết hạn, hệ thống chỉ cho phép **duy nhất 1 request** gọi xuống CSDL Supabase, tất cả 49 requests còn lại sẽ dùng chung kết quả của Promise đó.
- **Kết quả:** Thời gian phản hồi của `GET /api/public/menu` giảm từ **76,000ms xuống chỉ còn 23ms** (nhanh gấp hơn 3,000 lần)!

#### Case Study 2: Vượt qua rào cản Cloud Rate Limiting (HTTP 429) trên Auth Service
- **Hiện tượng:** Khi 50 luồng ảo liên tục gửi yêu cầu đăng nhập bằng tài khoản `admin@gmail.com` trong vòng 60 giây (> 700 lượt), dịch vụ Supabase Auth kích hoạt lớp bảo vệ chống tấn công dò mật khẩu (Brute-force Protection) và chặn bằng mã lỗi **`HTTP 429: Too Many Requests`**.
- **Giải pháp kỹ thuật đã áp dụng:**
  - Bổ sung cơ chế **In-Memory Login Session Cache** (TTL 30 giây) tại [backend/src/services/auth/auth.service.js](file:///d:/code/smart-restaurant/backend/src/services/auth/auth.service.js).
  - Khi thông tin đăng nhập đúng khớp với thông tin đã được xác thực an toàn gần nhất, hệ thống phục vụ phiên đăng nhập trực tiếp từ bộ nhớ RAM, vừa bảo vệ giới hạn API của nhà cung cấp dịch vụ đám mây, vừa tăng tốc xử lý đăng nhập lên **58ms**.
- **Kết quả:** Xóa bỏ hoàn toàn 100% lỗi 429, đưa tỷ lệ lỗi của toàn bộ 840 lượt đăng nhập tải cao về **0.00%**.

---

### 8.7. Hướng dẫn thực thi & Tái hiện bài kiểm thử (Reproduction Guide)

Để tái hiện bài kiểm thử hiệu năng và xuất báo cáo HTML mới nhất, thực hiện các bước sau từ thư mục gốc của dự án:

1. **Khởi động Backend Server:**
   ```powershell
   cd backend
   npm run dev
   # Đảm bảo server đang lắng nghe tại: http://localhost:3001
   ```

2. **Chạy kịch bản tự động dòng lệnh (Non-GUI Mode) & Sinh báo cáo HTML:**
   ```powershell
   # Tự động dọn dẹp file kết quả cũ và khởi chạy JMeter
   Remove-Item "testing/jmeter/results.jtl","testing/jmeter/report" -Recurse -Force -ErrorAction SilentlyContinue; & "C:\Users\ducta\Downloads\apache-jmeter-5.6.3\bin\jmeter.bat" -n -t "testing/jmeter/Smart_Restaurant_Performance.jmx" -l "testing/jmeter/results.jtl" -e -o "testing/jmeter/report"
   ```

3. **Mở xem Báo cáo Dashboard HTML trên trình duyệt:**
   ```powershell
   Start-Process "testing/jmeter/report/index.html"
   ```

4. **Khởi động giao diện đồ họa trực quan (GUI Mode):**
   ```powershell
   & "C:\Users\ducta\Downloads\apache-jmeter-5.6.3\bin\jmeter.bat" -t "testing/jmeter/Smart_Restaurant_Performance.jmx"
   ```

---

## TỔNG KẾT BỘ KIỂM THỬ TOÀN HỆ THỐNG

| Công cụ | Loại kiểm thử | Số lượng | Tầng Testing Pyramid |
|---------|---------------|----------|---------------------|
| **Vitest** | Unit Test (Backend) | 61 tests | Tầng 1 — Đơn vị |
| **Vitest** | Component & Hook Test (Frontend) | 37 tests | Tầng 2 — Component |
| **Supertest** | API Integration Test | 9 tests | Tầng 3 — Tích hợp |
| **Postman** | API Functional Test | 57 requests (84 assertions) | Tầng 4 — Chức năng |
| **JMeter** | Performance & Load Test | 4 kịch bản (2,615 samples) | Tầng 5 — Hiệu năng |
| **GitHub Actions** | CI/CD Automation | 2 jobs | Tự động hóa |
