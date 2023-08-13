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

            if (challenge.inputType === "radio") {
                challenge.options.forEach((option) => {
                    const radioLabel = document.createElement('label');
                    radioLabel.innerHTML = option;

                    const radioInput = document.createElement('input');
                    radioInput.type = "radio";
                    radioInput.name = "challenge_" + challengeIndex;
                    radioInput.value = option;

                    form.appendChild(radioInput);
                    form.appendChild(radioLabel);
                });
            } else {
                const input = document.createElement('input');
                input.type = challenge.inputType;

                if (challenge.inputType === "range") {
                    input.min = challenge.min;
                    input.max = challenge.max;
                }

                input.dataset.index = challengeIndex;
                form.appendChild(input);
            }

            const br = document.createElement('br');
            const br2 = document.createElement('br');
            form.appendChild(br);
            form.appendChild(br2);

            existingChallenges.push(challengeIndex);
        }

        const submit = document.createElement('input');
        submit.type = 'submit';
        form.appendChild(submit);

        const div = document.getElementById('challenge');
        div.appendChild(form);

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const inputs = form.getElementsByTagName('input');
            let valid = true;

            for (let i = 0; i < inputs.length - 1; i++) {
                const challengeIndex = inputs[i].dataset.index;
                const challenge = challenges[challengeIndex];
                const args = challenge.valid.args;
                const body = challenge.valid.body;


                const validate = new Function(args, body);
                if (!validate(inputs[i].value)) {
                    valid = false;
                    break;
                }
            }

            if (valid) {
                form.submit();
            }
        });
    })
    .catch((e) => console.error(e));
