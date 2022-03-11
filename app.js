const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

//create express server
const app = express();

//server port number
const PORT = process.env.PORT || 3000;

//set template engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

//need to parse html data for POST request
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index");
})

app.post("/convert-mp3", async (req, res) => {
    const yturl = req.body.videoURL;
    const match = yturl.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/)
    if(match && match[2].length == 11){
        var ytid = match[2]
        if(
            ytid === undefined ||
            ytid === "" ||
            ytid === null
        ){
            res.render("index", {
                error: "Please enter a valid YouTube URL"
            });
        }else{
            const fetchAPI = await fetch(`https://youtube-mp3-download1.p.rapidapi.com/dl?id=${ytid}`, {
                "method": "GET",
                "headers": {
                    "x-rapidapi-host": process.env.API_HOST,
                    "x-rapidapi-key": process.env.API_KEY
                }
            })
            const fetchResponse = await fetchAPI.json();
            // console.log(fetchResponse.link);
            // res.render("index", {
            //     success : true,
            //     song_title : fetchResponse.title,
            //     song_link : fetchResponse.link
            // });
    
                if(fetchResponse.status === "ok")
                    return res.render("index", {
                        success : true,
                        song_title : fetchResponse.title,
                        song_link : fetchResponse.link
                    });
                else
                    return await res.render("index", {
                        success : true,
                        song_title : fetchResponse.title,
                        song_link : fetchResponse.link
                    })
                }    
           }
})

    
    


//start server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})