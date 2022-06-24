/**
 * /api/spendPoints:
 *   post:
 *     @param req.body { points: int }
 *     @desc Spends oldest points first using the given request payload
 *     @returns key-val pair of points spent as negative integers for each payer
 */
export default function handler(req, res) {
    if (req.method === 'POST') {
        // pointsRawArr is global, sort in-place, timestamp asc (FIFO)
        pointsRawArr = pointsRawArr.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        const body = JSON.parse(req.body)
        let pointsToSpend = Number(body.points)
        let spentPointsByPayer = {}
        // spend oldest points first and reduce in-place
        // also track spentPointsByPayer while updating original pointsRawArr
        // TODO how should we handle spending more points than are available? skip or spend?
        pointsRawArr = pointsRawArr.reduce((acc, currVal) => {
            if (currVal.points === 0 || pointsToSpend === 0) {
                acc.push(currVal)
                return acc
            }
            if (pointsToSpend >= currVal.points) {
                console.log(`depleting all points for ${JSON.stringify(currVal)}`)
                pointsToSpend -= currVal.points
                if (spentPointsByPayer[currVal.payer]) {
                    spentPointsByPayer[currVal.payer] -= currVal.points
                } else {
                    spentPointsByPayer[currVal.payer] = -currVal.points
                }
                acc.push({
                    ...currVal,
                    points: 0
                })
            } else {
                console.log(`decreasing ${pointsToSpend} points: ${JSON.stringify(currVal)}`)
                spentPointsByPayer[currVal.payer] = (currVal.points - pointsToSpend) - currVal.points

                acc.push({
                    ...currVal,
                    points: currVal.points - pointsToSpend
                })
                pointsToSpend = 0
            }
            return acc
        }, [])

        const response = Object.keys(spentPointsByPayer).map(key => {
            // update current pointsByPayer
            pointsByPayer[key] += spentPointsByPayer[key]
            return { [key]: spentPointsByPayer[key] }
        })
        if (response.length > 0) {
            console.log('POST spendPoints', response)
            res.status(200).json(response)
        } else {
            res.status(422).send('Not enough points to spend!')
        }
    } else {
        res.status(404)
    }
}