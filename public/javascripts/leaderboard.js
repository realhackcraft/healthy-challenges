const topUsers = await fetch('/leaderboard/topUsers').then(res => res.json())
console.log(topUsers)
const topMonthlyUsers = await fetch('/leaderboard/topMonthlyUsers').then(res => res.json())
console.log(topMonthlyUsers)
const topWeeklyUsers = await fetch('/leaderboard/topWeeklyUsers').then(res => res.json())
console.log(topWeeklyUsers)

const topFriends = await fetch('/leaderboard/topFriends').then(res => res.json())
console.log(topFriends)
const topMonthlyFriends = await fetch('/leaderboard/topMonthlyFriends').then(res => res.json())
console.log(topMonthlyFriends)
const topWeeklyFriends = await fetch('/leaderboard/topWeeklyFriends').then(res => res.json())
console.log(topWeeklyFriends)

const leaderboardBody = document.getElementById('leaderboard-body');

const ctx = document.getElementById('leaderboard-chart');

let leaderboardChart;
let currentUsers = topUsers;
let currentType = 'users';

function drawChart(users) {
    if (leaderboardChart) {
        leaderboardChart.destroy();
    }

    if (leaderboardBody) {
        leaderboardBody.innerHTML = '';
    }

    const userNames = users.map(user => user.username);
    const userScores = users.map(user => user.totalScore);

    leaderboardChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: userNames,
            datasets: [{
                label: 'Score',
                data: userScores,
                borderWidth: 1,
                backgroundColor: 'rgb(255, 99, 132)',
            }]
        },
        options: {
            scales: {
                x: {
                    grid: {
                        color: 'rgb(243,237,237, 0.2)'
                    },
                    ticks: {
                        color: 'rgb(229,222,222)'
                    }
                },
                y: {
                    grid: {
                        color: 'rgb(243,237,237, 0.2)'
                    },
                    ticks: {
                        color: 'rgb(229,222,222)'
                    }
                }
            },
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
            }
        },
    });

    users.forEach((user, index) => {
        const row = document.createElement('tr');
        const rankCell = document.createElement('td');
        rankCell.textContent = (index + 1).toString();
        const userCell = document.createElement('td');
        userCell.textContent = user.username;
        const scoreCell = document.createElement('td');
        scoreCell.textContent = user.totalScore.toString();

        row.appendChild(rankCell);
        row.appendChild(userCell);
        row.appendChild(scoreCell);
        leaderboardBody.appendChild(row);
    });
}

drawChart(currentUsers);

const topUsersButton = document.getElementById('top-users');
topUsersButton.addEventListener('click', () => {
    currentType = 'users';
    currentUsers = topUsers;

    if (currentUsers === topMonthlyFriends) {
        currentUsers = topMonthlyUsers;
    } else if (currentUsers === topWeeklyFriends) {
        currentUsers = topWeeklyUsers;
    }

    drawChart(currentUsers);
    topUsersButton.disabled = true;
    topFriendsButton.disabled = false;
});

const topFriendsButton = document.getElementById('top-friends');
topFriendsButton.addEventListener('click', () => {
    currentType = 'friends';
    currentUsers = topFriends;

    if (currentUsers === topMonthlyUsers) {
        currentUsers = topMonthlyFriends;
    } else if (currentUsers === topWeeklyUsers) {
        currentUsers = topWeeklyFriends;
    }

    drawChart(currentUsers);
    topFriendsButton.disabled = true;
    topUsersButton.disabled = false;
});

const topAllTimeButton = document.getElementById('all-time');

topAllTimeButton.addEventListener('click', () => {
    if (currentType === 'users') {
        currentUsers = topUsers;
    } else {
        currentUsers = topFriends;
    }
    drawChart(currentUsers);
    topAllTimeButton.disabled = true;
    topMonthlyButton.disabled = false;
    topWeeklyButton.disabled = false;
});

const topMonthlyButton = document.getElementById('last-month');

topMonthlyButton.addEventListener('click', () => {
    if (currentType === 'users') {
        currentUsers = topMonthlyUsers;
    } else {
        currentUsers = topMonthlyFriends;
    }
    drawChart(currentUsers);
    topAllTimeButton.disabled = false;
    topMonthlyButton.disabled = true;
    topWeeklyButton.disabled = false;
})

const topWeeklyButton = document.getElementById('last-week');

topWeeklyButton.addEventListener('click', () => {
    if (currentType === 'users') {
        currentUsers = topWeeklyUsers;
    } else {
        currentUsers = topWeeklyFriends;
    }
    drawChart(currentUsers);
    topAllTimeButton.disabled = false;
    topMonthlyButton.disabled = false;
    topWeeklyButton.disabled = true;
});


