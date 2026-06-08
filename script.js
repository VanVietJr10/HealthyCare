document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname;
  const menuLinks = document.querySelectorAll(".header-right-menu a");

  // ========================================================
  // PHẦN 1: TỰ ĐỘNG LÀM SÁNG MENU THEO TRANG
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
  // PHẦN 2: ĐỔI TIÊU ĐỀ H3 VÀ LỌC BÁC SĨ (DÀNH CHO TRANG DOCTORS)
  // ========================================================
  const urlParams = new URLSearchParams(window.location.search);
  const selectedKhoa = urlParams.get("khoa");
  const specialtyHeading = document.getElementById("current-specialty");
  const doctorCards = document.querySelectorAll(".doctor-card");

  const khoaDictionary = {
    "noi-tong-quat": "Chuyên khoa Nội Tổng Quát",
    "san-phu-khoa": "Chuyên khoa Sản Phụ Khoa",
    "tai-mui-hong": "Chuyên khoa Tai Mũi Họng",
    "rang-ham-mat": "Chuyên khoa Răng Hàm Mặt",
    "mat": "Chuyên khoa Mắt",
    "da-lieu": "Chuyên khoa Da Liễu",
    "tim-mach": "Chuyên khoa Tim Mạch",
    "co-xuong-khop": "Chuyên khoa Cơ Xương Khớp",
    "than-kinh": "Chuyên khoa Thần Kinh",
    "nhi": "Chuyên khoa Nhi",
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
  // PHẦN 3: LOGIC TỰ ĐỘNG ĐỔI BÁC SĨ THEO KHOA (ĐÃ ĐƯA VÀO TRONG EVENT)
  // ========================================================
  const doctorsByKhoa = {
    "noi-tong-quat": [
      { id: "bs-tuan", name: "ThS. BS. Nguyễn Minh Tuấn" },
      { id: "bs-lan", name: "BSCKI. Võ Thị Xuân Lan" },
    ],
    nhi: [
      { id: "bs-hong", name: "BSCKII. Lê Thị Hồng" },
      { id: "bs-duc", name: "ThS. BS. Phạm Minh Đức" },
    ],
    "tai-mui-hong": [{ id: "bs-huy", name: "BS. Nguyễn Quang Huy" }],
    "rang-ham-mat": [{ id: "bs-nam", name: "Nha sĩ Trịnh Hoàng Nam" }],
    mat: [{ id: "bs-thu", name: "BS. Hoàng Thu Lan" }],
    "da-lieu": [{ id: "bs-anh", name: "ThS. BS. Mai Phương Anh" }],
    "tim-mach": [{ id: "bs-tam", name: "GS. TS. Nguyễn Hoài Tâm" }],
    "co-xuong-khop": [{ id: "bs-dung", name: "BSCKI. Trần Tiến Dũng" }],
    "than-kinh": [{ id: "bs-khoa", name: "ThS. BS. Đăng Đăng Khoa" }],
  };

  const selectKhoa = document.getElementById("select-khoa");
  const selectDoctor = document.getElementById("select-doctor");

  if (selectKhoa && selectDoctor) {
    selectKhoa.addEventListener("change", (e) => {
      const selectedKhoaValue = e.target.value;

      selectDoctor.innerHTML = "";
      if (selectedKhoaValue === "") {
        selectDoctor.innerHTML =
          '<option value="">-- Vui lòng chọn chuyên khoa trước --</option>';
        selectDoctor.disabled = true;
        return;
      }

      const doctors = doctorsByKhoa[selectedKhoaValue];

      if (doctors && doctors.length > 0) {
        selectDoctor.disabled = false;
        selectDoctor.innerHTML =
          '<option value="">-- Chọn bác sĩ phụ trách --</option>';

        doctors.forEach((doc) => {
          const option = document.createElement("option");
          option.value = doc.id;
          option.textContent = doc.name;
          selectDoctor.appendChild(option);
        });
      } else {
        selectDoctor.innerHTML =
          '<option value="">-- Khoa này hiện chưa có lịch bác sĩ --</option>';
        selectDoctor.disabled = true;
      }
    });
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
