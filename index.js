const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gcc40.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    // const serviceCollection = client.db("carDoctor").collection("services");
    const booksCollection = client.db("reduxAssignment").collection("allBooks");

    // ! get all books
    app.get("/allBooks", async (req, res) => {
      const cursor = booksCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //! get one book
    app.get("/allBooks/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      console.log(query);
      /*  
      const options = {
        projection: {
          title: 1,
          author: 1,
          genre: 1,
          publicationYear: 1,
          img: 1,
        },
      };
       */
      // const result = await booksCollection.findOne(query, options);
      const result = await booksCollection.findOne(query);
      console.log(result);
      res.send(result);
    });

    //! post a book
    app.post("/allBooks", async (req, res) => {
      const book = req.body;
      const result = await booksCollection.insertOne(book);
      res.send(result);
    });

    //! post a comment
    app.post("/comment/:id", async (req, res) => {
      const productId = req.params.id;
      const comment = req.body.reviews;
      console.log(productId, comment);

      const result = await booksCollection.updateOne(
        { _id: new ObjectId(productId) },
        { $push: { reviews: comment } }
      );
      console.log(result);

      if (result.modifiedCount !== 1) {
        console.error("Product not found or comment not added");
        res.json({ error: "Product not found or comment not added" });
        return;
      }

      console.log("Comment added successfully");
      res.json({ message: "Comment added successfully" });
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to book seller server");
});

app.listen(port, () => {
  console.log(`Runnung on port :  ${port}`);
});
