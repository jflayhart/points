// Example data
// { "payer": "DANNON", "points": 300, "timestamp": "2020-10-31T10:00:00Z" }
// { "payer": "UNILEVER", "points": 200, "timestamp": "2020-10-31T11:00:00Z" }
// { "payer": "DANNON", "points": -200, "timestamp": "2020-10-31T15:00:00Z" }
// { "payer": "MILLER COORS", "points": 10000, "timestamp": "2020-11-01T14:00:00Z" }
// { "payer": "DANNON", "points": 1000, "timestamp": "2020-11-02T14:00:00Z" }
//
// FIFO?
// 5000 - 300 - 200 + 200 = 4700
// 10000 - 4700 = 5300
//
// UNILEVER: 0
// MILLER: 5300
// DANNON: 1000

global.pointsRawArr = []
global.pointsByPayer = {}

// normalize data for O(1) lookup
pointsRawArr.forEach(addPointsByPayer)
console.log('server init')

export default function handler(req, res) {
  if (req.method === 'GET') {
    console.log('GET', pointsByPayer)
    res.status(200).json(pointsByPayer)
  } else if (req.method === 'POST') {
    const body = JSON.parse(req.body)
    const formattedBody = { ...body, points: Number(body.points) }
    pointsRawArr.push(formattedBody)
    addPointsByPayer(formattedBody)
    console.log('POST', pointsByPayer)
    res.status(200).json(pointsByPayer)
  } else {
    res.status(404)
  }
}

export function addPointsByPayer(obj) {
  const payer = obj.payer
  const points = Number(obj.points)
  if (pointsByPayer[payer]) {
    pointsByPayer[payer] += points
  } else {
    pointsByPayer[payer] = points
  }
}
