const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const { use } = require('react');
const { tr } = require('framer-motion/client');
const regd_users = express.Router();

let users = {
  "john_doe": { username: "john_doe", password: "password123" }
};

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  return users.hasOwnProperty(username); 
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  if (users[username] && users[username].password === password) {
    return true;
  }
  return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

  // Check if the username is valid
  if (!isValid(username)) {
    return res.status(404).json({ message: "User not found" });
  }

  // Authenticate the user by checking the password
  if (!authenticatedUser(username, password)) {
    return res.status(403).json({ message: "Invalid password" });
  }

  const token = jwt.sign({ username }, '123', { expiresIn: '1h' });

  return res.status(200).json({ message: "Login successful", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const username = req.user.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = review;
  return res.status(200).json({ message: "Review added successfully", reviews: books[isbn].reviews });
});

// Delete a book review (only the owner of the review can delete it)
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username; // Get the logged-in user from the session
  const review = req.body.review; // Get the review from the request body

  // Ensure the review exists in the books database for the specified ISBN
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the review exists for the logged-in user
  const userReview = books[isbn].reviews && books[isbn].reviews[username];

  if (!userReview) {
    return res.status(403).json({ message: "You do not have permission to delete this review" });
  }

  // Delete the review
  delete books[isbn].reviews[username];

  return res.status(200).json({ message: "Review deleted successfully" });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
