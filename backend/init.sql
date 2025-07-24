CREATE DATABASE umdforum;

DROP TABLE comment_votes;

DROP TABLE post_votes;

DROP TABLE comments;

DROP TABLE posts CASCADE;

DROP TABLE accounts CASCADE;

CREATE TABLE accounts (
    account_id SERIAL PRIMARY KEY,
    post_list_id,
    user_name varchar(80),
    password_salt UUID NOT NULL,
    password_hash text NOT NULL,
    reputation numeric DEFAULT 0,
    num_posts numeric DEFAULT 0,
    num_comments numeric DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_post_list FOREIGN KEY (post_list_id) REFERENCES post_list (post_list_id)
);

CREATE TABLE posts (
    post_id SERIAL PRIMARY KEY,
    account_id int NOT NULL,
    title varchar(80),
    content varchar(80),
    created_at TIMESTAMP DEFAULT NOW(),
    num_comments numeric DEFAULT 0,
    CONSTRAINT fk_account FOREIGN KEY (account_id) REFERENCES accounts (account_id)
);

CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    post_id int NOT NULL,
    account_id INT NOT NULL,
    content varchar(80),
    num_replies numeric DEFAULT 0,
    CONSTRAINT fk_post FOREIGN KEY (post_id) REFERENCES posts (post_id),
    CONSTRAINT fk_comment_account FOREIGN KEY (account_id) REFERENCES accounts (account_id)
);

CREATE TABLE post_votes (
    post_vote_id SERIAL PRIMARY KEY,
    post_id int NOT NULL,
    account_id int NOT NULL,
    vote_val numeric DEFAULT 0,
    CONSTRAINT fk_post FOREIGN KEY (post_id) REFERENCES posts (post_id),
    CONSTRAINT fk_account FOREIGN KEY (account_id) REFERENCES accounts (account_id),
    CONSTRAINT unique_post_vote UNIQUE (post_id, account_id),
    check (vote_val in (-1, 1))
);

CREATE TABLE comment_votes (
    comment_vote_id SERIAL PRIMARY KEY,
    comment_id int NOT NULL,
    account_id int NOT NULL,
    vote_val numeric DEFAULT 0,
    CONSTRAINT fk_comment FOREIGN KEY (comment_id) REFERENCES comments (comment_id),
    CONSTRAINT fk_account FOREIGN KEY (account_id) REFERENCES accounts (account_id),
    CONSTRAINT unique_comment_vote UNIQUE (comment_id, account_id),
    check (vote_val in (-1, 1))
);

-- Import
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Function declaration
CREATE OR REPLACE PROCEDURE register_user(
    IN login_name TEXT,
    IN password_text TEXT
)
LANGUAGE plpgsql
AS
$$
DECLARE
    v_salt      UUID;
BEGIN

    -- Check NULL
    IF login_name IS NULL OR password_text IS NULL THEN
        RAISE EXCEPTION 'Username or password is null';
    END IF;

    -- Check if the username already exists
    IF EXISTS   (SELECT 1 FROM accounts WHERE user_name = login_name) THEN
        RAISE EXCEPTION 'Username is already taken';
    END IF;

    v_salt      := gen_random_uuid();

    INSERT INTO accounts(user_name, password_salt, password_hash)
    VALUES (
        login_name,
        v_salt,
        sfn_hash_password(password_text, v_salt)
    );

END;
$$;

CREATE OR REPLACE FUNCTION sfn_hash_password(
	p_password text,
	p_salt uuid)
RETURNS character varying
AS 
$$
DECLARE
    v_hashed_password 	VARCHAR(128);
    v_pwd_and_salt 		TEXT;
BEGIN
    -- Concatenate password with salt
    v_pwd_and_salt := p_password || CAST(p_salt AS TEXT);
    
    -- Use PostgreSQL's built-in cryptographic hash function with explicit type casting
    v_hashed_password := encode(
       digest(v_pwd_and_salt::bytea, 'sha512'::text), 
        'hex'
    );
    
    RETURN v_hashed_password;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE vote_post(
    p_post_id int,
    p_account_id int,
    p_vote_val int,
    p_is_comment boolean)
LANGUAGE plpgsql
AS
$$
DECLARE
    curr_vote int;
BEGIN
    -- Check null
    IF (p_post_id IS NULL OR p_account_id IS NULL) THEN
        RAISE EXCEPTION 'Post id or account id is invalid';
    END IF;

    -- Make sure you're only downvoting or upvoting a post
    IF (p_vote_val <> 1 AND p_vote_val <> -1) THEN
        RAISE EXCEPTION 'vote_val is invalid';
    END IF;

    -- Check if the vote already exists and is the same value as what you
        -- giving. If it is. Delete the vote.
    IF (NOT p_is_comment) THEN
        SELECT vote_val INTO curr_vote 
        FROM post_votes 
        WHERE post_id = p_post_id AND account_id=p_account_id;
    ELSE

        SELECT vote_val INTO curr_vote 
        FROM comment_votes 
        WHERE comment_id = p_post_id AND account_id=p_account_id;

    END IF;

    IF (FOUND AND curr_vote = p_vote_val) THEN

        IF (NOT p_is_comment) THEN
            DELETE FROM post_votes
            WHERE post_id=p_post_id AND account_id=p_account_id;
        ELSE
            DELETE FROM comment_votes
            WHERE comment_id=p_post_id AND account_id=p_account_id;

        END IF;

    ELSE
        -- Otherwise, update the upvote with a downvote, or vice versa
        IF (NOT p_is_comment) THEN
            INSERT INTO post_votes(post_id, account_id, vote_val) 
            VALUES(
                p_post_id, 
                p_account_id,
                p_vote_val
            )
            ON CONFLICT (post_id, account_id)
            DO UPDATE SET vote_val=p_vote_val;
        ELSE
            INSERT INTO comment_votes(comment_id, account_id, vote_val) 
            VALUES(
                p_post_id, 
                p_account_id,
                p_vote_val
            )
            ON CONFLICT (comment_id, account_id)
            DO UPDATE SET vote_val=p_vote_val;
        END IF;
        

    END IF;
END;
$$;

CREATE OR REPLACE PROCEDURE check_edit(
    p_post_id INT,
    p_account_id INT,
    p_content TEXT)
LANGUAGE plpgsql
AS
$$
BEGIN

    -- Check null
    IF (p_post_id IS NULL OR p_account_id IS NULL) THEN
        RAISE EXCEPTION 'Post id or account id is invalid';
    END IF;

    -- Check to make sure the account lines up with the post id
    IF EXISTS (
        SELECT 1 FROM posts 
        WHERE post_id = p_post_id AND account_id = p_account_id

    ) THEN
        UPDATE posts
        SET content = p_content
        WHERE post_id=p_post_id;
    ELSE
        RAISE EXCEPTION 'This post does not belong to the user';
    END IF;
    
END;
$$;