const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const search = document.getElementById('search');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
const notFound = document.getElementById('not-found')
    // selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
    const img = images.hits
    imagesArea.style.display = 'block';
    gallery.innerHTML = '';
    // show gallery title
    galleryHeader.style.display = 'flex';

    if (img == 0) {
        const result = `<h2 class="text-center mt-5 text-danger">Your Result Not Found</h2>`
        notFound.innerHTML = result
    } else {
        img.forEach(image => {
            let div = document.createElement('div');
            div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
            div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
            gallery.appendChild(div)
        })
        notFound.innerHTML = ''
    }

    // show spiner
    showSpiner(false)
}

const getImages = (query) => {
    fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
        .then(response => response.json())
        .then(data => showImages(data))
        .catch(err => erorMessage(err))
}

let slideIndex = 0;
const selectItem = (event, img) => {
    let element = event.target;
    element.classList.toggle('added');

    let item = sliders.indexOf(img);
    console.log(item)
    if (item === -1) {
        sliders.push(img);
    } else if (item > -1) {
        sliders.splice(item, 1)
    }

}
var timer
const createSlider = () => {
    // check slider image length
    if (sliders.length < 2) {
        alert('Select at least 2 image.')
        return;
    }
    // crate slider previous next area
    sliderContainer.innerHTML = '';
    const prevNext = document.createElement('div');
    prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
    prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

    sliderContainer.appendChild(prevNext)
    document.querySelector('.main').style.display = 'block';
    // hide image aria
    imagesArea.style.display = 'none';
    let duration = document.getElementById('duration').value || 1000;

    sliders.forEach(slide => {
        console.log(slide)
        let item = document.createElement('div')
        item.className = "slider-item";
        item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
        sliderContainer.appendChild(item)
    })
    changeSlide(0)
    if (duration > 0) {
        timer = setInterval(function() {
            slideIndex++;
            changeSlide(slideIndex);
        }, duration);
    } else {
        alert('duration can not be minus value. we give you a default value.(1.2s)')

        timer = setInterval(function() {
            slideIndex++;
            changeSlide(slideIndex);
        }, 1200)
    }
}

// change slider index 
const changeItem = index => {
    changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {


    const items = document.querySelectorAll('.slider-item');
    if (index < 0) {
        console.log(index)
        slideIndex = items.length - 1
        index = slideIndex;
    };

    if (index >= items.length) {
        index = 0;
        slideIndex = 0;
    }

    items.forEach(item => {
        item.style.display = "none"
    })

    items[index].style.display = "block"
}

searchBtn.addEventListener('click', function() {

    document.getElementById('duration').value = ''

    document.querySelector('.main').style.display = 'none';
    clearInterval(timer);
    getImages(search.value)
    sliders.length = 0;

    // show spiner
    showSpiner(true)

})

sliderBtn.addEventListener('click', function() {
    createSlider()
})


// PRESS ENTER KEY TO GET RESULT IN DISPLAY
search.addEventListener('keypress', (e) => {
    if (e.code === 'Enter') {
        searchBtn.click()
    }
})


// show eror message
const erorMessage = (eror) => {
    let errorMsgCode = ''
    const erorMsgContaienr = document.querySelector('#eror_msg')
    errorMsgCode = `<h2 class='text-danger text-center mt-5'>Something went wrong, please try again later.</h2>`
    erorMsgContaienr.innerHTML = errorMsgCode
    showSpiner(false)
}

// show spiner
const showSpiner = (isAddClass) => {
    const spinerContainer = document.querySelector('#spiner')
    const spinerCode = `  <div class="d-flex">
                            <div class="spinner-border text-success" role="status">
                                <span class="visually-hidden"></span>
                            </div>
                         </div>`
    spinerContainer.innerHTML = spinerCode;

    if (isAddClass == true) {
        spinerContainer.classList.add('d-block')
    } else if (isAddClass == false) {
        spinerContainer.classList.remove('d-block')
    }

}