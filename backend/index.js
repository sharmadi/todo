const express = require('express')
const app = express()
const port = 3000

app.get('/tasks', (req, res) => {
  res.json(
    [
        {
            "task_name": "hello",
            "category": "Personal",
            "date": "2023-01-01"
        }
    ])
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})