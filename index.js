const express = require('express')
const app = express()
const PORT = 3000
const HOST = 'localhost'

// app.use(express.static('public'))

app.get('/api/dl/:youtubeUrl', (req, res) => {
    //todo
})


app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
