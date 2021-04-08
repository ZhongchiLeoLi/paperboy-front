//    Scrolling animation scripts
$(document).ready(function() {
    handleScroll();
    document.addEventListener('scroll', function(event) {
        // console.log("WOW");
        handleScroll();
    }, true);
    
});

function handleScroll() {
    // console.log("handleScroll called");
    $('.slide-in').each( function(i, elem) {
        var object_top = $(elem).offset().top + $(elem).outerHeight()/5;
        var screen_bottom = $(window).scrollTop() + $(window).height();

        if (screen_bottom > object_top) {
            $(elem).css({
                'opacity': '1',
                'transform': 'translateY(0%)'
            });
        }
    }); 
}