const { MongoClient } = require('mongodb');
const express = require('express')
const app = express()
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();
app.use(cors());
app.use(express.json());
const uri = process.env.URL;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('shortUrl');
        const shortUrl = database.collection('shortUrl');
        // post a url 
        app.post('/urllist', async (req, res) => {
            const url = req.body;
            const result = await shortUrl.insertOne(url);
            res.json(result)
        });

        //get all url
        app.get('/urllist', async (req, res) => {
            let result = await shortUrl.find({}).toArray();
            res.json(result)
        });

        app.get('/:uniq', async (req, res ) =>{
            let uniq = req.params.uniq;
            const quary = { uniq: uniq };
            const result = await shortUrl.findOne(quary)
            console.log(result)
            if( result?.uniq ){
                res.redirect(result.url);
            }
        });
       
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Server Running')
})

app.listen(port, () => {
    console.log(`${port} Port is running`)
})