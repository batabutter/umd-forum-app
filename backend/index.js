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

app.put("/posts/:id", async(req, res) => {
    try {
        const { id } = req.params
        const { content } = req.body
        const updatePost = await pool.query("UPDATE posts SET content = $1 WHERE post_id = $2 RETURNING *",
            [content, id])
        res.json(updatePost.rows[0])
    } catch (error) {
        console.error(error.message)
    }
})

// edit a comment 

app.put("/posts/:post_id/comments/:comment_id", async(req, res) => {
    try {
        const { post_id, comment_id } = req.params
        const { content } = req.body
        const updateComment = await pool.query("UPDATE comments SET content = $1 WHERE post_id = $2 AND comment_id = $3 RETURNING *",
            [content, post_id, comment_id])
        res.json(updateComment.rows[0])
    } catch (error) {
        console.error(error.message)
    }
})


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

app.put("/posts/:id/upvote", async(req, res) => {
    try {
        const { id } = req.params
        const upvotePost = await pool.query("UPDATE posts SET upvotes = upvotes + 1 WHERE post_id = $1 RETURNING *",
            [id])
        res.json(upvotePost.rows[0])
    } catch (error) {
        console.error(error.message)
    }
})


// downvote a post

app.put("/posts/:id/downvote", async(req, res) => {
    try {
        const { id } = req.params
        const upvotePost = await pool.query("UPDATE posts SET downvotes = downvotes + 1 WHERE post_id = $1 RETURNING *",
            [id])
        res.json(upvotePost.rows[0])
    } catch (error) {
        console.error(error.message)
    }
})

// upvote a comment

app.put("/posts/:post_id/comments/:comment_id/upvote", async(req, res) => {
    try {
        const { post_id, comment_id } = req.params
        const upvoteComment = await pool.query("UPDATE comments SET upvotes = upvotes + 1 WHERE comment_id = $1 AND post_id = $2 RETURNING *",
            [comment_id, post_id])
        res.json(upvoteComment.rows[0])
    } catch (error) {
        console.error(error.message)
    }
})

// downvote a comment

app.put("/posts/:post_id/comments/:comment_id/downvote", async(req, res) => {
    try {
        const { post_id, comment_id } = req.params
        const downvoteComment = await pool.query("UPDATE comments SET downvotes = downvotes + 1 WHERE comment_id = $1 AND post_id = $2 RETURNING *",
            [comment_id, post_id])
        res.json(downvoteComment.rows[0])
    } catch (error) {
        console.error(error.message)
    }
})

// get upvotes from a post

app.get("/posts/:id/upvotes", async (req, res) => {

    try {
        const { id } = req.params
        const upvotes = await pool.query("SELECT upvotes FROM posts WHERE post_id = $1",
            [id]
        )
        res.json(upvotes.rows[0])
    } catch (error) {
        console.log(error.message)
    }

})

// get downvotes from a post

app.get("/posts/:id/downvotes", async (req, res) => {

    try {
        const { id } = req.params
        const downvotes = await pool.query("SELECT downvotes FROM posts WHERE post_id = $1",
            [id]
        )
        res.json(downvotes.rows[0])
    } catch (error) {
        console.log(error.message)
    }

})


// get upvotes from a comment

app.get("/posts/:post_id/comments/:comment_id/upvotes", async (req, res) => {

    try {
        const { post_id, comment_id } = req.params
        const upvotes = await pool.query("SELECT upvotes FROM comments WHERE post_id = $1 AND comment_id = $2",
            [post_id, comment_id]
        )
        res.json(upvotes.rows[0])
    } catch (error) {
        console.log(error.message)
    }

})


// get downvotes from a comment

app.get("/posts/:post_id/comments/:comment_id/upvotes", async (req, res) => {

    try {
        const { post_id, comment_id } = req.params
        const downvotes = await pool.query("SELECT downvotes FROM comments WHERE post_id = $1 AND comment_id = $2",
            [post_id, comment_id]
        )
        res.json(downvotes.rows[0])
    } catch (error) {
        console.log(error.message)
    }

})

// get number of comments from a post

app.get("/posts/:id/comments/count", async (req, res) => {

    try {
        const { id } = req.params
        const num_comments = await pool.query("SELECT num_comments FROM posts WHERE post_id = $1",
            [id]
        )
        res.json(num_comments.rows[0])
    } catch (error) {
        console.log(error.message)
    }

})

app.listen(5000, () => {
    console.log("Server started on port 5000")
})