require('dotenv').config()
const express = require('express')
const app = express()
const fs = require('fs-extra');  // file system
const NodeID3 = require('node-id3')
const PORT = process.env.PORT || 3000
const API_KEY = process.env.API_KEY
const stream = require('stream');
const CombinedStream = require('combined-stream');
const youtubeStream = require('youtube-audio-stream')
app.use(express.static('temp'))
let musicId = 0

// const url = 'https://www.youtube.com/watch?v=tPEE9ZwTmy0'
// const decoder = require('@suldashi/lame').Decoder
// const Speaker = require('speaker')
//
// const speaker = new Speaker({
// 	channels: 2,          // 2 channels
// 	bitDepth: 16,         // 16-bit samples
// 	sampleRate: 44100     // 44,100 Hz sample rate
// });
// // PCM data from stdin gets piped into the speaker
// youtubeStream(url)
//     .pipe(decoder())
//     .pipe(speaker)

app.get('/api/:apiKey/dl/:youtubeUrl/:filename/:fileAuthor',  async (req, res) => {
    musicId ++;
    let toBeDownloadedFilePath = "musics/musicFile" + musicId + ".mp3";
    const youtubeUrl = "https://www.youtube.com/watch?v=tPEE9ZwTmy0"
    const paramApiKey = req.params.apiKey;

    if (paramApiKey !== API_KEY ){
        console.log("was called with wrong apiKey")
        return;
    }

    console.log(API_KEY, paramApiKey)

    // const youtubeUrl = req.params.youtubeUrl;
    const filename = req.params.filename;
    const fileAuthor = req.params.fileAuthor;

    fs.ensureFileSync(toBeDownloadedFilePath);


    const toBeDownloadedFileStream = fs.createWriteStream(toBeDownloadedFilePath);
    try {
        let tags = {
            title: filename,
            artist: fileAuthor,
        }

        let ID3FrameBuffer = NodeID3.create(tags)

        let bufferStream = new stream.PassThrough();
        bufferStream.end( ID3FrameBuffer );

        // const success = NodeID3.write(tags, toBeDownloadedFilePath)
        //
        // console.log(success, "was the write")


        console.log("about to create stream")
        // let combinedStream = youtubeStream(youtubeUrl)
        // let combinedStream = CombinedStream.create();
        //
        // combinedStream.append(bufferStream)
        // combinedStream.append(youtubeStream(youtubeUrl))

        await bufferStream.pipe(toBeDownloadedFileStream)
        youtubeStream(youtubeUrl).pipe(toBeDownloadedFileStream)

        console.log("about to pipe stuff in another stream")

        res.setHeader('Content-disposition', 'attachment; filename=' + filename + ".mp3");
        res.setHeader('Content-type', 'mp3');

        console.time('streamPiping')
        console.log(youtubeUrl)

        toBeDownloadedFileStream.on('finish', function (){
            res.download(toBeDownloadedFilePath, filename)
            console.log("file write done")
        })
		// combinedStream.pipe(res)
        // combinedStream.on(
        //     'finish',
        //     function () {
        //         console.timeEnd('streamPiping')
        //         console.log("stream finished");
        //         // console.log(res)
        //         res.end()
        //     }
        // );
        // for await (const chunk of youtubeStream(youtubeUrl)) {
        //     res.write(chunk)
        //     console.log("another chunk written")
        //     // combinedStream.append(chunk)
        // }
        // console.log("pipe went well")
        // res.end()

        // console.log(res)

    } catch (exception) {
        console.log(exception)
        res.status(500).send(exception)
    }
})

app.get('/:debug',  (req, res) => {
    console.log(req.params.debug)
})

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
