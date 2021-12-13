'use strict';

//Tabs

window.addEventListener('DOMContentLoaded', () => {
    const tabsContent = document.querySelectorAll('.tabcontent'),
        tabHeader = document.querySelectorAll('.tabheader__item'),
        tabsParent = document.querySelector('.tabheader__items');

    let hideTabs = () => {
        tabsContent.forEach((pict) => {
            pict.classList.remove('show', 'animTab');
            pict.classList.add('hide');
        });
        tabHeader.forEach((dietName) => {
            dietName.classList.remove('tabheader__item_active');
        });
    };

    let showTab = (i = 0) => {
        tabsContent[i].classList.remove('hide');
        tabsContent[i].classList.add('show', 'animTab');
        tabHeader[i].classList.add('tabheader__item_active');
    };

    let toggletabs = () => {
        tabsParent.addEventListener('click', (event) => {
            const target = event.target;
            if (target && target.classList.contains('tabheader__item')) {
                tabHeader.forEach((item, ind) => {
                    if (target == item) {
                        hideTabs();
                        showTab(ind);
                    }
                });
            }
        });
    };
    hideTabs();
    showTab();
    toggletabs();

    //Timer

    let deadline = '2021-12-11';

    const getTimeRemaining = (endtime) => {
        let total = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor(total / (1000 * 60 * 60 * 24)),
            hours = Math.floor(((total / (1000 * 60 * 60)) % 24)),
            minutes = Math.floor((total / (1000 * 60)) % 60),
            seconds = Math.floor((total / 1000) % 60);
        return {
            'total': total,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds,
        };
    };

    const zeroPut = (num) => {
        if (num < 10 && num >= 0) {
            return `0${num}`;
        } else {
            return num;
        }
    };

    const changeTimer = (selector, endtime) => {
        const parentTime = document.querySelector(selector),
            days = parentTime.querySelector('#days'),
            hours = parentTime.querySelector('#hours'),
            minutes = parentTime.querySelector('#minutes'),
            seconds = parentTime.querySelector('#seconds'),
            workTimer = setInterval(updateClock, 1000);
        updateClock(); // for this and previos string we use function declaretion below

        function updateClock() {
            const timeDB = getTimeRemaining(endtime);
            days.innerHTML = zeroPut(timeDB.days);
            hours.innerHTML = zeroPut(timeDB.hours);
            minutes.innerHTML = zeroPut(timeDB.minutes);
            seconds.innerHTML = zeroPut(timeDB.seconds);
            if (timeDB.total <= 0) {
                clearInterval(workTimer);
            }
        }

    };

    changeTimer('.timer', deadline); // call main function



    //modal window
    const openBtn = document.querySelectorAll('[data-open]'),
        modal = document.querySelector('.modal');

    const openModal = () => {
        modal.classList.remove('hide');
        modal.classList.add('show');
        //modal.classList.toggle('show');
        document.body.style.overflow = 'hidden';
        clearInterval(checkTimer);
    };

    openBtn.forEach((btn) => {
        btn.addEventListener('click', openModal);
    });

    const closeModal = () => {
        modal.classList.remove('show');
        modal.classList.add('hide');
        //modal.classList.toggle('show');
        document.body.style.overflow = '';
    };

    const closePossibilities = () => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal || event.target.getAttribute('data-close') == '') {
                closeModal();
            }
        });
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Escape' && modal.classList.contains('show')) {
                closeModal();
            }
        });
    };

    const userCheckout = () => {
        const doc = document.documentElement;
        if (window.pageYOffset + doc.clientHeight >= doc.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', userCheckout);
        }
    };

    const checkTimer = setTimeout(openModal, 50000);
    window.addEventListener('scroll', userCheckout);
    closePossibilities();

    //Menu cards
    class MenuItemCreate {
        constructor(pict, alt, subtitle, descr, price, parentSelector, ...classes) {
            this.container = document.querySelector('.container');
            this.parent = document.querySelector(parentSelector);
            this.pict = pict;
            this.alt = alt;
            this.subtitle = subtitle;
            this.descr = descr;
            this.price = price;
            this.convert = 27;
            this.classes = classes;
            this.changeToUAH();
            this.createNewElem();
        }
        changeToUAH() {
            this.price = this.price * this.convert;
        }
        createNewElem() {
            const divBox = document.createElement('div');
            if (this.classes.length === 0) {
                this.element = 'menu__item';
                divBox.classList.add(this.element);
            } else {
                this.classes.forEach(className => {
                    divBox.classList.add(className);
                });
            }

            divBox.innerHTML += `
            <img src=${this.pict} alt=${this.alt}>
            <h3 class="menu__item-subtitle">${this.subtitle}</h3>
            <div class="menu__item-descr">${this.descr}</div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price">
                <div class="menu__item-cost">Цена:</div>
                <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
            </div>`;
            this.parent.append(divBox);
        }

    }

    const vegDescr = `Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих
    овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной
    ценой и высоким качеством!`;

    const eliteDescr = `В меню “Премиум” мы используем не только красивый дизайн упаковки, но
    и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода
    в ресторан!`;

    const postDescr = `Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие
    продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное
    количество белков за счет тофу и импортных вегетарианских стейков.`;

    const veg = new MenuItemCreate(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        vegDescr,
        9,
        '.menu .container',
        'menu__item',
        'big'
    );

    const elite = new MenuItemCreate(
        "img/tabs/elite.jpg",
        "elite",
        'Меню "Премиум"',
        eliteDescr,
        20,
        '.menu .container',
        'menu__item'
    );

    const post = new MenuItemCreate(
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное"',
        postDescr,
        16,
        '.menu .container',
        'menu__item'
    );

    //Forms

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо. Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так',
    };

    const postData = (form) => {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            let statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.classList.add('spinner');
            form.insertAdjacentElement('afterend', statusMessage);

            const request = new XMLHttpRequest();
            request.open('POST', 'server.php');
            request.setRequestHeader('Content-size', 'application/json; charset=utf8');
            const formData = new FormData(form);

            const objData = {};
            formData.forEach((value, key) => {
                objData[key] = value;
            });
            const json = JSON.stringify(objData);
            request.send(json);

            request.addEventListener('load', () => {
                if (request.status == 200) {
                    console.log(request.response);
                    showThanksModal(message.success);
                    form.reset();
                    statusMessage.remove();
                } else {
                    showThanksModal(message.failure);
                }

            });
        });
    };

    const sendMessage = () => {
        forms.forEach((item) => {
            postData(item);
        });
    };
    sendMessage();


    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');
        const modal = document.querySelector('.modal');
        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;
        modal.append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);

    }

});