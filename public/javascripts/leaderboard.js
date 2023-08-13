let topMonthlyUsers = await fetch('/api/leaderboard/monthly')
topMonthlyUsers = await topMonthlyUsers.json()
// const topWeeklyUsers = await (await fetch('/api/leaderboard/weekly', {method: 'post'})).json()
//
// const topMonthlyFriends = await (await fetch('/api/leaderboard/friends/monthly', {method: 'post'})).json()
// const topWeeklyFriends = await (await fetch('/api/leaderboard/friends/weekly', {method: 'post'})).json()
//

console.log(topMonthlyUsers)