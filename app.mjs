import express from "express";
import { booksRouter } from "./book-route/booksRouter.mjs";
import dotenv from "dotenv";
import authRouter from "./book-route/auth.mjs";
import { setupSwagger } from "./swagger.js";


const app = express();
const port = 4003;


dotenv.config();
app.use(express.json());  //🟢 


app.use("/books", booksRouter);


app.use("/auth", authRouter);

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


setupSwagger(app);


