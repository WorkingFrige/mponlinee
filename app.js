const changeProgramBtns = document.querySelectorAll('.prices__btns .prices__btns-item'),
    nav = document.getElementById('nav'),
    burger = document.getElementById('burger'),
    burgerBg = document.getElementById('burgerBg'),
    links = document.querySelectorAll('a[data-goto]'),
    openPopup = document.querySelectorAll('[data-open]'),
    forms = document.querySelectorAll('form'),
    closePopup = document.querySelectorAll('.popup__close'),
    popupProgramName = document.getElementById('popupProgramName'),
    successPopup = document.querySelector('.popup.success');

changeProgramBtns.forEach(changeProgramBtn => {
    changeProgramBtn.addEventListener('click', () => {
        changeProgramBtns.forEach(changeProgramBtn => {
            changeProgramBtn.classList.remove('active')
            document.getElementById(changeProgramBtn.dataset.program).classList.remove('active')
        });

        changeProgramBtn.classList.add('active');
        document.getElementById(changeProgramBtn.dataset.program).classList.add('active');
    });
});

const casesSwiper = new Swiper('.cases .swiper', {
    direction: 'horizontal',
    centeredSlides: true,
    spaceBetween: 50,
    autoHeight: true,

    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});

burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    nav.classList.toggle('active');
    document.body.classList.toggle('lock');
});

burgerBg.addEventListener('click', () => {
    burger.classList.remove('active');
    nav.classList.remove('active');
    document.body.classList.remove('lock');
});

if (links.length > 0) {
    links.forEach(menuLink => {
        menuLink.addEventListener("click", onMenuLinkClick)
    });

    function onMenuLinkClick(e) {
        const menuLink = e.target;
        if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
            const gotoBlock = document.querySelector(menuLink.dataset.goto);
            const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset - document.querySelector('header').offsetHeight;

            window.scrollTo({
                top: gotoBlockValue,
                behavior: "smooth"
            });
            e.preventDefault();

            document.body.classList.remove('lock');
            nav.classList.remove('active');
            burger.classList.remove('active');
        }
    }
}

forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
        console.log('Отправка формы')
        e.preventDefault();
        form.querySelector('input[name="phone"]').style.borderColor = '#E2E9F3';
        let formPhone = 'неизвестен';
        let formName = 'неизвестно';
        let formTariff = 'неизвестен';

        if (form.querySelector('input[name="phone"]').value.includes('_')) {
            form.querySelector('input[name="phone"]').style.borderColor = 'red';
            return;
        } else {
            formPhone = form.querySelector('input[name="phone"]').value;
        }

        if (form.querySelector('input[name="name"]')) formName = form.querySelector('input[name="name"]').value;

        if (form.classList.contains('buy__form')) {
            formTariff = document.querySelector('#popupProgramName span').textContent;
        }


        var xhr = new XMLHttpRequest();
        // Определяем метод и URL для отправки данных на сервер
        xhr.open("POST", "https://mponlinee.pro/wp-content/themes/mponlinee/scripts/sendmail.php", true);

        // Определяем заголовки запроса
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        console.log(formPhone, formName, formTariff)

        xhr.send("phone=" + encodeURIComponent(formPhone)
            + "&name=" + encodeURIComponent(formName) + "&tariff=" + encodeURIComponent(formTariff));

        // Обработчик события изменения состояния запроса
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    form.reset();
                    document.querySelectorAll('.popup').forEach((item) => {
                        item.classList.remove('active');
                        document.body.classList.remove('lock');
                        burger.classList.remove('active');
                        nav.classList.remove('active');
                    });
                    successPopup.classList.add("active");
                    document.body.classList.add('lock');
                } else {
                    alert("Произошла ошибка при отправке данных. Попробуйте позднее");
                }
            }
        };

    });
});

openPopup.forEach((link) => {
    link.addEventListener('click', () => {
        document.querySelector(link.dataset.open).classList.add('active');
        document.body.classList.add('lock');

        if (link.dataset.open === '.buy') {
            popupProgramName.querySelector('span').textContent = document.querySelector('.prices__btns .prices__btns-item.active').textContent;
        }
    });
});

closePopup.forEach((btn) => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.popup').forEach((item) => {
            item.classList.remove('active');
            document.body.classList.remove('lock');
            burger.classList.remove('active');
            nav.classList.remove('active');
            document.body.classList.remove('lock');
        });
    });
});

const selector = document.querySelectorAll('input[name="phone"]');

const im = new Inputmask("+7 (999) 999-99-99");
selector.forEach((phone) => im.mask(phone));
