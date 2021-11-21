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
    }

    let showTab = (i = 0) => {
        tabsContent[i].classList.remove('hide');
        tabsContent[i].classList.add('show', 'animTab');
        tabHeader[i].classList.add('tabheader__item_active');
    }

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
    }
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
        }
    };

    const zeroPut = (num) => {
        if (num < 10 && num >= 0) {
            return `0${num}`
        } else {
            return num
        }
    }

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

    }

    changeTimer('.timer', deadline); // call main function



    //modal window
    const openBtn = document.querySelectorAll('[data-open]'),
        closeBtn = document.querySelector('.modal__close'),
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
            if (event.target == modal) {
                closeModal();
            }
        });
        document.addEventListener('keydown', (event) => {
            if (event.code = 'Escape' && modal.classList.contains('show')) {
                closeModal();
            }
        });
        closeBtn.addEventListener('click', () => {
            closeModal();
        });
    };

    const userCheckout = () => {
        const doc = document.documentElement;
        if (window.pageYOffset + doc.clientHeight >= doc.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', userCheckout);
        }
    }

    const checkTimer = setTimeout(openModal, 5000);
    window.addEventListener('scroll', userCheckout);
    closePossibilities();
});