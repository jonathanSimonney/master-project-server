require('dotenv').config()
const express = require('express')
const app = express()
// const fs = require('fs-extra');  // file system
const NodeID3 = require('node-id3')
const PORT = process.env.PORT || 3000
const API_KEY = process.env.API_KEY
const stream = require('stream');
const CombinedStream = require('combined-stream');
const youtubeStream = require('youtube-audio-stream')
app.use(express.static('temp'))
let musicId = 0

app.get('/api/:apiKey/dl/:youtubeUrl/:filename/:fileAuthor',  (req, res) => {
    musicId ++;
    // let toBeDownloadedFilePath = "musics/music" + musicId + ".mp3";
    // const youtubeUrl = "https://youtu.be/SUthZHNsJ5k"
    const paramApiKey = req.params.apiKey;

    if (paramApiKey !== API_KEY ){
        console.log("was called with wrong apiKey")
        return;
    }

    console.log(API_KEY, propApiKey)

    const youtubeUrl = req.params.youtubeUrl;
    const filename = req.params.filename;
    const fileAuthor = req.params.fileAuthor;

    // fs.ensureFileSync(toBeDownloadedFilePath);

    // const toBeDownloadedFile = fs.createWriteStream(toBeDownloadedFilePath);
    try {
        let tags = {
            title: filename,
            artist: fileAuthor,
        }

        let ID3FrameBuffer = NodeID3.create(tags)

        let bufferStream = new stream.PassThrough();
        bufferStream.end( ID3FrameBuffer );

        let combinedStream = CombinedStream.create();

        combinedStream.append(bufferStream)
        combinedStream.append(youtubeStream(youtubeUrl))

        combinedStream.pipe(res)

        res.setHeader('Content-disposition', 'attachment; filename=' + filename + ".mp3");
        res.setHeader('Content-type', 'mp3');
    } catch (exception) {
        console.log(exception)
        res.status(500).send(exception)
    }
})


app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
