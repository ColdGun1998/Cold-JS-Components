//基础轮播
/*
添加左右箭头
添加下侧点击切换的控制条
在鼠标移入轮播区域的时候停止轮播，鼠标离开轮播区域时继续轮播
*/


class coldSwiper {
    constructor(element, options) {
        this.swiper = document.querySelector(element);
        this.autoPlay = options.autoPlay;
        this.initialIndex = options.initialIndex;
        this.interval = options.interval;
        this.initSwiper();
        this.Play();
    }

    initSwiper() {
        this.nowIndex = this.initialIndex;  //当前显示的item序号
        this.controlIndex = 0;
        this.timer = null;
        this.items = [...this.swiper.children];
        this.itemWidth = this.items[0].offsetWidth;
        this.swiperLength = this.items.length;
        this.swiper.classList.add('cold-swiper');
        this.swiper.style.width = `${this.itemWidth}px`;
        this.appendCloneNode();
        this.createItemWrapper();
        this.createArrows();
        this.createControls();
        this.bindEvent();
    }

    createItemWrapper() {
        this.itemsWrapper = this.createAndAddClass('div', 'cold-swiper-items-wrapper');
        this.itemsWrapper.style.transform = `translateX(${-this.itemWidth * this.initialIndex}px)`;
        this.swiper.appendChild(this.itemsWrapper);
        this.items.map(item => {
            this.itemsWrapper.appendChild(item);
            item.classList.add('cold-swiper-item');
        })

    }

    createArrows() {
        this.leftBtn = this.createAndAddClass('div', 'cold-swiper-btn-left');
        this.leftArrow = this.createAndAddClass('img', 'cold-swiper-arrow-left');
        this.leftArrow.src = 'leftArrow.png';
        this.leftBtn.appendChild(this.leftArrow);

        this.rightBtn = this.createAndAddClass('div', 'cold-swiper-btn-right');
        this.rightArrow = this.createAndAddClass('img', 'cold-swiper-arrow-right');
        this.rightArrow.src = 'rightArrow.png';
        this.rightBtn.appendChild(this.rightArrow);

        this.swiper.appendChild(this.leftBtn);
        this.swiper.appendChild(this.rightBtn);
    }

    createControls() {
        this.controls = this.createAndAddClass('div', 'cold-swiper-controls');
        for (let i = 0; i < this.swiperLength; i++) {
            const li = this.createAndAddClass('div', 'cold-swiper-control-item');
            li.innerText = '——'
            if (i == this.initialIndex - 1) {
                li.classList.add('active');
            }
            this.controls.appendChild(li);
        }
        this.swiper.appendChild(this.controls);
    }

    createAndAddClass(tag, className) {
        const element = document.createElement(tag);
        element.classList.add(className);
        return element;
    }



    Play() {
        if (!this.autoPlay) return;
        if (this.timer) return;
        this.timer = setInterval(() => {
            this.nowIndex++;
            this.go(this.nowIndex);
        }, this.interval || 2000)
    }

    go(index) {
        if (index > this.items.length - 1) {
            this.lastToFirst();
        }
        if (index < 0) {
            this.firstToLast();
        }
        this.itemsWrapper.style.transform = `translateX(${-this.itemWidth * this.nowIndex}px)`;
        this.activeControl();
    }


    bindEvent() {
        this.handleArrows();
        this.handleControls();
        this.pause();
        this.swiper.addEventListener('mouseleave', () => {
            this.Play();
            this.leftBtn.classList.remove('is-visible')
            this.rightBtn.classList.remove('is-visible')
        })
    }

    appendCloneNode() {
        const first = this.items[0];
        const last = this.items[this.items.length - 1];
        const firstClone = first.cloneNode(true);
        const lastClone = last.cloneNode(true);
        this.swiper.insertBefore(lastClone, first);
        this.swiper.appendChild(firstClone);
        this.items = [...this.swiper.children];
    }



    lastToFirst() {
        this.itemsWrapper.style.transition = 'none';
        this.nowIndex = 1;
        this.itemsWrapper.style.transform = `translateX(${-this.itemWidth * this.nowIndex}px)`;
        this.nowIndex++;
        this.itemsWrapper.offsetWidth;
        this.itemsWrapper.style.transition = 'all 1s';
    }

    firstToLast() {
        this.itemsWrapper.style.transition = 'none';
        this.nowIndex = this.items.length - 2;
        this.itemsWrapper.style.transform = `translateX(${-this.itemWidth * this.nowIndex}px)`;
        this.nowIndex--;
        this.itemsWrapper.offsetWidth;
        this.itemsWrapper.style.transition = 'all 1s';

    }

    pause() {
        this.swiper.addEventListener('mouseenter', () => {
            clearInterval(this.timer);
            this.timer = null;
            this.leftBtn.classList.add('is-visible')
            this.rightBtn.classList.add('is-visible')
        })
    }


    handleArrows() {

        this.leftBtn.addEventListener('click', this.throttle(() => {
            this.nowIndex--;
            this.go(this.nowIndex);
        }, 1000)
        );
        this.rightBtn.addEventListener('click', this.throttle(() => {
            this.nowIndex++;
            this.go(this.nowIndex);
        }, 1000))
    }

    handleControls() {
        for (let i = 0; i < this.swiperLength; i++) {
            this.controls.children[i].addEventListener('click', () => {
                this.calSwiperIndex(i);
                this.go(this.nowIndex);
            })
        }
    }

    calSwiperIndex(i) {
        if (i == 0) {
            this.nowIndex = 1;
        } else {
            this.nowIndex = i + 1;
        }
    }

    activeControl() {
        this.calcControlIndex();
        for (let i = 0; i < this.swiperLength; i++) {
            this.controls.children[i].classList.remove('active');
        }
        this.controls.children[this.controlIndex].classList.add('active');

    }

    calcControlIndex() {
        if (this.nowIndex == this.items.length - 1 || this.nowIndex == 1) {
            this.controlIndex = 0;
        } else if (this.nowIndex == 0) {
            this.controlIndex = this.swiperLength - 1;
        } else {
            this.controlIndex = this.nowIndex - 1;
        }
    }

    //节流函数-时间戳方案
    throttle(func, ms = 200) {
        let prev = Date.now();
        return function (...args) {
            let now = Date.now()
            if (now - prev >= ms) {
                func()
                prev = now
            }
        }
    }


}