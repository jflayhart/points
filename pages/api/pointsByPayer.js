// Example data
// { "payer": "DANNON", "points": 1000, "timestamp": "2020-11-02T14:00:00Z" }
// { "payer": "MILLER COORS", "points": 10000, "timestamp": "2020-11-01T14:00:00Z" }
// { "payer": "DANNON", "points": -200, "timestamp": "2020-10-31T15:00:00Z" }
// { "payer": "UNILEVER", "points": 200, "timestamp": "2020-10-31T11:00:00Z" }
// { "payer": "DANNON", "points": 300, "timestamp": "2020-10-31T10:00:00Z" }
//
// FIFO?
// 5000 - 300 - 200 + 200 = 4700
// 10000 - 4700 = 5300
//
// UNILEVER: 0
// MILLER: 5300
// DANNON: 1000
export let pointsRawArr = [
  { "payer": "DANNON", "points": 1000, "timestamp": "2020-11-02T14:00:00Z" },
  { "payer": "UNILEVER", "points": 200, "timestamp": "2020-10-31T11:00:00Z" },
  { "payer": "DANNON", "points": -200, "timestamp": "2020-10-31T15:00:00Z" },
  { "payer": "MILLER COORS", "points": 10000, "timestamp": "2020-11-01T14:00:00Z" },
  { "payer": "DANNON", "points": 300, "timestamp": "2020-10-31T10:00:00Z" },
]
export let pointsByPayer = {}

// normalize data for O(1) lookup
pointsRawArr.forEach(addPointsByPayer)

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(pointsByPayer)
  } else if (req.method === 'POST') {
    // const pointsSorted = pointsRawArr.sort((a, b) => b.timestamp - a.timestamp)
    const body = JSON.parse(req.body)
    pointsRawArr.push(body)
    addPointsByPayer(body)

    res.status(200).json(pointsByPayer)
  } else {
    res.status(404)
  }
}

function addPointsByPayer(obj) {
  const payer = obj.payer
  const points = Number(obj.points)
  if (pointsByPayer[payer]) {
    pointsByPayer[payer] += points
  } else {
    pointsByPayer[payer] = points
  }
}
