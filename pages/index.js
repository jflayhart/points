import { useState, useEffect } from 'react'

export default function Index() {
  const [shouldAddNew, setShouldAddNew] = useState(true)
  const [currentPoints, setCurrentPoints] = useState({})

  useEffect(() => {
    fetch('/api/pointsByPayer')
      .then((res) => res.json())
      .then((data) => setCurrentPoints(data))
  }, [])

  function handleOnSubmit(e) {
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
      <ul>
        {Object.keys(currentPoints).map((key, i) => (
          <li key={i}>{key}: {currentPoints[key]}</li>
        ))}
      </ul>
      <form onSubmit={handleOnSubmit}>
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
          <input type="number" min="1" name="points" id="points" required />
        </div>
        <input type="submit" value="Add points!" />
      </form>
    </div>
  )
}
