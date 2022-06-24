export default function handler(req, res) {
    if (req.method === 'POST') {
        // pointsRawArr is global, sort in-place, timestamp asc (FIFO)
        pointsRawArr = pointsRawArr.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        const body = JSON.parse(req.body)
        let pointsToSpend = Number(body.points)
        let spentPointsByPayer = {}
        // spend oldest points first and reduce in-place
        // also track spentPointsByPayer
        // TODO what happens if we're spending more points than are available?
        pointsRawArr = pointsRawArr.reduce((acc, currVal) => {
            if (pointsToSpend > currVal.points) {
                pointsToSpend -= currVal.points
                if (spentPointsByPayer[currVal.payer]) {
                    spentPointsByPayer[currVal.payer] -= currVal.points
                } else {
                    spentPointsByPayer[currVal.payer] = -currVal.points
                }
            } else {
                if (pointsToSpend > 0) {
                    spentPointsByPayer[currVal.payer] = (currVal.points - pointsToSpend) - currVal.points

                    acc.push({
                        ...currVal,
                        points: currVal.points - pointsToSpend
                    })
                    pointsToSpend = 0
                } else {
                    acc.push(currVal)
                }
            }
            return acc
        }, [])

        const response = Object.keys(spentPointsByPayer).map(key => {
            console.log(key, pointsByPayer[key])
            console.log(spentPointsByPayer)
            pointsByPayer[key] += spentPointsByPayer[key]
            return { [key]: spentPointsByPayer[key] }
        })
        if (pointsRawArr.length > 0) {
            res.status(200).json(response)
        } else {
            res.status(422).send('Not enough points to spend!')
        }
    } else {
        res.status(404)
    }
}