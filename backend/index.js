const express = require("express")
const cors = require("cors")
const pool = require("./db")

app = express()

app.use(cors())
app.use(express.json())

app.post("/posts", async (req, res) => {
    try {
        const { content, title } = req.body

        const newPost = await pool.query(
            "INSERT INTO posts(title, content) VALUES($1, $2) RETURNING *",
            [title, content]
        );

        res.json(newPost.rows[0])
    } catch (error) {
        console.log(error.message)
    }
})

app.listen(5000, () => {
    console.log("Server started on port 5000")
})