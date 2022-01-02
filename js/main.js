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

    let deadline = '2022-12-11';

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
            this.parent = document.querySelector(parentSelector);
            this.pict = pict;
            this.alt = alt;
            this.subtitle = subtitle;
            this.descr = descr;
            this.price = price;
            this.convert = 27;
            this.classes = classes;
            this.changeToUAH();
        }
        changeToUAH() {
            this.price = this.price * this.convert;
        }
        createNewElem() {
            const divBox = document.createElement('div');
            if (this.classes.length === 0) {
                this.classes = 'menu__item';
                divBox.classList.add(this.classes);
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
    const getMenu = async (url) => {
        const getReq = await fetch(url);
        if (!getReq.ok) {
            throw new Error(`Could not fetch ${url}, request status: ${getReq.status}`);
        }
        return await getReq.json();
    };

    getMenu('http://localhost:3000/menu').then(
        (data) => {
            data.forEach(({
                img,
                altimg,
                title,
                descr,
                price
            }) => {
                new MenuItemCreate(img, altimg, title, descr, price, '.menu .container').createNewElem();
            });
        });



    //Forms

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо. Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так',
    };

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        });
        return await res.json();
    };

    const bindPostData = (form) => {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            let statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.classList.add('spinner');
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);
            const objData = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', objData).then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            }).catch(() => {
                showThanksModal(message.failure);
            }).finally(() => {
                form.reset();
            });

        });
    };


    const sendMessage = () => {
        forms.forEach((item) => {
            bindPostData(item);
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