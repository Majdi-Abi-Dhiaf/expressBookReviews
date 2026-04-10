const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username
  const password = req.body.password
  if (username && password) {
    if (isValid(username)) {
      users.push({ "username": username, "password": password })
      return res.status(200).json({ message: "registration successful" });
    }
    else {
      return res.status(409).json({ message: "User already exists" });
    }
  } else

    return res.status(404).json({ message: "verify your registration" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {

  //Write your code here
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN

public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let book = books[isbn];
  if (book) {
    res.send(JSON.stringify(book, null, 4))
  } else {
    return res.status(404).json({ message: (isbn) + " ISBN not found" });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const author = req.params.author;
  let result = {};
  let found = false;

  for (let key in books) {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      result[key] = books[key];
      found = true;
    }
  }

  if (found) {
    return res.send(JSON.stringify(result, null, 4));
  } else {
    return res.status(404).json({ message: "Author not found" });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.trim()
  let result = {};
  let found = false
  for (let key in books) {
    if (books[key].title.toLowerCase().trim() === title.toLowerCase()) {
      result[key] = books[key]
      found = true
    }
  }
  if (found) {
    return res.send(JSON.stringify(result, null, 4))
  }
  else {
    return res.status(404).json({ message: "title not found" });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn
  if (isbn) {
    res.send(JSON.stringify(books[isbn].reviews, null, 4))
  }
  else {
    return res.status(404).json({ message: "ISBN not found" });
  }
});

module.exports.general = public_users;

const axios = require('axios');

async function getAllBooks() {
  try {
    const response = await axios.get('http://localhost:5000/');
    console.log(response.data);
  } catch (error) {
    console.log(error.message);
  }
}

getAllBooks();