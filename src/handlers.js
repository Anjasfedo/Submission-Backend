const { nanoid } = require("nanoid");
const books = require("./books");

const addBookHandler = (request, h) => {
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

  const id = nanoid();

  const finished = pageCount === readPage;

  const insertedAt = new Date().toISOString();

  const updatedAt = insertedAt;

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

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (!isSuccess) {
    const response = h
      .response({
        status: "fail",
        message: "Buku gagal ditambahkan",
      })
      .code(400);
    return response;
  }

  if (!name) {
    const response = h
    .response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    })
    .code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h
    .response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    })
    .code(400);
    return response;
  }

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

const getAllBooksHandler = (request, h) => {
  const queryParam = request.query;

  const filteredBooks = books.filter((book) => {
    let isMatched = true;

    if (
      queryParam.name &&
      !book.name
        .toLowerCase()
        .replace(/\s+/g, "")
        .includes(queryParam.name.toLowerCase().replace(/\s+/g, ""))
    ) {
      isMatched = false;
    }

    if (
      queryParam.reading !== undefined &&
      (book.reading !== (queryParam.reading === "1") ||
        book.reading !== (queryParam.reading !== "0"))
    ) {
      isMatched = false;
    }

    if (
      queryParam.finished !== undefined &&
      (book.finished !== (queryParam.finished === "1") ||
        book.finished !== (queryParam.finished !== "0"))
    ) {
      isMatched = false;
    }

    return isMatched;
  });

  const mapBooks = filteredBooks.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

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

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((n) => n.id === bookId)[0];

  if (!book) {
    const response = h
      .response({
        status: "fail",
        message: "Buku tidak ditemukan",
      })
      .code(404);
    return response;
  }

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

const updateBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

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

  const updatedAt = new Date().toISOString();

  const index = books.findIndex((n) => n.id === bookId);

  if (!name) {
    const response = h
      .response({
        status: "fail",
        message: "Gagal memperbarui buku. Mohon isi nama buku",
      })
      .code(400);
    return response;
  }

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

  if (index === -1) {
    const response = h
      .response({
        status: "fail",
        message: "Gagal memperbarui buku. Id tidak ditemukan",
      })
      .code(404);
    return response;
  }

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

  const response = h
    .response({
      status: "success",
      message: "Buku berhasil diperbarui",
    })
    .code(200);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((n) => n.id === bookId);

  if (index === -1) {
    const response = h
      .response({
        status: "fail",
        message: "Buku gagal dihapus. Id tidak ditemukan",
      })
      .code(404);
    return response;
  }

  books.splice(index, 1);

  const response = h
    .response({
      status: "success",
      message: "Buku berhasil dihapus",
    })
    .code(200);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
  deleteBookByIdHandler,
};
