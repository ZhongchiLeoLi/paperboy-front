var item = document.getElementById('page-content-wrapper');
    
function horizontalScroll(e) {
    if (e.deltaY > 0) item.scrollLeft += 80;
    else item.scrollLeft -= 80;
}

window.addEventListener('wheel', horizontalScroll, false);

$('.backToFront').on('click', function (e) {
    e.preventDefault();
    $('#page-content-wrapper').animate({scrollLeft:0}, 600);
})

$(function() {
    $('.btn-0').each( function(i, elem) {
        $(elem).click(function() {
            var scrollPosition = $('#page-content-wrapper').scrollLeft();
            localStorage.setItem("scrollPosition", scrollPosition);
            console.log(scrollPosition);
        });
    });

    if(localStorage.scrollPosition && localStorage.scrollPosition < $('#page-content-wrapper').get(0).scrollWidth - $('#page-content-wrapper').innerWidth()) {
        console.log(localStorage.scrollPosition);
       $("#page-content-wrapper").scrollLeft(localStorage.getItem("scrollPosition"));
        // console.log(localStorage.getItem("scrollPosition"));
       localStorage.removeItem("scrollPosition");
    }
 });

function preventDefault(e) {
    e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function disableScroll() {
    window.removeEventListener('wheel', horizontalScroll, false);
    console.log("scroll disabled");
}

function enableScroll() {
    window.addEventListener('wheel', horizontalScroll, false);
    console.log("scroll enabled");
}


const container = document.querySelector('.wrapper');
const loading = document.querySelector('.loading');

$(document).ready(function() {
    handleScroll();
    document.addEventListener('scroll', async function(event) {
        handleScroll();
        // console.log($('#page-content-wrapper').scrollLeft());
        if($('#page-content-wrapper').scrollLeft() >= 300) {
            $('.backToFront').addClass('show');
        }
        else {
            $('.backToFront').removeClass('show');
        }
        if( $('.type').length > 0 && Math.abs($('#page-content-wrapper').scrollLeft() === $('#page-content-wrapper').get(0).scrollWidth - $('#page-content-wrapper').innerWidth())) {
            console.log("END REACHED");
            disableScroll();
            showLoading();
        }
        
    }, true);
});

function showLoading() {
    $('.wrapper').append('<div class="loading show"><div class="ball"></div><div class="ball"></div><div class="ball"></div></div>');
    setTimeout(getNews, 1000);
    setTimeout(enableScroll, 1000);
}

function handleScroll() {
    // console.log("handleScroll called");
    $('.slide-in-h').each( function(i, elem) {
        var object_left = $(elem).offset().left + $(elem).outerWidth()/50;
        var screen_right = $(window).scrollLeft() + $(window).width();
        
        if (screen_right > object_left) {
            $(elem).css({
                'opacity': '1',
                'transform': 'translateX(0%)'
            });
        }
    });

}

async function getNews() {
    console.log("getNews called");
    console.log(`/loadmore?type=${$('.type').text()}`);
    const result = await axios.get(`/loadmore?type=${$('.type').text()}`);
    const newsData = await result.data.Summaries;
    // console.log(newsData);
    if(newsData) {
        addDataToDOM(newsData);
    }
    else {
        $('.loading').remove();
    }
}

function addDataToDOM(data) {
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    data.forEach(function (item, i) {
        let date = new Date( Date.parse(item.Info.Date));
        if(item.Image.ImageFileURL.length) {
            const image = document.createElement('IMG');
            image.src = item.Image.ImageFileURL;
            image.alt = item.Image.Caption;
            if(i%2 == 0) {
                const divider = document.createElement('div');
                divider.classList.add('divider');
                const newsElement = document.createElement('div');
                newsElement.classList.add('news-container', 'slide-in-h');
                newsElement.innerHTML = `
                <div>
                    <div class="date-row" >
                        <p class="bold">${days[date.getDay()] + date.toGMTString().slice(3, 16)}</p>
                        <a class="tag" href="/${item.Info.SectionId}">${item.Info.SectionId}</a>
                    </div>
                    <h1>${item.Article.Title}</h1>
                    <p>${item.Article.TrailText}</p>
                    <br>
                    <img class="news-img" src="${item.Image.ImageFileURL}" alt="item.Image.Caption">
                    <a class="btn btn-0" href="/${$('.type').text()}/${item.ObjectId}">Start reading</a>
                </div>
                `;
                container.appendChild(newsElement);
                container.appendChild(divider);
            }
            else {
                const divider = document.createElement('div');
                divider.classList.add('divider');
                const newsElement = document.createElement('div');
                newsElement.classList.add('news-container', 'slide-in-h');
                newsElement.innerHTML = `
                <div>
                    <img class="news-img" src="${item.Image.ImageFileURL}" alt="item.Image.Caption">
                    <br>
                    <br>
                    <div class="date-row" >
                        <p class="bold">${days[date.getDay()] + date.toGMTString().slice(3, 16)}</p>
                        <a class="tag" href="/${item.Info.SectionId}">${item.Info.SectionId}</a>
                    </div>
                    <h1>${item.Article.Title}</h1>
                    <p>${item.Article.TrailText}</p>
                    <a class="btn btn-0" href="/${$('.type').text()}/${item.ObjectId}">Start reading</a>
                </div>
                `;
                container.appendChild(newsElement);
                container.appendChild(divider);
            }
        }
        else {
            const divider = document.createElement('div');
            divider.classList.add('divider');
            const newsElement = document.createElement('div');
            newsElement.classList.add('news-container', 'slide-in-h');
            newsElement.innerHTML = `
            <div>
                <div class="date-row" >
                    <p class="bold">${days[date.getDay()] + date.toGMTString().slice(3, 16)}</p>
                    <a class="tag" href="/${item.Info.SectionId}">${item.Info.SectionId}</a>
                </div>
                <h1>${item.Article.Title}</h1>
                <p>${item.Article.TrailText}</p>
                <a class="btn btn-0" href="/${$('.type').text()}/${item.ObjectId}">Start reading</a>
            </div>
            `;
            container.appendChild(newsElement);
            container.appendChild(divider);
        }
        
    });
    $('.loading').remove();
    var width = $(window).width();
    if(width < 768){
        $('.slide-in-h').each( function(i, elem) {
            $(elem).removeClass('slide-in-h');
        }); 
        $('.slide-in').each( function(i, elem) {
            $(elem).removeClass('slide-in');
        }); 
    }

    $('.btn-0').each( function(i, elem) {
        $(elem).click(function() {
            var scrollPosition = $('#page-content-wrapper').scrollLeft();
            localStorage.setItem("scrollPosition", scrollPosition);
        });
    });
}