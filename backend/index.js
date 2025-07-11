const express = require("express")
const cors = require("cors")
const pool = require("./db")

app = express()

app.use(cors())
app.use(express.json())

/*
    
    Overall, if I want to make this app public, I need to secure the backend
    so that you require account data to make any changes

    Make it so reputation gets changed somehow given an upvote or a downvote

    Add getting number of posts and comments for future use

    Refactor for courses????? (I am not sure exactly what the plan is, but I 
    think I should get the basics working before I think too far ahead.)

    (I also have to refactor the backend)
*/

// add an account

app.post("/accounts", async (req, res) => {

    try {
        const { user_name, password } = req.body

        await pool.query(
            "CALL register_user($1, $2)",
            [user_name, password]
        );

        const newAccount = await pool.query(
            "SELECT account_id, user_name, reputation, num_posts, \
            num_comments, created_at FROM accounts WHERE user_name = $1",
            [user_name]
        );

        res.json(newAccount.rows[0])
    } catch (error) {
        console.log(error.message)
    }

})

// get all the registered accounts

app.get("/accounts", async (req, res) => {

    try {

        const allAccounts = await pool.query("SELECT account_id, user_name, \
            reputation, num_posts, num_comments, created_at FROM accounts")

        res.json(allAccounts.rows)
    } catch (error) {
        console.log(error.message)
    }


})

// TODO: delete an account (This needs way more security lmao)

/*

app.delete("/accounts", async (req, res) => {

    try {
        const { user_name, password} = req.body

        const newAccount = await pool.query(
            "CALL register_user($1, $2)",
            [user_name, password]
        );

        res.json(newAccount.rows[0])
    } catch (error) {
        console.log(error.message)
    }

})

*/

// add a post

app.post("/accounts/:id/posts", async (req, res) => {

    try {
        const { id } = req.params
        const { content, title } = req.body

        const newPost = await pool.query(
            "INSERT INTO posts(account_id, title, content) VALUES($1, $2, $3) RETURNING *",
            [id, title, content]
        );

        await pool.query("UPDATE accounts SET \
            num_posts = num_posts + 1 WHERE account_id = $1 RETURNING *",
            [id])

        res.json(newPost.rows[0])
    } catch (error) {
        console.log(error.message)
    }

})

// add a comment 

app.post("/posts/:post_id/comments/:poster_id",
    async (req, res) => {

        try {
            const { post_id, poster_id } = req.params
            const { content } = req.body

            const newComment = await pool.query(
                "INSERT INTO comments(post_id, account_id, content) \
                VALUES($1, $2, $3) RETURNING *",
                [post_id, poster_id, content]
            )

            await pool.query("UPDATE posts SET \
            num_comments = num_comments + 1 WHERE post_id = $1 RETURNING *",
                [post_id])

            await pool.query("UPDATE posts SET \
            num_comments = num_comments + 1 WHERE post_id = $1 RETURNING *",
                [post_id])

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

app.get("/posts/:id", async (req, res) => {

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

app.get("/posts/:id/comments", async (req, res) => {

    try {
        const { id } = req.params
        const comments = await pool.query("SELECT * FROM comments WHERE \
            post_id = $1",
            [id]
        )
        res.json(comments.rows)
    } catch (error) {
        console.log(error.message)
    }

})

// edit a post

app.put("/posts/:id", async (req, res) => {
    try {
        const { id } = req.params
        const { content } = req.body
        const updatePost = await pool.query("UPDATE posts SET \
            content = $1 WHERE post_id = $2 RETURNING *",
            [content, id])
        res.json(updatePost.rows[0])
    } catch (error) {
        console.error(error.message)
    }
})

// edit a comment 

app.put("/posts/:post_id/comments/:comment_id", async (req, res) => {
    try {
        const { post_id, comment_id } = req.params
        const { content } = req.body
        const updateComment = await pool.query("UPDATE comments SET \
            content = $1 WHERE post_id = $2 AND comment_id = $3 RETURNING *",
            [content, post_id, comment_id])
        res.json(updateComment.rows[0])
    } catch (error) {
        console.error(error.message)
    }
})


// delete a post (also deletes all comments for that post)

app.delete("/accounts/:account_id/posts/:post_id", async (req, res) => {

    try {
        const { account_id, post_id } = req.params

        const deleteComments = await pool.query(
            "DELETE FROM comments WHERE post_id = $1",
            [post_id])

        await pool.query(
            "DELETE FROM posts WHERE post_id = $1",
            [post_id])

        await pool.query(
            "UPDATE accounts SET \
            num_posts = num_posts - 1 WHERE account_id = $1 RETURNING *",
            [account_id]
        )
        res.json(`Post deleted with id ${post_id} and account ${account_id}`)
    } catch (error) {
        console.log(error.message)
    }

})

// delete a comment

app.delete("/posts/:post_id/comments/:comment_id/accounts/:poster_id", async (req, res) => {

    try {
        const { post_id, comment_id, poster_id } = req.params

        const deleteComment = await pool.query(
            "DELETE FROM comments WHERE post_id = $1 AND comment_id = $2;",
            [post_id, comment_id])

        if (deleteComment.rowCount == 0)
            return res.status(404).json({ error: "Comment does not exist"})

        await pool.query("UPDATE posts SET \
            num_comments = num_comments - 1 WHERE post_id = $1 RETURNING *",
            [post_id])

        await pool.query("UPDATE accounts SET \
            num_comments = num_comments - 1 WHERE account_id = $1 RETURNING *",
            [poster_id])

        res.json(`Post comment id delete with id ${comment_id} and post_id \
            ${post_id}`)
    } catch (error) {
        console.log(error.message)
    }

})

// upvote a post

app.put("/posts/:id/upvote", async (req, res) => {
    try {
        const { id } = req.params
        const upvotePost = await pool.query("UPDATE posts SET \
            upvotes = upvotes + 1 WHERE post_id = $1 RETURNING *",
            [id])
        res.json(upvotePost.rows[0])
    } catch (error) {
        console.error(error.message)
    }
})


// downvote a post

app.put("/posts/:id/downvote", async (req, res) => {
    try {
        const { id } = req.params
        const upvotePost = await pool.query("UPDATE posts SET \
            downvotes = downvotes + 1 WHERE post_id = $1 RETURNING *",
            [id])
        res.json(upvotePost.rows[0])
    } catch (error) {
        console.error(error.message)
    }
})

// upvote a comment

app.put("/posts/:post_id/comments/:comment_id/upvote", async (req, res) => {
    try {
        const { post_id, comment_id } = req.params
        const upvoteComment = await pool.query("UPDATE comments SET \
            upvotes = upvotes + 1 WHERE comment_id = $1 AND \
            post_id = $2 RETURNING *",
            [comment_id, post_id])
        res.json(upvoteComment.rows[0])
    } catch (error) {
        console.error(error.message)
    }
})

// downvote a comment

app.put("/posts/:post_id/comments/:comment_id/downvote", async (req, res) => {
    try {
        const { post_id, comment_id } = req.params
        const downvoteComment = await pool.query("UPDATE comments SET \
            downvotes = downvotes + 1 WHERE comment_id = $1 AND \
            post_id = $2 RETURNING *",
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
        const upvotes = await pool.query("SELECT upvotes FROM posts WHERE \
            post_id = $1",
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
        const downvotes = await pool.query("SELECT downvotes FROM posts WHERE \
            post_id = $1",
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
        const upvotes = await pool.query("SELECT upvotes FROM comments \
            WHERE post_id = $1 AND comment_id = $2",
            [post_id, comment_id]
        )
        res.json(upvotes.rows[0])
    } catch (error) {
        console.log(error.message)
    }

})


// get downvotes from a comment

app.get("/posts/:post_id/comments/:comment_id/downvotes", async (req, res) => {

    try {
        const { post_id, comment_id } = req.params
        const downvotes = await pool.query("SELECT downvotes FROM comments \
            WHERE post_id = $1 AND comment_id = $2",
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
        const num_comments = await pool.query("SELECT num_comments \
            FROM posts WHERE post_id = $1",
            [id]
        )
        res.json(num_comments.rows[0])
    } catch (error) {
        console.log(error.message)
    }

})

app.listen(5000, "0.0.0.0", () => {
    console.log("Server started on port 5000");
});