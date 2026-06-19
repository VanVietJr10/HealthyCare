document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname;
  const menuLinks = document.querySelectorAll(".header-right-menu a");
  const urlParams = new URLSearchParams(window.location.search);

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

  const selectKhoa = document.getElementById("select-khoa");
  const selectDoctor = document.getElementById("select-doctor");

  async function renderDoctorsDynamic(khoaValue, defaultDoctorName = "") {
    if (!selectDoctor) return;

    selectDoctor.innerHTML = "";

    if (khoaValue === "") {
      selectDoctor.innerHTML =
        '<option value="">-- Vui lòng chọn chuyên khoa trước --</option>';
      selectDoctor.disabled = true;
      return;
    }

    try {
      const response = await fetch("../layout/doctors.html");
      const htmlText = await response.text();

      const parser = new DOMParser();
      const docHTML = parser.parseFromString(htmlText, "text/html");

      const realDoctorCards = docHTML.querySelectorAll(
        `.doctor-card[data-khoa="${khoaValue}"]`,
      );

      if (realDoctorCards.length > 0) {
        selectDoctor.disabled = false;
        selectDoctor.innerHTML =
          '<option value="">-- Chọn bác sĩ phụ trách --</option>';

        realDoctorCards.forEach((card) => {
          const nameElement =
            card.querySelector("h4") ||
            card.querySelector("h3") ||
            card.querySelector(".doctor-name");
          const docName = nameElement ? nameElement.textContent.trim() : "";

          if (docName) {
            const option = document.createElement("option");
            option.value = docName;
            option.textContent = docName;

            if (docName.toLowerCase() === defaultDoctorName.toLowerCase()) {
              option.selected = true;
            }
            selectDoctor.appendChild(option);
          }
        });
      } else {
        selectDoctor.innerHTML =
          '<option value="">-- Khoa này hiện chưa có lịch bác sĩ --</option>';
        selectDoctor.disabled = true;
      }
    } catch (error) {
      console.error("Lỗi khi quét file HTML bác sĩ:", error);
      selectDoctor.innerHTML =
        '<option value="">-- Không thể tải danh sách bác sĩ --</option>';
      selectDoctor.disabled = true;
    }
  }

  if (selectKhoa && selectDoctor) {
    selectKhoa.addEventListener("change", (e) => {
      renderDoctorsDynamic(e.target.value);
    });
  }

  const paramDoctorName = urlParams.get("doctor");
  const paramSpecialty = urlParams.get("specialty");

  if (paramSpecialty && selectKhoa) {
    selectKhoa.value = paramSpecialty;
    renderDoctorsDynamic(paramSpecialty, paramDoctorName);
  }

  const bookingButtons = document.querySelectorAll(".doctor-card button");
  bookingButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const card = e.target.closest(".doctor-card");
      if (card) {
        const khoa = card.getAttribute("data-khoa");
        const nameElement =
          card.querySelector("h4") ||
          card.querySelector("h3") ||
          card.querySelector(".doctor-name");
        const docName = nameElement ? nameElement.textContent.trim() : "";

        if (khoa && docName) {
          window.location.href = `../book/book.html?specialty=${khoa}&doctor=${encodeURIComponent(docName)}`;
        } else if (khoa) {
          window.location.href = `../book/book.html?specialty=${khoa}`;
        }
      }
    });
  });

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
