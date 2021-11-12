const https = require('https');

const todayDate = new Date().toISOString().slice(0, 10);

const url = `https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${todayDate}`;

const callNasaAPODApi = (callback) => {
    https.get(url, (res) =>{
        let data = '';
        res.on('data', (chunk)=>{
            data +=chunk;
        });

        res.on('end' , ()=>{
            return callback(data)
        });
    }).on('error',(err)=>{
        console.log("error"+err.message)
    });
}

module.exports.callApi = callNasaAPODApi;