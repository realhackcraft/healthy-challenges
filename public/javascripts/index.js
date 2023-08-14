const startChallenge = document.getElementById('challenge-form');
const challengeType = document.getElementById('challenge-type');
const challengeCount = document.getElementById('challenge-count');
if (startChallenge) {
    startChallenge.addEventListener('submit', (e) => {
        e.preventDefault();
        if (challengeType.value === 'select') {
            return;
        }
        location.href = '/challenge/' + challengeType.value + '/' + challengeCount.value;
    });
}
