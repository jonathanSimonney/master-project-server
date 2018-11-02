const express = require('express')
const app = express()
const fs = require('fs');  // file system
const PORT = process.env.PORT || 3000
const HOST = 'localhost'
const youtubeStream = require('youtube-audio-stream')
app.use(express.static('temp'))
musicId = 0

app.get('/api/dl/:youtubeUrl', (req, res) => {
    youtubeUrl = req.params.youtubeUrl;
    try {
        const musicFile = 'temp/music' + musicId + '.mp3';
        fs.closeSync(fs.openSync(musicFile, 'w'));
        const writeStream = fs.createWriteStream(musicFile);
        youtubeStream(youtubeUrl).pipe(writeStream)
        musicId++
        res.download('./' + musicFile, 'muse.mp3', (err) =>{
            if (err){
                console.log(err)
            }
        } )
    } catch (exception) {
        console.log(exception)
        res.status(500).send(exception)
    }
})


app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
