const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
//MIADLEWERE
app.use(express.json());
app.use(cors())


const { MongoClient,ObjectId, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@robiul.13vbdvd.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const newsInfocollection = client.db("Akash-Today").collection("newsInfo");

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });

     /////////////////////////////////////////////////////////////////////////
    //                        news info part
    ////////////////////////////////////////////////////////////////////////

    app.post("/news",  async (req, res) => {
      const data = req.body;
      const result = await newsInfocollection.insertOne(data);
      res.send(result);
    });

    app.get("/news", async (req, res) => {
      const result = await newsInfocollection.find().toArray();
      res.send(result);
    });
    ///

    app.get("/news/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await newsInfocollection.findOne(filter);
      res.send(result);
    });

    app.patch("/news/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const body = req.body;
      const updatedoc = {
        $set: {
          title: body.title,
          description: body.description,
          photo: body.photo,
          category: body.category,
          date: body.date,
        },
      };
      const result = await newsInfocollection.updateOne(filter, updatedoc);
      res.send(result);
    });

    app.delete("/news/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await newsInfocollection.deleteOne(filter);
      res.send(result);
    });

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("hello canteen");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


