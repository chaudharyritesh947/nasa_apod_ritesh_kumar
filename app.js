const MongoClient = require('mongodb').MongoClient;
const request = require('./request');
const http = require('http');

const dbName = 'nasa_apod';
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const todayDate = new Date().toISOString().slice(0, 10);
const db = client.db(dbName);

client.connect(function(err) {
    console.log("Connected successfully to server");
  
    db.createCollection("astronomy_data", (err, res)=>{
        if(err && err.codeName === 'NamespaceExists'){
            console.log("Collection already present in the DB");
        }
        else if(err){
            console.log("Error: ", err);
        }
    });
});

http.createServer((req, res)=>{
   if(req.url === '/node'){
        var query = { date: todayDate };
        db.collection("astronomy_data").find(query).toArray(function(err, result) {
          if (err) throw err;
          if(result.length>0){

            res.write(`<img alt="nasa-image" src=${result[0].url}> ${JSON.stringify(result[0])}`);
          }
          else{
            request.callApi(function(responce){
                res.write(responce);
                const astroData = JSON.parse(responce);
                db.collection("astronomy_data").insertOne(astroData, function(err, res) {
                  if (err) throw err;
                  console.log("1 document inserted");
                });
            })
          }
          res.end();
        });      
    }
}).listen(3000)
 