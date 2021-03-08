window.onload = () => {
    el = document.querySelector('.hi');
    console.log(el)
    el.classList.add('test');
    // console.log(el.getBoundingClientRect().height);
    el.style.height = '10px';
    el.style.width = '100px';
    console.log(el.getBoundingClientRect().height);


}