
class coldSwiper {
    constructor(element, options = {}) {
        Object.assign(this, {
            width: 500,//Swiper宽度
            height: 200,//Swiper高度
            initialIndex: 1, //初始状态激活的幻灯片索引
            autoPlay: true, //是否自动切换
            interval: 1500, //自动切换的时间间隔
            type: 'card',   //Swiper类型
        }, options);
        this.swiper = document.querySelector(element);
        this.initSwiper();
        this.play();
    }

    initSwiper() {
        this.nowIndex = this.initialIndex;  //当前显示的item序号
        this.controlIndex = 0;
        this.timer = null;
        this.items = [...this.swiper.children];
        this.margin = 20;
        this.diff = this.width * .6 - (this.width * .4 - 2 * this.margin) / 2;
        this.swiperLength = this.items.length;
        this.swiper.classList.add('cold-swiper');
        this.swiper.style.width = `${this.width}px`;
        this.swiper.style.height = `${this.height}px`;
        this.appendCloneNode();
        this.createItemWrapper();
        this.createArrows();
        this.createControls();
        this.bindEvent();
    }

    createItemWrapper() {
        this.itemsWrapper = this.createAndAddClass('div', 'cold-swiper-items-wrapper');
        this.itemsWrapper.style.left = `${-((this.width * .6 + this.margin) * this.initialIndex + this.diff)}px`;
        this.items[this.initialIndex + 1].classList.add('enlarge');
        this.swiper.appendChild(this.itemsWrapper);
        this.items.map(item => {
            this.itemsWrapper.appendChild(item);
            item.classList.add('cold-swiper-item');
            item.style.width = `${this.width * 0.6}px`;
            item.style.height = `${this.height * 0.6}px`;
            item.style.lineHeight = `${this.height * 0.6}px`;
        })
    }

    createArrows() {
        this.leftBtn = this.createAndAddClass('div', 'cold-swiper-btn-left');
        this.leftArrow = this.createAndAddClass('i', 'cold-swiper-arrow-left');
        this.leftBtn.appendChild(this.leftArrow);

        this.rightBtn = this.createAndAddClass('div', 'cold-swiper-btn-right');
        this.rightArrow = this.createAndAddClass('i', 'cold-swiper-arrow-right');
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



    play() {
        if (!this.autoPlay) return;
        if (this.timer) return;
        this.timer = setInterval(() => {
            this.nowIndex++;
            this.go(this.nowIndex);
        }, this.interval || 2000)
    }

    go(index) {
        if (index > this.items.length - 3) {
            this.lastToFirst();
        }
        if (index < 0) {
            this.firstToLast();
        }


        for (let i = 0; i < this.items.length; i++) {
            if (i == this.nowIndex + 1) {
                this.items[i].classList.add('enlarge');
            } else {
                this.items[i].classList.remove('enlarge');
            }
        }

        this.itemsWrapper.style.left = `${-((this.width * .6 + this.margin) * this.nowIndex + this.diff)}px`;
        if (this.nowIndex == this.items.length - 3) {
            this.items[2].classList.add('enlarge');
        }

        if (this.nowIndex == 0) {
            this.items[this.items.length - 3].classList.add('enlarge');
        }

        // this.items[this.nowIndex + 1].classList.add('enlarge');
        // this.items[this.nowIndex].classList.remove('enlarge');

        // this.items[this.nowIndex + 2].classList.toggle('enlarge');
        // this.items[this.nowIndex + 1].classList.toggle('enlarge');

        this.activeControl();

    }


    bindEvent() {
        this.handleArrows();
        this.handleControls();
        this.pause();
        this.swiper.addEventListener('mouseleave', () => {
            this.play();
            this.leftBtn.classList.remove('is-visible')
            this.rightBtn.classList.remove('is-visible')
        })
    }

    appendCloneNode() {
        const first = this.items[0];
        const second = this.items[1];
        const last = this.items[this.items.length - 1];
        const secondToLast = this.items[this.items.length - 2];
        const firstClone = first.cloneNode(true);
        const secondClone = second.cloneNode(true);
        const lastClone = last.cloneNode(true);
        const secondToLastClone = secondToLast.cloneNode(true);
        this.swiper.insertBefore(lastClone, first);
        this.swiper.insertBefore(secondToLastClone, lastClone);
        this.swiper.appendChild(firstClone);
        this.swiper.appendChild(secondClone);
        this.items = [...this.swiper.children];
    }



    lastToFirst() {
        this.nowIndex = 1;
        this.itemsWrapper.style.transition = 'none';
        this.itemsWrapper.style.left = `${-((this.width * .6 + this.margin) * this.nowIndex + this.diff)}px`;
        this.nowIndex++;
        this.itemsWrapper.offsetWidth;
        this.itemsWrapper.style.transition = 'left 600ms ease-in-out';
        this.items[this.items.length - 2].classList.remove('enlarge');

    }

    firstToLast() {
        this.nowIndex = this.items.length - 4;
        this.itemsWrapper.style.transition = 'none';
        this.itemsWrapper.style.left = `${-((this.width * .6 + this.margin) * this.nowIndex + this.diff)}px`;
        this.nowIndex--;
        this.itemsWrapper.offsetWidth;
        this.itemsWrapper.style.transition = 'left 600ms ease-in-out';
        this.items[1].classList.remove('enlarge');
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
        }, 500)
        );
        this.rightBtn.addEventListener('click', this.throttle(() => {
            this.nowIndex++;
            this.go(this.nowIndex);
        }, 500))
    }

    handleControls() {
        for (let i = 0; i < this.swiperLength; i++) {
            this.controls.children[i].addEventListener('click', () => {
                this.calSwiperIndex(i);
                this.go(this.nowIndex);
            }
            )
        }
    }

    calSwiperIndex(i) {
        this.nowIndex = i + 1;
    }

    activeControl() {
        this.calcControlIndex();
        for (let i = 0; i < this.swiperLength; i++) {
            this.controls.children[i].classList.remove('active');
        }
        this.controls.children[this.controlIndex].classList.add('active');

    }

    calcControlIndex() {
        if (this.nowIndex == this.items.length - 3) {
            this.controlIndex = 0;
        } else if (this.nowIndex == 0) {
            this.controlIndex = this.swiperLength - 1;
        } else {
            this.controlIndex = this.nowIndex - 1;
        }
    }

    //节流函数-时间戳方案
    throttle(func, ms = 100) {
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