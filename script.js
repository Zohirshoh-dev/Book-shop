let carouselSrollTimer;
let parent = document.querySelector('body');
let element = document.createElement('div');
element.classList.add('body__content');
parent.prepend(element);


addChild('.body__content', 'header', 'header');
addChild('.header', 'div', 'header__content');
addChild('.header__content', 'h1', 'header__caption', 'Welcome to amazing book shop!');
addChild('.header__content', 'input', 'header__search-input');
setAttribute('.header__search-input', 'type', 'search');
setAttribute('.header__search-input', 'placeholder', 'Search...');
document.querySelector('.header__search-input').oninput = searchBooks;


addChild('.body__content', 'main', 'main');
addChild('.main', 'div', 'main__content');
addChild('.main__content', 'div', 'catalogue');
addChild('.catalogue', 'div', 'catalogue__content');
addChild('.catalogue__content', 'h2', 'catalogue__caption section-caption', 'Book Catalog');
addChild('.catalogue__content', 'div', 'catalogue__list');
addChild('.main__content', 'div', 'bag-wrap');
addChild('.bag-wrap', 'div', 'bag');
addChild('.bag', 'div', 'bag__content');
addChild('.bag__content', 'h2', 'bag__caption section-caption', 'Your Bag');
addChild('.bag__content', 'div', 'bag__list-wrap');
addChild('.bag__list-wrap', 'div', 'bag__list');
setAttribute('.bag__list', 'id', 'carousel');
addChild('.bag__list-wrap', 'button', 'bag__arrow bag__arrow_left');
setAttribute('.bag__arrow_left', 'id', 'carousel_prev');
addChild('.bag__list-wrap', 'button', 'bag__arrow bag__arrow_right');
setAttribute('.bag__arrow_right', 'id', 'carousel_next');
document.querySelector('.bag__list-wrap').addEventListener('click', carouselClick);
document.querySelector('.bag__list').addEventListener('scroll', carouselScroll);
addChild('.bag__content', 'div', 'bag__total price');
addChild('.bag__total', 'div', 'price__caption', 'Total:');
addChild('.bag__total', 'div', 'price__value', '0');
setAttribute('.price__value', 'id', 'total-value');
addChild('.bag__content', 'button', 'button button_confirm-order bag__confirm-button', 'Confirm Order');
element = document.querySelector('.bag__confirm-button');
element.setAttribute('disabled', '');
element.addEventListener('click', () => location.href = 'pages/confirm_order/index.html')

addChild('.body__content', 'footer', 'footer');
addChild('.footer', 'div', 'footer__content');

addChild('.footer__content', 'a', 'footer__github-logo');
document.querySelector('.footer__github-logo').setAttribute('href', 'https://media.tenor.com/64_OjwGF3R0AAAAM/dataroll-data.gif');
addChild('.footer__github-logo', 'img', 'footer__github-img');
document.querySelector('.footer__github-img').setAttribute('src', 'images/logo-github.png');

addChild('.footer__content', 'div', 'footer__copyright', '© 11.2022 Oleksandr Shyhyda');

addChild('.footer__content', 'a', 'footer__rs-logo');
document.querySelector('.footer__rs-logo').setAttribute('href', 'https://rs.school/');
addChild('.footer__rs-logo', 'img', 'footer__rs-img');
document.querySelector('.footer__rs-img').setAttribute('src', 'images/logo-rsschool.png');

document.querySelector('.bag__confirm-button').setAttribute('disabled', '');

enableScroll();

let books = [];
let bag = {
    books: [],
    total: 0,
    addBookToBag(index, amount) {
        if(this.books.findIndex(v => v.index == index) >= 0)
            return;
        let book = document.querySelector(`.book[data-index='${index}']`).cloneNode(true);
        book.classList.remove('book_in-catalogue');
        book.classList.add('book_in-bag');
        book.querySelector('.close-button').onclick = (event) => this.removeBookFromBag(event);
        book.querySelectorAll('.button_spin').forEach(spin => spin.onclick = changeAmount);
        book.querySelector('.book__amount-number').value = amount;
        if(amount > 1)
            book.querySelector('.book__amount-button_minus').removeAttribute('disabled');
        document.querySelector('.bag__list').append(book);
        this.books.push({'index': index, 'amount': amount});
        this.setTotal();
        carouselScrollToEnd();
    },

    removeBookFromBag(event) {
        let book = event.currentTarget.closest('.book');
        let index = book.dataset.index;
        this.books.splice(this.books.findIndex(v => v.index == index), 1);
        book.remove();
        this.setTotal();
        carouselSetControls();
    },

    setTotal() {
        this.total = this.books.reduce((sum, v, i) => sum + books[v.index].price * v.amount, 0) || 0;
        document.querySelector('.bag__total .price__value').innerHTML = this.total;
        const button = document.querySelector('.bag__confirm-button');
        this.total == 0 ? button.setAttribute("disabled", "") : button.removeAttribute("disabled");
        localStorage.bag = JSON.stringify(this.books);
    },

    count() {
        return this.books.length;
    },

    increaseAmount(index) {
        this.books[this.books.findIndex(v => v.index == index)].amount++;
        this.setTotal();
    },

    decreaseAmount(index) {
        this.books[this.books.findIndex(v => v.index == index)].amount--;
        this.setTotal();
    },
};

fetch('books.json').then(response => response.json()).then(data => {
    books = data;
    if(localStorage.booksRatings) {
        const ratings = JSON.parse(localStorage.booksRatings);
        if(Array.isArray(ratings))
            books.forEach((book, index) => book.rating = ratings[index]);
    }
    addBooksToCatalogue();
    if(localStorage.bag) {
        const bagItems = JSON.parse(localStorage.bag);
        if(Array.isArray(bagItems))
            bagItems.forEach(book => bag.addBookToBag(book.index, book.amount));
    }
});



function onWindowScroll(event) {
    const bag = document.querySelector('.bag');
    if(window.pageYOffset >= document.querySelector('.header').clientHeight + parseInt(getComputedStyle(document.querySelector('.main__content')).paddingTop)) {
        bag.classList.add('bag_fixed');
    } else {
        bag.classList.remove('bag_fixed');
    }
    if(window.innerHeight + window.scrollY >= document.body.offsetHeight - document.querySelector('.footer').clientHeight) {
        const height = document.body.offsetHeight - window.scrollY - document.querySelector('.footer').clientHeight + 'px';
        bag.style.minHeight = bag.style.height = height;
    } else {
        bag.style.minHeight = bag.style.height = '';
    }
}

function carouselClick(event) {
    const width = carousel.clientWidth;
    if(carousel.scrollLeft % width != 0)
        return;
    switch(event.target.id) {
    case 'carousel_next':
        carousel.scrollBy(width, 0);
        break;
    case 'carousel_prev':
        carousel.scrollBy(-width, 0);
        break;
    }
}

function carouselScroll(event) {
    clearTimeout(carouselSrollTimer);
    carouselSrollTimer = setTimeout(() => {
        const width = carousel.clientWidth;
        if(carousel.scrollLeft % width == 0)
            return;
        carousel.scrollTo(Math.round(carousel.scrollLeft / width) * width, 0);
    }, 300);
    
    if(carousel.scrollLeft == 0) {
        carouselDisableControl(carousel_prev);
        carouselEnableControl(carousel_next);
    } else {
        carouselEnableControl(carousel_prev);
    }
    if(carousel.scrollWidth == carousel.scrollLeft + carousel.clientWidth) {
        carouselDisableControl(carousel_next);
        carouselEnableControl(carousel_prev);
    } else {
        carouselEnableControl(carousel_next);
    }
}

function carouselScrollToEnd() {
    if(bag.count() < 2) {
        carouselHideControls();
        return;
    }
    carousel.scrollBy(carousel.scrollWidth, 0);
    carouselShowControls();
}

function carouselSetControls() {
    const width = carousel.clientWidth;
    if(bag.count() > 1) {
        carouselShowControls();
    } else {
        carouselHideControls();
    }
}

function carouselDisableControl(control) {
    control.setAttribute('disabled', '');
}

function carouselEnableControl(control) {
    control.removeAttribute('disabled');
}

function carouselHideControls() {
    carousel_prev.style.display = 'none';
    carousel_next.style.display = 'none';
}

function carouselShowControls() {
    carousel_prev.style.display = 'block';
    carousel_next.style.display = 'block';
}

function searchBooks(event) {
    const searchText = event.currentTarget.value.toLowerCase();
    document.querySelectorAll('.book_in-catalogue').forEach(book => book.style.display = book.querySelector('.book__title').textContent.toLowerCase().includes(searchText) || book.querySelector('.book__author').textContent.toLowerCase().includes(searchText) ? 'block' : 'none');
}

function addBooksToCatalogue() {
    books.forEach((v, i) => addBookToCatalog(i));
}

function addChild(parent, element, classList, text) {
    element = document.createElement(element);
    element.setAttribute('class', classList);
    if(text) {
        element.innerHTML = text;
    }
    document.querySelector(parent).append(element);
}

function setAttribute(element, name, value) {
    document.querySelector(element).setAttribute(name, value);
}

function createDialog(dialogClass) {
    let dialog = document.createElement('div');
    dialog.setAttribute('class', `dialog ${dialogClass}`);
    let element = document.createElement('div');
    element.setAttribute('class', `${dialogClass}__content`);
    dialog.append(element);
    element = document.createElement('div');
    element.setAttribute('class', 'close-button');
    dialog.querySelector(`.${dialogClass}__content`).append(element);
    return dialog;
}

function showDescriptionPopup(bookIndex) {
    addChild('.body__content', 'div', 'popup');
    addChild('.popup', 'div', 'dialog-wrap');
    document.querySelector('.dialog-wrap').append(createDialog('desc-dialog'));
    addChild('.desc-dialog__content', 'div', 'desc-dialog__book-title', books[bookIndex].title);
    addChild('.desc-dialog__content', 'div', 'desc-dialog__book-desc', books[bookIndex].description);
    disableScroll();
    document.querySelector('.desc-dialog__content .close-button').onclick = (event) => {
        document.querySelector('.dialog-wrap').ontransitionend = (event) => {
            if(document.querySelector('.popup')) {
                document.querySelector('.popup').remove();
                enableScroll();
            }
        }
        document.querySelector('.dialog-wrap').classList.remove('show-dialog');
        document.querySelector('.popup').classList.remove('show-popup');
    };
    document.querySelector('.dialog-wrap').classList.add('show-dialog');
    document.querySelector('.popup').classList.add('show-popup');
}

function addBookToCatalog(index) {
    let currentBook = books[index];
    let book = document.createElement('div');
    book.setAttribute('class', 'book book_in-catalogue');
    book.dataset.index = index;

    let content = document.createElement('div');
    content.classList.add('book__content');
    book.append(content);

    let element = document.createElement('div');
    element.classList.add('book__img-wrap');
    let subElement = document.createElement('img');
    subElement.classList.add('book__img');
    subElement.setAttribute('src',  currentBook.imageLink);
    element.addEventListener('mousedown', bookDragStart);
    element.append(subElement);
    content.append(element);

    element = document.createElement('h3');
    element.classList.add('book__title');
    element.innerHTML = currentBook.title;
    content.append(element);

    element = document.createElement('div');
    element.classList.add('book__author');
    element.innerHTML = currentBook.author;
    content.append(element);

    element = document.createElement('div');
    element.classList.add('book__rating');
    for(let i = 1; i <= 5; i++) {
        subElement = document.createElement('div');
        subElement.classList.add('book__rating-star');
        subElement.setAttribute('data-rate', i);
        if(currentBook.rating < i) {
            subElement.classList.add('book__rating-star_not-active');
        }
        subElement.onclick = (event) => {
            const parent = event.target.parentNode;
            const currentIndex = +event.target.dataset.rate;
            const book = parent.closest('.book');
            if(books[book.dataset.index].rating == currentIndex)
                return;
            books[book.dataset.index].rating = currentIndex;
            for(let i = 0; i < 5; i++) {
                if(i < currentIndex)
                    parent.children[i].classList.remove('book__rating-star_not-active');
                else
                    parent.children[i].classList.add('book__rating-star_not-active');
            }
            localStorage.booksRatings = JSON.stringify(books.map(book => book.rating));
        }
        element.append(subElement);
    }
    content.append(element);

    element = document.createElement('div');
    element.setAttribute('class', 'book__price price');
    subElement = document.createElement('div');
    subElement.classList.add('price__caption');
    subElement.innerHTML = 'Price:';
    element.append(subElement);
    subElement = document.createElement('div');
    subElement.classList.add('price__value');
    subElement.innerHTML = currentBook.price;
    element.append(subElement);
    content.append(element);

    element = document.createElement('div');
    element.setAttribute('class', 'book__amount');
    subElement = document.createElement('button');
    subElement.setAttribute('class', 'button button_spin book__amount-button book__amount-button_minus');
    subElement.setAttribute('data-type', 'minus');
    subElement.setAttribute('disabled', '');
    element.append(subElement);
    subElement = document.createElement('input');
    subElement.setAttribute('type', 'number');
    subElement.setAttribute('min', '1');
    subElement.setAttribute('value', '1');
    subElement.classList.add('book__amount-number');
    element.append(subElement);
    subElement = document.createElement('button');
    subElement.setAttribute('class', 'button button_spin book__amount-button book__amount-button_plus');
    subElement.setAttribute('data-type', 'plus');
    element.append(subElement);
    content.append(element);

    element = document.createElement('div');
    element.setAttribute('class', 'book__buttons');

    subElement = document.createElement('button');
    subElement.setAttribute('class', 'button button_add-to-bag book__add-button');
    subElement.onclick = (event) => bag.addBookToBag(event.target.closest('.book').dataset.index, 1);
    subElement.innerHTML = 'Add to bag';
    element.append(subElement);

    subElement = document.createElement('button');
    subElement.setAttribute('class', 'book__show-more');
    subElement.onclick = () => showDescriptionPopup(index);
    subElement.innerHTML = 'Show more';
    element.append(subElement);
    content.append(element);

    element = document.createElement('button');
    element.setAttribute('class', 'close-button book__close');
    content.append(element);

    document.querySelector('.catalogue__list').append(book);
}

function bookDragStart(event) {
    event.preventDefault();
    let bagActive = false;
    const coverCopy = event.currentTarget.cloneNode(true);
    const bookIndex = event.currentTarget.closest('.book').dataset.index;
    coverCopy.style.position = 'absolute';
    document.querySelector('.main__content').append(coverCopy);
    moveTo(event.currentTarget.getBoundingClientRect().left + window.scrollX, event.currentTarget.getBoundingClientRect().top + window.scrollY);
    const shiftX = event.clientX - event.currentTarget.getBoundingClientRect().left;
    const shiftY = event.clientY - event.currentTarget.getBoundingClientRect().top;
    document.addEventListener('mousemove', bookDrag);
    coverCopy.addEventListener('mouseup', bookDragStop);
    coverCopy.ondragstart = () => false;

    function moveTo(x, y) {
        if(x + parseInt(getComputedStyle(coverCopy).width) <= coverCopy.parentNode.getBoundingClientRect().right + window.scrollX && x >= coverCopy.parentNode.getBoundingClientRect().left + window.scrollX)
            coverCopy.style.left = x + 'px';
        if(y + parseInt(getComputedStyle(coverCopy).height) <= coverCopy.parentNode.getBoundingClientRect().bottom + window.scrollY && y >= coverCopy.parentNode.getBoundingClientRect().top + window.scrollY)
            coverCopy.style.top = y + 'px';
    }

    function bookDrag(event) {
        event.preventDefault();
        moveTo(event.pageX - shiftX, event.pageY - shiftY);
        coverCopy.hidden = true;
        let bagElement;
        if(document.elementFromPoint(event.clientX, event.clientY))
            bagElement = document.elementFromPoint(event.clientX, event.clientY).closest('.bag');
        coverCopy.hidden = false;
        if(bagElement) {
            if(!bagActive) {
                bagActive = true;
                bagElement.classList.add('bag_highlight');
            }
        }
        else {
            if(bagActive) {
                bagActive = false;
                document.querySelector('.bag').classList.remove('bag_highlight');
            }
        }
    }

    function bookDragStop(event) {
        if(bagActive) {
            document.querySelector('.bag').classList.remove('bag_highlight');
            bag.addBookToBag(bookIndex, 1);
        }
        document,querytreator ('')
        document.queryselecter (''
            
        )
        document.removeEventListener('mousemove', bookDrag);
        coverCopy.onmouseup = null;
        coverCopy.remove();
    }
}

function disableScroll() {
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    window.onscroll = () => {
        window.scrollTo(scrollLeft, scrollTop);
    };
}

function enableScroll() {
    window.onscroll = onWindowScroll;
}

function changeAmount(event) {
    const spin = event.target;
    const input = spin.parentNode.querySelector('input');
    const value = +input.value;
    const index = +spin.closest('.book').dataset.index;
    if(spin.dataset.type == 'minus') {
        if(input.value >  1) {
            input.value = value - 1;
            if(input.value == 1)
                spin.setAttribute('disabled', '');
            bag.decreaseAmount(index);
        }
    } else if(spin.dataset.type == 'plus') {
        input.value = value + 1;
        spin.parentNode.querySelector('button[data-type="minus"]').removeAttribute('disabled');
        bag.increaseAmount(index);
    }
}