const links = document.querySelectorAll('.link');

links.forEach(link => {
    link.addEventListener('click', () => {
        window.location.href = link.getAttribute('data-href');
    });
});