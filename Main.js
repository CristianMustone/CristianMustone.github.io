document.addEventListener('DOMContentLoaded', function () {
    const slides = document.querySelectorAll('.slide');
    const links = document.querySelectorAll('.menu li a'); // Cambiado el selector para obtener los enlaces dentro de los elementos li

    let currentSlide = 0;
    let scrolling = false;

    console.log(slides);

    function showSlide() {
        slides.forEach((slide, index) => {
            if (index === currentSlide) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
    }

    function goToSlide(index) {
        if (!scrolling && index >= 0 && index < slides.length) {
            scrolling = true;
            currentSlide = index;
            showSlide();
            setTimeout(() => {
                scrolling = false;
            }, 800); // ajustar este valor según la duración de la transición CSS
        }
    }

    function scrollToElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            const elementPosition = element.offsetTop;
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    }

    window.addEventListener('wheel', function (e) {
        if (e.deltaY > 0) {
            goToSlide(currentSlide + 1);
        } else {
            goToSlide(currentSlide - 1);
        }
    });

    links.forEach((link, index) => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            goToSlide(index); // Utiliza el índice del enlace como el índice del slide
            const targetId = link.getAttribute('href').substring(1);
            // console.log();
            scrollToElement(targetId);
        });
    });

    showSlide();
});
