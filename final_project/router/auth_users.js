const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{
    "username":"abida",
    "password":"12345"
} ];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
for (let user of users){
  if(user.username === username)
    return false;
}
  return  true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
for (let user of users){
  if(user.username === username && user.password === password){
    return true;
  }
}
return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username =req.body.username
  const password = req.body.password
    if (!username || !password) {
    return res.status(404).json({ message: "Username and password are required" });
  }
  if(authenticatedUser(username,password)){
    // Generate JWT access token
    let accessToken = jwt.sign(
      {data:password},
      'access',
      {expiresIn: 60*60}
    )
    // Store access token and username in session
    req.session.authorization= {
      accessToken,
      username
    }
        return res.status(200).json({ message: "Customer successfully logged in" });

  }
  //Write your code here
  return res.status(404).json({ message: "Invalid login details" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  const review = req.query.review;

  if(isbn && username && review){
   
    if(books[isbn]){
      books[isbn].reviews[username] = review
      return res.status(200).json({ message: "Review added/updated successfully" });
    }else{
      return  res.status(404).json({ message: "book not found" });
    }
  }else {
    return res.status(404).json({ message: "verify your review" });
  }
  
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username
    if(isbn && username){
      if(books[isbn].reviews[username] ){
        delete books[isbn].reviews[username]
        return res.status(200).json({ message: "Review delete successfully" });
      }
      else{
        return  res.status(404).json({ message: "you can't delete" });

      }

    }
    return res.status(404).json({ message: "verify your delete" });
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
