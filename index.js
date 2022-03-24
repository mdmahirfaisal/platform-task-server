const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express()
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 5000


// middle ware 
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uwoya.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        console.log('Platform  database connected successfully');
        const database = client.db("platform_integration");
        const usersCollection = database.collection("users");


        // GET API Load all products
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        })


        // GET single Product API
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.findOne(query);
            console.log(result);
            res.send(result)
        });


        // DELETE Order  with user
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(query);
            res.send(result)
        })


        // POST API  products send to database
        app.post('/users', async (req, res) => {
            const products = req.body;
            const result = await usersCollection.insertOne(products);
            res.json(result);
        });

        // PUT API product update 

        app.put('/updateUser', async (req, res) => {
            const data = req.body;
            console.log("Edit Product: ", req.body);
            const query = { _id: ObjectId(id) };
            // const options = { upsert: true };
            const updateDoc = {
                $set: data,
            }
            const result = await usersCollection.updateOne(query, updateDoc);
            res.json(result);

        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Plat form integration API HERE')
})

app.listen(port, () => {
    console.log(` listening ${port}`)
})