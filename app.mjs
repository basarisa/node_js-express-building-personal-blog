import express from "express";
import cors from "cors";
import connectionPool from "./utils/db.mjs";

const app = express();
const port = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello TechUp!");
});

app.post("/posts", async (req, res) => {
  const newPost = req.body;
  try {
    const query = `INSERT INTO posts (title, image, category_id, description, content, status_id)
                   VALUES ($1, $2, $3, $4, $5, $6)`;
    const values = [
      newPost.title,
      newPost.image,
      newPost.category_id,
      newPost.description,
      newPost.content,
      newPost.status_id,
    ];
    await connectionPool.query(query, values);
    return res.status(201).json({ message: "Post created successfully" });
  } catch (error) {
    console.error("Error creating post:", error.message);
    return res.status(500).json({
      message: "Server could not create post due to a database error",
    });
  }
});

app.get("/posts", async (req, res) => {
  try {
    const results = await connectionPool.query(`SELECT * FROM posts`);
    return res.status(200).json({
      data: results.rows,
    });
  } catch (error) {
    console.error("Error reading posts:", error.message);
    return res.status(500).json({
      message: "Server could not read posts due to a database error",
    });
  }
});

app.get("/posts/:postId", async (req, res) => {
  const postIdFromClient = req.params.postId;
  try {
    const results = await connectionPool.query(
      `SELECT * FROM posts WHERE id=$1`,
      [postIdFromClient]
    );

    if (!results.rows[0]) {
      return res.status(404).json({
        message: `Server could not find a requested post (post id: ${postIdFromClient})`,
      });
    }

    return res.status(200).json({
      data: results.rows[0],
    });
  } catch (error) {
    console.error("Error reading post:", error.message);
    return res.status(500).json({
      message: "Server could not read post due to a database error",
    });
  }
});

app.put("/posts/:postId", async (req, res) => {
  const postIdFromClient = req.params.postId;
  const updatePost = { ...req.body };

  try {
    const result = await connectionPool.query(
      `
      UPDATE posts
      SET title = $2, 
          image = $3,
          category_id = $4,
          description = $5, 
          content = $6,
          status_id = $7
      WHERE id = $1
      `,
      [
        postIdFromClient,
        updatePost.title,
        updatePost.image,
        updatePost.category_id,
        updatePost.description,
        updatePost.content,
        updatePost.status_id,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: `Server could not find a requested post to update (post id: ${postIdFromClient})`,
      });
    }

    return res.status(200).json({
      message: "Updated post sucessfully",
    });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({
      message: "Server could not update post because database connection",
    });
  }
});
app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});

app.delete("/posts/:postId", async (req, res) => {
  const postIdFromClient = req.params.postId;

  try {
    const result = await connectionPool.query(
      `DELETE FROM posts
      WHERE id = $1
      `,
      [postIdFromClient]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({
        message: `Server could not find a requested post to delete (post id: ${postIdFromClient})`,
      });
    }

    return res.status(200).json({
      message: "Deleted post sucessfully",
    });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({
      message: "Server could not delete post because database connection",
    });
  }
});

//1)นักเขียนสามารถดูข้อมูลบทความอันเดียวได้
///posts/:postId
//respone {}
// 200 Response (Success) {}
//404  { "message": "Server could not find a requested post" }
//500   { "message": "Server could not read post because database connection" }

//2)นักเขียนสามารถแก้ไขบทความที่ได้เคยสร้างไว้ก่อนหน้านี้
// PUT	/posts/:postId
// 200 { "message": "Updated post sucessfully" }
// 404 { "message": "Server could not find a requested post to update" }
// 500 { "message": "Server could not update post because database connection" }
