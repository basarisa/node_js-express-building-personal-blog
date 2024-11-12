import express from "express";
import cors from "cors";
import postsRouter from "./routers/postsRouter.mjs";

const app = express();
const port = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello TechUp!");
});

app.use("/posts", postsRouter);

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
