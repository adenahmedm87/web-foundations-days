# Library Books REST API Design

This API allows clients to list, create, update and delete library books.
Requests and responses use JSON. The server assigns each new book an id.

## 1. List all books

- Method: GET
- Path: /books
- Description: Return an array of all books.
- Request body: None.
- Success status: 200 OK.

## 2. Get one book

- Method: GET
- Path: /books/42
- Description: Return the book with id 42.
- Request body: None.
- Success status: 200 OK.

## 3. Create a book

- Method: POST
- Path: /books
- Description: Create a book and return it with its assigned id.
- Example request body: {"title":"Things Fall Apart","author":"Chinua Achebe","publicationYear":1958}
- Success status: 201 Created.

## 4. Update a book

- Method: PATCH
- Path: /books/42
- Description: Update the supplied fields of book 42 and return the updated book.
- Example request body: {"title":"Updated Book Title","publicationYear":2026}
- Success status: 200 OK.

## 5. Delete a book

- Method: DELETE
- Path: /books/42
- Description: Delete book 42.
- Request body: None.
- Success status: 204 No Content.
- Response body: None.

## 6. List books by an author

- Method: GET
- Path: /books?author=Chinua%20Achebe
- Description: Return books matching the author query parameter.
- Request body: None.
- Success status: 200 OK.
- If no books match, return an empty array with status 200.

## Error responses

### 400 Bad Request

- Meaning: Submitted data or query parameters are invalid.
- Example: POST /books with an empty title.
- Example response: {"error":"The title must not be empty."}

### 404 Not Found

- Meaning: The requested book does not exist.
- Example: GET /books/999999 when that id is absent.
- Example response: {"error":"Book not found."}