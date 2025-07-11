CREATE DATABASE umdforum;

DROP TABLE accounts CASCADE;

DROP TABLE posts CASCADE;

DROP TABLE comments;

CREATE TABLE accounts (
    account_id SERIAL PRIMARY KEY,
    user_name varchar(80),
    password_salt UUID NOT NULL,
    password_hash text NOT NULL,
    reputation numeric DEFAULT 0,
    num_posts numeric DEFAULT 0,
    num_comments numeric DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE posts (
    post_id SERIAL PRIMARY KEY,
    account_id int NOT NULL,
    title varchar(80),
    content varchar(80),
    created_at TIMESTAMP DEFAULT NOW(),
    upvotes numeric DEFAULT 0,
    downvotes numeric DEFAULT 0,
    num_comments numeric DEFAULT 0,
    CONSTRAINT fk_account FOREIGN KEY (account_id) REFERENCES accounts (account_id)
);

CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    post_id int NOT NULL,
    account_id INT NOT NULL,
    content varchar(80),
    upvotes numeric DEFAULT 0,
    downvotes numeric DEFAULT 0,
    num_replies numeric DEFAULT 0,
    CONSTRAINT fk_post FOREIGN KEY (post_id) REFERENCES posts (post_id),
    CONSTRAINT fk_comment_account FOREIGN KEY (account_id) REFERENCES accounts (account_id)
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