const express = require("express")
const cors = require("cors")
const pool = require("./db")

app = express()

app.use(cors())
app.use(express.json())

// add a post

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

// add a comment 

app.post("/posts/:id/comments", async (req, res) => {

    try {
        const { id } = req.params
        const { content } = req.body

        const newComment = await pool.query(
            "INSERT INTO comments(post_id, content) VALUES($1, $2) RETURNING *",
            [id, content]
        )

        res.json(newComment.rows[0])
    } catch (error) {
        console.log(error.message)
    }

})


// get all posts

app.get("/posts", async (req, res) => {

    try {
        const allPosts = await pool.query("SELECT * FROM posts")
        res.json(allPosts.rows)
    } catch (error) {
        console.log(error.message)
    }

})

// get a specifc post

app.get("/posts/:id", async (req, res) =>{

    try {
        const { id } = req.params
        const post = await pool.query("SELECT * FROM posts WHERE post_id = $1",
            [id]
        )
        res.json(post.rows[0])
    } catch (error) {
        console.log(error.message)
    }

})

// get comments from a specific post

app.get("/posts/:id/comments", async (req, res) =>{

    try {
        const { id } = req.params
        const comments = await pool.query("SELECT * FROM comments WHERE post_id = $1",
            [id]
        )
        res.json(comments.rows)
    } catch (error) {
        console.log(error.message)
    }

})

// edit a post



// edit a comment 

// delete a post (also deletes all comments for that post)

app.delete("/posts/:id", async (req, res) => {

    try {
        const { id } = req.params
        const deleteComments = await pool.query(
            "DELETE FROM comments WHERE post_id = $1",
            [id])    
        const deletePost = await pool.query(
            "DELETE FROM posts WHERE post_id = $1",
            [id])
        res.json(`Post deleted with id ${id}`)
    } catch (error) {
        console.log(error.message)
    }
    
})

// delete a comment

app.delete("/posts/:post_id/comments/:comment_id", async (req, res) => {

    try {
        const { post_id, comment_id } = req.params
        const deleteComment = await pool.query(
            "DELETE FROM comments WHERE post_id = $1 AND comment_id = $2;",
            [post_id, comment_id])
        res.json(`Post comment id delete with id ${comment_id} and post_id \
            ${post_id}`)
    } catch (error) {
        console.log(error.message)
    }
    
})

// upvote a post

// downvote a post

// get upvotes from a post

// get downvotes from a post

app.listen(5000, () => {
    console.log("Server started on port 5000")
})