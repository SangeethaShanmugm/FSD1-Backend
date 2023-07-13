// const express = require("express"); // 3rd party package
// const { MongoClient } = require("mongodb");
import express from "express";
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = 8000;
//req -> what we send to server
//res -> what we receive from server

//Intercepter / Converting body data to json

//console.log(process.env.MONGO_URL);
app.use(express.json()); //Inbuilt middleware

// const MONGO_URL = "mongodb://0.0.0.0:27017";
const MONGO_URL = process.env.MONGO_URL;
//mongodb://localhost
//mongodb://localhost:27017
//mongodb://0.0.0.0:27017

//Mongodb Connection
async function createConnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("MongoDB connected");
  return client;
}
const client = await createConnection();
//REST API endpoints
app.get("/", (req, res) => {
  res.send("Hello Everyone🥳🥳🥳");
});

//Task
// /books -> all books ✅
// /books?language=English - only English books ✅
// /books?language=English&rating=8 - filter by language and rating
// /books?rating=8 - filter by rating

//get all books
app.get("/books", async (req, res) => {
  const { language, rating } = req.query;
  console.log(req.query, language, rating);
  // let filteredBooks = books; //Copy by reference
  // if (req.query.language) {
  //   // filteredBooks = filteredBooks.filter((bk) => bk.language == language);
  //   req.query.language = req.query.language;
  // }
  if (req.query.rating) {
    // filteredBooks = filteredBooks.filter((bk) => bk.rating == rating);
    req.query.rating = +req.query.rating;
  }
  const book = await client
    .db("fsd-1")
    .collection("books")
    .find(req.query)
    .toArray();
  res.send(book);
});

//get books by id
app.get("/books/:id", async (req, res) => {
  const { id } = req.params;
  // console.log(id);
  // console.log(req.params);
  //const book = books.find((bk) => bk.id == id);
  const book = await client.db("fsd-1").collection("books").findOne({ id: id });
  res.send(book);
});

//delete books by id
app.delete("/books/:id", async (req, res) => {
  const { id } = req.params;
  // console.log(id);
  // console.log(req.params);
  //const book = books.find((bk) => bk.id == id);
  const book = await client
    .db("fsd-1")
    .collection("books")
    .deleteOne({ id: id });
  res.send(book);
});

//add book
app.post("/books", async (req, res) => {
  const newBook = req.body;
  console.log(newBook);
  const result = await client
    .db("fsd-1")
    .collection("books")
    .insertMany(newBook);
  res.send(result);
});

//update book
app.put("/books/:id", async (req, res) => {
  const { id } = req.params;
  const updatedBook = req.body;
  console.log(updatedBook);
  const result = await client
    .db("fsd-1")
    .collection("books")
    .updateOne({ id: id }, { $set: updatedBook });
  res.send(result);
});

app.listen(PORT, () => console.log("Server started on the port", PORT));

//CRUD
// C  - Create - add/insert - insertOne/insertMany
// R - Read - get - find, findOne
// U - Update - updateOne,  updateMany
// D - Delete - deleteOne, deleteMany
