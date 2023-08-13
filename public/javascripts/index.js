const startChallenge = document.getElementById('challenge-form');
const challengeType = document.getElementById('challenge-type');
const challengeCount = document.getElementById('challenge-count');
startChallenge.addEventListener('submit', (e) => {
    e.preventDefault();
    window.location.href = '/challenge/' + challengeType.value + '/' + challengeCount.value;
});
