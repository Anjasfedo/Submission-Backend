// Importing individual handler functions from the handlers.js file
const {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
  deleteBookByIdHandler,
} = require("./handlers");

// Defining routes for the application
const routes = [
  {
    method: "POST", // HTTP method for adding a book
    path: "/books", // URL path for adding a book
    handler: addBookHandler, // Handler function for adding a book
  },
  {
    method: "GET", // HTTP method for getting all books
    path: "/books", // URL path for getting all books
    handler: getAllBooksHandler, // Handler function for getting all books
  },
  {
    method: "GET", // HTTP method for getting a book by ID
    path: "/books/{bookId}", // URL path for getting a book by ID
    handler: getBookByIdHandler, // Handler function for getting a book by ID
  },
  {
    method: "PUT", // HTTP method for updating a book by ID
    path: "/books/{bookId}", // URL path for updating a book by ID
    handler: updateBookByIdHandler, // Handler function for updating a book by ID
  },
  {
    method: "DELETE", // HTTP method for deleting a book by ID
    path: "/books/{bookId}", // URL path for deleting a book by ID
    handler: deleteBookByIdHandler, // Handler function for deleting a book by ID
  },
];

// Exporting the routes for use in the main application
module.exports = routes;
