// Menu toggle scripts
$("#menu-toggle").click(function(e) {
    e.preventDefault();
    $(".wrapper").toggleClass("toggled");
    $(".show-wrapper").toggleClass("toggled");
    $(".home-wrapper").toggleClass("toggled");
    $("#sidebar-wrapper").toggleClass("toggled");
    $("#menu-toggle").toggleClass('is-active');
    // $("#menu-toggle").toggleClass("toggled");
});


$(window).resize(function(){
    // console.log('resize called');
    var width = $(window).width();
    const div = document.querySelector("#menu-toggle");

    if(width < 768){
        $("#menu-toggle").removeClass('is-active');
        $("#sidebar-wrapper").addClass("toggled");
        $(".wrapper").addClass("toggled");
        $(".show-wrapper").addClass("toggled");
        $(".home-wrapper").addClass("toggled");
        $('.slide-in-h').each( function(i, elem) {
            $(elem).removeClass('slide-in-h');
        }); 
        $('.slide-in').each( function(i, elem) {
            $(elem).removeClass('slide-in');
        }); 
    }
    else {
        $('.news-container').each( function(i, elem) {
            // $(elem).addClass('slide-in-h');
        }); 
    }
})
.resize();//trigger the resize event on page load. 