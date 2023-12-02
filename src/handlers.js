// Importing the nanoid library for generating unique IDs
const { nanoid } = require("nanoid");

// Importing the array of books
const books = require("./books");

// Handler function to add a new book
const addBookHandler = (request, h) => {
  // Extracting data from the request payload
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // Validation checks for required fields
  if (!name) {
    // Sending a response for missing book name
    const response = h
      .response({
        status: "fail",
        message: "Gagal menambahkan buku. Mohon isi nama buku",
      })
      .code(400);
    return response;
  }

  // Validation check for readPage not exceeding pageCount
  if (readPage > pageCount) {
    // Sending a response for readPage exceeding pageCount
    const response = h
      .response({
        status: "fail",
        message:
          "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      })
      .code(400);
    return response;
  }

  // Generating a unique ID using nanoid
  const id = nanoid();

  // Determining if the book is finished based on readPage and pageCount
  const finished = pageCount === readPage;

  // Generating timestamps for when the book is inserted and updated
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  // Creating a new book object
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  // Adding the new book to the books array
  books.push(newBook);

  // Sending a success response with the new book ID
  const response = h
    .response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    })
    .code(201);
  return response;
};

// Handler function to get all books with optional query parameters
const getAllBooksHandler = (request, h) => {
  // Extracting query parameters from the request
  const queryParam = request.query;

  // Filtering books based on query parameters
  const filteredBooks = books.filter((book) => {
    let isMatched = true;

    // Filtering by book name if the name query parameter is present
    if (
      queryParam.name &&
      book.name &&
      !book.name
        .toLowerCase()
        .replace(/\s+/g, "")
        .includes(queryParam.name.toLowerCase().replace(/\s+/g, ""))
    ) {
      isMatched = false;
    }

    // Filtering by reading status if the reading query parameter is present
    if (
      queryParam.reading !== undefined &&
      (book.reading !== (queryParam.reading === "1") ||
        book.reading !== (queryParam.reading !== "0"))
    ) {
      isMatched = false;
    }

    // Filtering by finished status if the finished query parameter is present
    if (
      queryParam.finished !== undefined &&
      (book.finished !== (queryParam.finished === "1") ||
        book.finished !== (queryParam.finished !== "0"))
    ) {
      isMatched = false;
    }

    return isMatched;
  });

  // Mapping the filtered books to include only necessary information
  const mapBooks = filteredBooks.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  // Sending a success response with the filtered books
  const response = h
    .response({
      status: "success",
      data: {
        books: mapBooks,
      },
    })
    .code(200);
  return response;
};

// Handler function to get a specific book by ID
const getBookByIdHandler = (request, h) => {
  // Extracting the bookId parameter from the request
  const { bookId } = request.params;

  // Finding the book with the specified ID in the books array
  const book = books.filter((n) => n.id === bookId)[0];

  // Handling the case where the book is not found
  if (!book) {
    const response = h
      .response({
        status: "fail",
        message: "Buku tidak ditemukan",
      })
      .code(404);
    return response;
  }

  // Sending a success response with the found book
  const response = h
    .response({
      status: "success",
      data: {
        book,
      },
    })
    .code(200);
  return response;
};

// Handler function to update a book by ID
const updateBookByIdHandler = (request, h) => {
  // Extracting the bookId parameter from the request
  const { bookId } = request.params;

  // Extracting data from the request payload
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // Generating a timestamp for the update
  const updatedAt = new Date().toISOString();

  // Finding the index of the book with the specified ID in the books array
  const index = books.findIndex((n) => n.id === bookId);

  // Validation checks for required fields
  if (!name) {
    const response = h
      .response({
        status: "fail",
        message: "Gagal memperbarui buku. Mohon isi nama buku",
      })
      .code(400);
    return response;
  }

  // Validation check for readPage not exceeding pageCount
  if (readPage > pageCount) {
    const response = h
      .response({
        status: "fail",
        message:
          "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
      })
      .code(400);
    return response;
  }

  // Handling the case where the book with the specified ID is not found
  if (index === -1) {
    const response = h
      .response({
        status: "fail",
        message: "Gagal memperbarui buku. Id tidak ditemukan",
      })
      .code(404);
    return response;
  }

  // Updating the book in the books array
  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt,
  };

  // Sending a success response
  const response = h
    .response({
      status: "success",
      message: "Buku berhasil diperbarui",
    })
    .code(200);
  return response;
};

// Handler function to delete a book by ID
const deleteBookByIdHandler = (request, h) => {
  // Extracting the bookId parameter from the request
  const { bookId } = request.params;

  // Finding the index of the book with the specified ID in the books array
  const index = books.findIndex((n) => n.id === bookId);

  // Handling the case where the book with the specified ID is not found
  if (index === -1) {
    const response = h
      .response({
        status: "fail",
        message: "Buku gagal dihapus. Id tidak ditemukan",
      })
      .code(404);
    return response;
  }

  // Removing the book from the books array
  books.splice(index, 1);

  // Sending a success response
  const response = h
    .response({
      status: "success",
      message: "Buku berhasil dihapus",
    })
    .code(200);
  return response;
};

// Exporting all handler functions for use in other modules
module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
  deleteBookByIdHandler,
};
