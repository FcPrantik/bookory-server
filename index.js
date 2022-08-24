const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

// Middleware used
app.use(cors());
app.use(express.json());

//From mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0d09z.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    const bookCollections = client.db('booKory').collection('bookCollections');
    const orderCollections = client.db('booKory').collection('order');

    app.get('/book', async (req, res) => {
      const query = {};
      const cursor = bookCollections.find(query);
      const books = await cursor.toArray();
      res.send(books);
    });
    app.get('/book/:id', async(req,res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const book = await bookCollections.findOne(query);
      console.log('load user id:', id);
      res.send(book);
    });
    //  POST API
    app.post('/book', async(req, res) => {
      const newBook = req.body;
      const result = await bookCollections.insertOne(newBook);
      console.log('Got new Book', req.body);
      console.log('added book', result);
      res.json(result);
    });
    //DELETE API
    app.delete('/book/:id', async(req,res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookCollections.deleteOne(query);
      res.send(result);
    });
    //OrderCollections API
    app.post('/order', async(req, res) => {
      const order = req.body;
      const result = await orderCollections.insertOne(order);
      res.send(result);
    });
    app.get('/order', async (req, res) => {
      const email = req.query.email;
      const query = {email: email};
      const cursor = orderCollections.find(query);
      const orders = await cursor.toArray();
      res.send(orders);
    });

  }
  finally {

  }
}
run().catch(console.dir);







//Default API
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})