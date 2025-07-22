const express = require("express")
const cors = require("cors")
const pool = require("./db")

app = express()

app.use(cors())
app.use(express.json())

/*
    Make the style more consistent PLEASE
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

// Get an account with a specific username (This should maybe be changed?)

app.get("/accounts/:username", async (req, res) => {

    try {
        const { username } = req.params
        const accounts = await pool.query("SELECT account_id, user_name, \
            reputation, num_posts, num_comments, created_at FROM accounts WHERE user_name = $1",
            [username]
        )

        res.json(accounts.rows[0])
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

// upvote a post

app.post("/posts/:post_id/upvote/:account_id", async (req, res) => {
    try {
        const { post_id, account_id } = req.params

        await pool.query(
            "CALL vote_post($1, $2, $3, $4)",
            [post_id, account_id, 1, false])

        const upvotePost = await pool.query(
            "SELECT * FROM post_votes \
            WHERE post_id=$1 AND account_id=$2",
            [post_id, account_id]
        )

        if (upvotePost.rows[0])
            res.json(upvotePost.rows);
        else
            res.json("Post upvote removed!")
    } catch (error) {
        console.error(error.message)
    }
})


// downvote a post

app.post("/posts/:post_id/downvote/:account_id", async (req, res) => {
    try {
        const { post_id, account_id } = req.params

        await pool.query(
            "CALL vote_post($1, $2, $3, $4)",
            [post_id, account_id, -1, false])

        const downvotePost = await pool.query(
            "SELECT * FROM post_votes \
            WHERE post_id=$1 AND account_id=$2",
            [post_id, account_id]
        )


        if (downvotePost.rows[0])
            res.json(downvotePost.rows);
        else
            res.json("Post downvote removed!")
    } catch (error) {
        console.error(error.message)
    }
})

// check if a vote is upvoted or downvoted

app.get("/posts/:post_id/vote/:account_id", async (req, res) => {
    try {
        const { post_id, account_id } = req.params

        const json = {
            upvoted: false,
            downvoted: false
        }

        const upvotePost = await pool.query(
            "SELECT * FROM post_votes \
            WHERE post_id=$1 AND account_id=$2 AND vote_val=1",
            [post_id, account_id]
        )

        console.log(upvotePost.rows[0])

        const downvotePost = await pool.query(
            "SELECT * FROM post_votes \
            WHERE post_id=$1 AND account_id=$2 AND vote_val=-1",
            [post_id, account_id]
        )

        if (upvotePost.rowCount > 0)
            json["upvoted"] = true
        else if(downvotePost.rowCount > 0)
            json["downvoted"] = true


        res.json(json);
    } catch (error) {
        console.error(error.message)
    }
})

// Get ratio from a post

app.get("/posts/:id/ratio", async (req, res) => {

    try {
        
        const { id } = req.params
        const upvotes = await pool.query("SELECT SUM(vote_val) FROM post_votes \
            WHERE post_id = $1",
            [id]
        )

        const sum = upvotes.rows[0].sum

        res.json({sum: sum == null ? 0 : sum})
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

/*

Comment API

*/

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


            res.json(newComment.rows[0])
        } catch (error) {
            console.log(error.message)
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


// upvote a comment

app.post("/comments/:comment_id/upvote/:account_id", async (req, res) => {
    try {
        const { comment_id, account_id } = req.params

        await pool.query(
            "CALL vote_post($1, $2, $3, $4)",
            [comment_id, account_id, 1, true])

        const upvoteComment = await pool.query(
            "SELECT * FROM comment_votes \
            WHERE comment_id=$1 AND account_id=$2",
            [comment_id, account_id]
        )

        if (upvoteComment.rows[0])
            res.json(upvoteComment.rows);
        else
            res.json("Comment upvote removed!")
    } catch (error) {
        console.error(error.message)
    }
})

// downvote a comment

app.post("/comments/:comment_id/downvote/:account_id", async (req, res) => {
    try {
        const { comment_id, account_id } = req.params

        await pool.query(
            "CALL vote_post($1, $2, $3, $4)",
            [comment_id, account_id, -1, true])

        const downvoteComment = await pool.query(
            "SELECT * FROM comment_votes \
            WHERE comment_id=$1 AND account_id=$2",
            [comment_id, account_id]
        )

        if (downvoteComment.rows[0])
            res.json(downvoteComment.rows);
        else
            res.json("Comment downvote removed!")
    } catch (error) {
        console.error(error.message)
    }
})


// Get ratio for a comment

app.get("/comments/:id/ratio", async (req, res) => {

    try {
        
        const { id } = req.params
        const votes = await pool.query("SELECT SUM(vote_val) FROM comment_votes \
            WHERE comment_id = $1",
            [id]
        )

        const sum = votes.rows[0].sum

        res.json({sum: sum == null ? 0 : sum})
    } catch (error) {
        console.log(error.message)
    }

})


// get user from a comment id on a post

app.get("/comments/:comment_id/user", async (req, res) => {

    try {

        const { post_id, comment_id } = req.params

        const account = await pool.query("SELECT account_id FROM comments \
            WHERE comment_id = $1",
            [comment_id]
        )

        const user = await pool.query("SELECT user_name FROM accounts \
            WHERE account_id = $1",
            [account.rows[0].account_id]
        )

        res.json(user.rows[0].user_name)

    } catch (error) {
        console.log(error.message)
    }

})

// Check to see if a comment is upvoted or downvoted

app.get("/comments/:comment_id/vote/:account_id", async (req, res) => {
    try {
        const { comment_id, account_id } = req.params

        const json = {
            upvoted: false,
            downvoted: false
        }

        const upvotePost = await pool.query(
            "SELECT * FROM comment_votes \
            WHERE comment_id=$1 AND account_id=$2 AND vote_val=1",
            [comment_id, account_id]
        )

        console.log(upvotePost.rows[0])

        const downvotePost = await pool.query(
            "SELECT * FROM comment_votes \
            WHERE comment_id=$1 AND account_id=$2 AND vote_val=-1",
            [comment_id, account_id]
        )

        if (upvotePost.rowCount > 0)
            json["upvoted"] = true
        else if(downvotePost.rowCount > 0)
            json["downvoted"] = true


        res.json(json);
    } catch (error) {
        console.error(error.message)
    }
})