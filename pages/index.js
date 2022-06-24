import { useState, useEffect } from 'react'

export default function Index() {
  const [shouldAddNew, setShouldAddNew] = useState(true)
  const [currentPoints, setCurrentPoints] = useState({})
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    fetch('/api/pointsByPayer')
      .then((res) => res.json())
      .then((data) => setCurrentPoints(data))
  }, [])

  function handleOnAddSubmit(e) {
    e.preventDefault()
    const body = JSON.stringify({
      payer: e.target.new_payer?.value || e.target.payer.value,
      points: e.target.points.value,
      timestamp: new Date()
    })
    fetch('/api/pointsByPayer', { method: 'POST', body })
      .then((res) => res.json())
      .then((data) => {
        setCurrentPoints(data)
      })
  }

  function handleOnSpendSubmit(e) {
    e.preventDefault()
    const body = JSON.stringify({
      points: e.target.points.value
    })
    fetch('/api/spendPoints', { method: 'POST', body })
        .then((res) => {
            if (res.ok) return res.json()
            throw new Error(res.statusText)
        })
        .then((points) => {
            setErrorMsg('')
            const updatedPoints = {}
            points.forEach(p => {
              Object.keys(p).forEach(key => {
                  updatedPoints[key] = currentPoints[key] + p[key]
              })
            })
            setCurrentPoints({
                ...currentPoints,
                ...updatedPoints
            })
        })
        .catch(e => setErrorMsg(e.message))
  }

  function handleOnChange(e) {
    e.preventDefault()
    if (e.target.value === "new") {
      setShouldAddNew(true)
    } else {
      setShouldAddNew(false)
    }
  }

  return (
    <div>
      <h2>Total Points by Payer</h2>
      <ul>
        {Object.keys(currentPoints).map((key, i) => (
          <li key={i}>{key}: {currentPoints[key]}</li>
        ))}
      </ul>
      <h2>Add</h2>
      <form onSubmit={handleOnAddSubmit}>
        <div>
          <label>Enter payer name: </label>
          <select id="payer" name="payer" onChange={handleOnChange}>
            <option value="new">Add New</option>
            {Object.keys(currentPoints).map((key, i) => (
              <option key={i} value={key}>{key}</option>
            ))}
          </select>
          {shouldAddNew && <input type="text" name="new_payer" id="new_payer" required />}
        </div>
        <div>
          <label>Enter payer points: </label>
          <input type="number" name="points" id="points" required />
        </div>
        <input type="submit" value="Add points!" />
      </form>

      <h2>Spend</h2>
      <form onSubmit={handleOnSpendSubmit}>
        <input type="number" min="1" name="points" id="points" placeholder="enter points" required />
        <input type="submit" value="Spend points!" disabled={Object.keys(currentPoints).length === 0 || errorMsg} />
        <span style={{color: 'red'}}>{errorMsg}</span>
      </form>
    </div>
  )
}
