// const form = document.querySelector('#clear');
// form.addEventListener('submit', async function(e) {
//     e.preventDefault();
//     const inForm = document.querySelector('#textIn');
//     const outForm = document.querySelector('#textOut');
//     inForm.value = "";
//     outForm.value = "";
//     form.remove();
// })


$(function () {
    $(document).scroll(function () {
      var $nav = $(".is-fixed-top");
      $nav.toggleClass('scrolled', $(this).scrollTop() > $nav.height());
    });
  });

$(document).ready(function() {

    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
  
        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        $(".navbar-burger").toggleClass("is-active");
        $(".navbar-menu").toggleClass("is-active");
  
    });
  });