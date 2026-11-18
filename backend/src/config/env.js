import dotenv from "dotenv";

// Loaded from its own module and imported first in server.js.
// ES module imports are evaluated before the importing file's body, so calling
// dotenv.config() inside server.js ran *after* modules such as
// auth.controller.js had already read process.env.
dotenv.config();
