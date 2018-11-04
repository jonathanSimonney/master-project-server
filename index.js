const express = require('express')
const app = express()
const fs = require('fs');  // file system
const PORT = process.env.PORT || 3000
const HOST = 'localhost'
const youtubeStream = require('youtube-audio-stream')
app.use(express.static('temp'))
musicId = 0

app.get('/api/dl/:youtubeUrl/:filename',  (req, res) => {
    const youtubeUrl = req.params.youtubeUrl;
    const filename = req.params.filename;
    try {
        youtubeStream(youtubeUrl).pipe(res)

        res.setHeader('Content-disposition', 'attachment; filename=' + filename + ".mp3");
        res.setHeader('Content-type', 'mp3');
    } catch (exception) {
        console.log(exception)
        res.status(500).send(exception)
    }
})


app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
