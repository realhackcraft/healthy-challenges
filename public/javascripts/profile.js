const add = document.querySelector('#add-friend');
const remove = document.querySelector('#remove-friend');

const username = document.querySelector('#username');
const visitorName = document.querySelector('#visitor-name');

if (add) {
    add.addEventListener('click', async () => {
        await fetch('/api/friends/add', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                friendName: username.innerText,
            }),
        })
        window.location.reload();
    });
}

if (remove) {
    remove.addEventListener('click', async () => {
        await fetch('/api/friends/remove', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                friendName: username.innerText,
            }),
        })
        window.location.reload();
    });
}