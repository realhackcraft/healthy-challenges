const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (form.password.value === form.password2.value) {
        form.submit();
    }
});