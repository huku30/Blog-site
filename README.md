# Blog Project Backend

This is the backend for the Blog Project, built with Node.js and Express.js. It provides RESTful APIs for user authentication, blog management, and user profile management.

## Features

- User registration and login
- Create, read, update, and delete blog posts
- User profile management

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the backend directory:
   ```
   cd blog-project/backend
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Set up your MongoDB database and update the connection string in `src/config/db.js`.

5. Start the server:
   ```
   npm start
   ```

## API Endpoints

- **Authentication**
  - `POST /api/auth/register` - Register a new user
  - `POST /api/auth/login` - Login an existing user

- **Blogs**
  - `POST /api/blogs` - Create a new blog post
  - `GET /api/blogs` - Retrieve all blog posts
  - `GET /api/blogs/:id` - Retrieve a single blog post
  - `DELETE /api/blogs/:id` - Delete a blog post

## License

This project is licensed under the MIT License.