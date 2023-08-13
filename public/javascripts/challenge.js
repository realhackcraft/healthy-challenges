const type = document.getElementById('type').innerText;

fetch("/javascripts/" + type + ".json")
    .then((res) => res.text())
    .then((text) => {
        const challenges = JSON.parse(text);
        const count = parseInt(document.getElementById('count').innerText);

        const form = document.createElement('form');
        form.action = '/submit?count=' + count;
        form.method = 'POST';
        const existingChallenges = [];

        for (let i = 0; i < count; i++) {
            const challengeIndex = Math.floor(Math.random() * challenges.length);
            const challenge = challenges[challengeIndex];

            if (existingChallenges.includes(challengeIndex)) {
                i--;
                continue;
            }

            const label = document.createElement('label');
            label.innerHTML = challenge.text;
            form.appendChild(label);

            const input = document.createElement('input');
            input.type = challenge.inputType;
            input.required = true;

            if (challenge.inputType === "range") {
                input.min = challenge.min;
                input.max = challenge.max;
            }

            input.dataset.index = challengeIndex;
            form.appendChild(input);

            const br = document.createElement('br');
            const br2 = document.createElement('br');
            form.appendChild(br);
            form.appendChild(br2);

            existingChallenges.push(challengeIndex);
        }

        const submit = document.createElement('input');
        submit.type = 'submit';
        form.appendChild(submit);

        const score = document.createElement('input');
        score.type = 'hidden';
        form.appendChild(score);

        const div = document.getElementById('challenge');
        div.appendChild(form);
    })
    .catch((e) => console.error(e));
