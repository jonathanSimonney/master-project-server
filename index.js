const express = require('express')
const app = express()
const fs = require('fs-extra');  // file system
const NodeID3 = require('node-id3')
const PORT = process.env.PORT || 3000
const HOST = 'localhost'
const youtubeStream = require('youtube-audio-stream')
app.use(express.static('temp'))
let musicId = 0

app.get('/api/dl/:youtubeUrl/:filename/:fileAuthor',  (req, res) => {
    musicId ++;
    let toBeDownloadedFilePath = "musics/music" + musicId + ".mp3";
    const youtubeUrl = req.params.youtubeUrl;
    const filename = req.params.filename;
    const fileAuthor = req.params.fileAuthor;

    fs.ensureFileSync(toBeDownloadedFilePath);

    const toBeDownloadedFile = fs.createWriteStream(toBeDownloadedFilePath);
    try {
        let fileWriteStream = youtubeStream("https://youtu.be/Fna56a_r41s").pipe(toBeDownloadedFile)

        fileWriteStream.on('finish', () => {
            let tags = {
                title: filename,
                artist: fileAuthor,
            }

            NodeID3.update(tags, toBeDownloadedFilePath)

            res.download(toBeDownloadedFilePath)
            res.setHeader('Content-disposition', 'attachment; filename=' + filename + ".mp3");
        })
    } catch (exception) {
        console.log(exception)
        res.status(500).send(exception)
    }
})


app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
