try {

    let topMonthlyUsers = await fetch('/leaderboard/topMonthlyUser').then(res => res.json())
    console.log(topMonthlyUsers)
} catch (e) {
    console.log(e)
}
// const topWeeklyUsers = await (await fetch('/api/leaderboard/weekly', {method: 'post'})).json()
//
// const topMonthlyFriends = await (await fetch('/api/leaderboard/friends/monthly', {method: 'post'})).json()
// const topWeeklyFriends = await (await fetch('/api/leaderboard/friends/weekly', {method: 'post'})).json()
//

