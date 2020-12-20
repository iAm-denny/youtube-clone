CREATE DATABASE youtube;

CREATE TABLE users (
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL ,   
    profileImg VARCHAR(255) NOT NULL,
    timestamp VARCHAR(255) NOT NULL
);  
ALTER TABLE users ADD profileImg varchar(255) NOT NULL;
CREATE TABLE videos (
    video_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(user_id),
    video_url VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    timestamp VARCHAR(255) NOT NULL
);

CREATE TABLE likes (
    like_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    video_id uuid REFERENCES videos(video_id),
    user_id uuid REFERENCES users(user_id),
    timestamp VARCHAR(255) NOT NULL
);

CREATE TABLE comments (
    comment_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    video_id uuid REFERENCES videos(video_id) NOT NULL,
    user_id uuid REFERENCES users(user_id) NOT NULL,
    body TEXT NOT NULL,
    timestamp VARCHAR(255) NOT NULL
);

CREATE TABLE subscriptions (
    sub_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(user_id),
    followByUser_id uuid REFERENCES users(user_id),
    timestamp VARCHAR(255) NOT NULL
);

CREATE TABLE notification (
    notification_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES users(user_id),
    sender_id uuid REFERENCES users(user_id),
    video_id uuid REFERENCES videos(video_id),
    read VARCHAR(10) DEFAULT 'false',
    timestamp VARCHAR(255) NOT NULL
)