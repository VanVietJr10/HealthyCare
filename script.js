document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname;
  const menuLinks = document.querySelectorAll(".header-right-menu a");
  const urlParams = new URLSearchParams(window.location.search);

  // ========================================================
  // PHẦN 1: TỰ ĐỘNG LÀM SÁNG MENU THEO TRANG (Chuẩn WCAG)
  // ========================================================
  const isDoctorsPage = currentPath.includes("doctors.html");
  const isBookingPage =
    currentPath.includes("book.html") || currentPath.includes("/book/");

  menuLinks.forEach((link) => {
    link.classList.remove("active");
    link.removeAttribute("aria-current");

    const linkHref = link.getAttribute("href");

    if (isBookingPage) {
      if (linkHref && linkHref.includes("book")) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    } else if (isDoctorsPage) {
      if (linkHref && linkHref.includes("doctors.html")) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    } else {
      if (
        linkHref &&
        (linkHref.includes("index.html") ||
          link.textContent.trim() === "Trang chủ")
      ) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    }
  });

  // ========================================================
  // PHẦN 2: ĐỔI TIÊU ĐỀ H3 VÀ LỌC BÁC SĨ (TRANG DOCTORS)
  // ========================================================
  const selectedKhoa = urlParams.get("khoa");
  const specialtyHeading = document.getElementById("current-specialty");
  const doctorCards = document.querySelectorAll(".doctor-card");

  const khoaDictionary = {
    "noi-tong-quat": "Chuyên khoa Nội Tổng Quát",
    "san-phu-khoa": "Chuyên khoa Sản Phụ Khoa",
    "tai-mui-hong": "Chuyên khoa Tai Mũi Họng",
    "rang-ham-mat": "Chuyên khoa Răng Hàm Mặt",
    mat: "Chuyên khoa Mắt",
    "da-lieu": "Chuyên khoa Da Liễu",
    "tim-mach": "Chuyên khoa Tim Mạch",
    "co-xuong-khop": "Chuyên khoa Cơ Xương Khớp",
    "than-kinh": "Chuyên khoa Thần Kinh",
    nhi: "Chuyên khoa Nhi",
  };

  if (specialtyHeading) {
    if (selectedKhoa && khoaDictionary[selectedKhoa]) {
      specialtyHeading.textContent = khoaDictionary[selectedKhoa];
      doctorCards.forEach((card) => {
        if (card.getAttribute("data-khoa") === selectedKhoa) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    } else {
      specialtyHeading.textContent = "Tất cả bác sĩ";
      doctorCards.forEach((card) => {
        card.style.display = "flex";
      });
    }
  }

  // ========================================================
  // PHẦN 3: TỰ ĐỘNG QUÉT VÀ ĐỔ DANH SÁCH BÁC SĨ THỰC TẾ THEO KHOA
  // ========================================================
  const selectKhoa = document.getElementById("select-khoa");
  const selectDoctor = document.getElementById("select-doctor");

  // Hàm động đọc file doctors.html bằng Fetch để lấy danh sách bác sĩ thực tế
  async function renderDoctorsDynamic(khoaValue, defaultDoctorId = "") {
    if (!selectDoctor) return;

    selectDoctor.innerHTML = "";

    // Nếu chưa chọn khoa, reset ô bác sĩ về trạng thái ban đầu
    if (khoaValue === "") {
      selectDoctor.innerHTML =
        '<option value="">-- Vui lòng chọn chuyên khoa trước --</option>';
      selectDoctor.disabled = true;
      return;
    }

    try {
      // Đọc mã nguồn trang doctors.html (Chỉnh lại đường dẫn nếu file của bạn nằm ở thư mục khác)
      const response = await fetch("../layout/doctors.html");
      const htmlText = await response.text();

      // Giả lập một môi trường DOM để phân tích cú pháp chuỗi HTML vừa lấy về
      const parser = new DOMParser();
      const docHTML = parser.parseFromString(htmlText, "text/html");

      // Tìm tất cả phần tử bác sĩ thực tế có data-khoa tương ứng
      const realDoctorCards = docHTML.querySelectorAll(
        `.doctor-card[data-khoa="${khoaValue}"]`,
      );

      if (realDoctorCards.length > 0) {
        selectDoctor.disabled = false;
        selectDoctor.innerHTML =
          '<option value="">-- Chọn bác sĩ phụ trách --</option>';

        realDoctorCards.forEach((card) => {
          // Lấy ID của card bác sĩ để làm giá trị (value) gửi form
          const docId = card.id || card.getAttribute("id") || "no-id";

          // Tìm thẻ chứa tên bác sĩ (Thường bạn sẽ dùng h3 hoặc h4 hoặc class tên cụ thể)
          const nameElement =
            card.querySelector("h3") ||
            card.querySelector("h4") ||
            card.querySelector(".doctor-name");
          const docName = nameElement
            ? nameElement.textContent.trim()
            : "Bác sĩ chưa đặt tên";

          const option = document.createElement("option");
          option.value = docId;
          option.textContent = docName;

          // Nếu trùng với ID bác sĩ truyền từ URL sang thì tự động chọn luôn
          if (docId === defaultDoctorId) {
            option.selected = true;
          }
          selectDoctor.appendChild(option);
        });
      } else {
        // Nếu trong file HTML thực tế không tìm thấy card bác sĩ nào thuộc khoa này
        selectDoctor.innerHTML =
          '<option value="">-- Khoa này hiện chưa có lịch bác sĩ --</option>';
        selectDoctor.disabled = true;
      }
    } catch (error) {
      console.error("Lỗi hệ thống khi quét file HTML bác sĩ:", error);
      selectDoctor.innerHTML =
        '<option value="">-- Không thể tải danh sách bác sĩ --</option>';
      selectDoctor.disabled = true;
    }
  }

  // Lắng nghe sự kiện thay đổi Chuyên Khoa trên form
  if (selectKhoa && selectDoctor) {
    selectKhoa.addEventListener("change", (e) => {
      renderDoctorsDynamic(e.target.value);
    });
  }

  // Xử lý tự động điền nếu có tham số truyền từ trang Danh sách bác sĩ sang
  const paramDoctor = urlParams.get("doctor");
  const paramSpecialty = urlParams.get("specialty");

  if (paramSpecialty && selectKhoa) {
    selectKhoa.value = paramSpecialty;
    renderDoctorsDynamic(paramSpecialty, paramDoctor);
  }

  // ========================================================
  // PHẦN 4: CHẶN TẢI LẠI TRANG KHI GỬI FORM VÀ QUAY VỀ TRANG CHỦ
  // ========================================================
  const bookingForm = document.getElementById("main-booking-form");
  const bookingStatus = document.getElementById("booking-status");

  if (bookingForm && bookingStatus) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("fullname").value;

      bookingStatus.style.display = "block";
      bookingStatus.innerHTML = `<strong>✓ Đặt lịch thành công!</strong><br>Bệnh nhân ${name} đã gửi yêu cầu thành công. Hệ thống đang chuyển hướng...`;

      setTimeout(() => {
        window.location.href = "../index.html";
      }, 3000);
    });
  }
});
