const express = require('express');
let books = require("./booksdb.js");
const { a } = require('framer-motion/client');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  if (users[username]){
    return res.status(400).json({ message: "Username already exists" });
  } 
  users[username] = { username, password };
  
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(300).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  return res.status(300).json(books[isbn]);
 });
  
 public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const bookKeys = Object.keys(books);
  console.log(`Author requested: ${author}`);
  console.log(`Books object:`, books);

  // Filter books that match the author
  const booksByAuthor = bookKeys.filter((key) => {
    return books[key].author.trim().toLowerCase() == author.toLowerCase();
  }).map((key) => books[key]);

  // If no books found, return a 404 response
  if (booksByAuthor.length > 0) {
    return res.status(300).json(booksByAuthor); // Return books with a 200 status code
  } else {
    return res.status(300).json({ message: "No books found for this author" });
  }
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const bookKeys = Object.keys(books);

  // Filter books that match the author
  const booksByAuthor = bookKeys.filter((key) => {
    return books[key].title.trim().toLowerCase() == title.toLowerCase();
  }).map((key) => books[key]);

  // If no books found, return a 404 response
  if (booksByAuthor.length > 0) {
    return res.status(300).json(booksByAuthor); // Return books with a 200 status code
  } else {
    return res.status(300).json({ message: "No books found for this title" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const review = books[isbn].review;
  return res.status(300).json(review);
});

module.exports.general = public_users;
