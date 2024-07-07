const express = require('express');
const { type } = require('os');

const path = require('path');
const { cursorTo } = require('readline');
const { parseArgs } = require('util');

const app = express();

app.use(express.urlencoded({ extended: true }));

const port = 1111;

const libraryData = [
    {
        title: "The Quantum Paradox",
        author: "Emily Hawkins",
        isAvailable:true,
        borrowedBy: "",
    },
    {
        title: "Eternal Sunshine",
        author: "Olivia Harper",
        isAvailable:true,
        borrowedBy: "",
    },
    {
        title: "Code Breakers",
        author: "Alex Turner",
        isAvailable:false,
        borrowedBy: "1234",
    },
    {
        title: "Digital Renaissance",
        author: "Sophia Martinez",
        isAvailable:true,
        borrowedBy: "",
    },
]

const findBook = (title) => {
    for (const currBooks of libraryData) {
        if (currBooks.title === title) {
            return currBooks;
        }
    }
    return;
};

app.get("/", (req,res)=>{
    console.log(`Received Request at / endpoint on port ${port}`);
    return res.sendFile(path.join(__dirname,"index.html"))
})

app.get("/see-all", (req,res)=>{
    console.log(`Received Request at /see-all endpoint on port ${port}`);
    let content = "";
    for (const currBooks of libraryData) {
    content +=`
        <p><span class="book-property">Title:</span> ${currBooks.title}</p>
        <p><span class="book-property">Author:</span> ${currBooks.author}</p>
        <p><span class="book-property">Is Available ?:</span> ${currBooks.isAvailable}</p>
        <p><span class="book-property">Borrowed By:</span> ${currBooks.borrowedBy}</p><br><br>`;
    }
    
    res.send(content);
})

app.get("/borrow-or-return", (req,res)=>{
    console.log(`Received Request at /see-all endpoint on port ${port}`);
    return res.sendFile(path.join(__dirname,"form.html"))
})


app.post("/borrow", (req,res)=>{
    const Data = [];
    for (let currBooks of libraryData){
        console.log(currBooks);
        Data.push(currBooks)
        console.log(Data);
        if (currBooks.title === req.body.bookTitle){
            console.log(`DEBUG: Book Title Entered: ${req.body.bookTitle}`);
            if (currBooks.isAvailable === false && currBooks.borrowedBy !== req.body.cardNum ){
                return res.send("ERROR: You cannot borrow this book because it is borrowed by a different user.")
            }
            else if ( currBooks.isAvailable === false && currBooks.borrowedBy === req.body.cardNum){
                return res.send("ERROR: You already have this book checked out!")
            }
            else if (currBooks.isAvailable === true && currBooks.borrowedBy === "" ){
                currBooks.isAvailable = false;
                currBooks.borrowedBy = req.body.cardNum;
                return res.send(`
                SUCCESS: Book Borrowed! <a href='/see-all'>See All Books</a>
                `);
            }
        }
    }
    return res.send(`ERROR: "${req.body.bookTitle}" is not in the library`);
})



app.post("/return", (req, res) => {
    const returnedBookTitle = req.body.booktitle;

    const returnedBook = findBook(returnedBookTitle);

    if (returnedBook) {
        if (returnedBook.isAvailable === false) {
            returnedBook.isAvailable = true;
            returnedBook.borrowedBy = "";

            const successMessage = `SUCCESS: Book Returned! <a href='/see-all'>See All Books</a>`;
            res.send(successMessage);
        } else {
            res.send("ERROR: The book cannot be returned. Please check the book status.");
        }
    } else {
        res.send(`ERROR: "${returnedBookTitle}" is not in the library`);
    }
});

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})