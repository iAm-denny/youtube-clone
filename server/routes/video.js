const route = require("express").Router();
const pool = require("../Database/db");
const authorization = require("../Middleware/authorization");

route.post("/post", authorization, async (req, res) => {
  try {
    const { video_url, description, title } = req.body;
    const video = await pool.query(
      "INSERT INTO videos (user_id, video_url, title, description, timestamp) VALUES($1, $2, $3, $4,Now()) RETURNING *",
      [req.user_id, video_url,title, description ]
    );
    return res.json(video.rows[0]);
  } catch (err) {
    throw new Error(err);
  }
});

route.get("/videos", async (req, res) => {
  try {
    const videos = await pool.query(
      "SELECT  title,profileimg,video_id,video_url,videos.timestamp,user_name,users.user_id FROM videos JOIN users ON videos.user_id = users.user_id ORDER BY videos.timestamp desc"
    );
    return res.json(videos.rows);
  } catch (err) {
    throw new Error(err);
  }
});

route.get("/specific-video/:video_id", async (req, res) => {
  try {

    const  {video_id}  = req.params;
    const video = await pool.query(
      "SELECT description,title,videos.timestamp,user_name,profileimg,video_url,video_id,users.user_id FROM videos JOIN users ON  videos.user_id = users.user_id WHERE video_id = $1",
      [video_id]
    );
    return res.json(video.rows[0]);
  } catch (err) {
    throw new Error(err);
  }
});

route.get("/likes/:video_id", async (req, res) => {
  try {
    const  {video_id}  = req.params;
    const like = await pool.query(
      "SELECT Count(*) FROM likes WHERE video_id = $1",
      [video_id]
    );
    const addOrNot = await pool.query(
      "SELECT * FROM likes WHERE user_id =$1",
      [req.user_id]
    )

    return res.json(like.rows[0].count);
  } catch (err) {
    throw new Error(err);
  }
});

route.post("/likes/:video_id", authorization, async (req, res) => {
  try {
    const { video_id } = req.params
    const { user_id } = req.body;
    console.log(user_id)
    const exist = await pool.query(
      "SELECT * FROM likes WHERE video_id = $1 AND user_id = $2",
      [video_id, req.user_id]
    );
    if (exist.rows.length === 1) {
      await pool.query(
        "DELETE FROM likes WHERE video_id = $1 AND user_id = $2",
        [video_id, req.user_id]
      );
      await pool.query(
        "DELETE FROM notification WHERE video_id = $1 AND user_id =$2 AND sender_id = $3",
        [video_id, user_id, req.user_id]
      );
      return res.json({ likeUnactive: "likeUnactive" });
    } else {
      const add = await pool.query(
        "INSERT INTO likes (video_id,user_id, timestamp) VALUES($1, $2,NOW())",
        [video_id, req.user_id]
      );
      const addNoti = await pool.query(
        "INSERT INTO notification (user_id,sender_id, video_id, timestamp) VALUES($1, $2, $3, NOW()) RETURNING * ",
        [user_id, req.user_id, video_id]
      );
      return res.json({ likeActive: add.rows, addNoti: addNoti.rows });
    }
  } catch (err) {
    throw new Error(err);
  }
});

route.get("/readnotification", authorization, async (req, res) => {
  try {
    const getNotifiaction = await pool.query(
      "SELECT notification_id,users.user_name, users.profileimg, notification.video_id, notification.timestamp, notification.read  FROM notification JOIN users ON notification.sender_id = users.user_id WHERE notification.user_id = $1",
      [req.user_id]
    );
    const getUnread = await pool.query (
      "SELECT COUNT(*) FROM notification where user_id = $1 AND read = 'false'", [req.user_id]
    )
    return res.json({getNotification:getNotifiaction.rows, getUnread:getUnread.rows[0]});
  } catch (err) {
    return res.json(err)
  }
});

route.post("/readnotification", authorization, async (req, res) => {
  try {
    console.log(req.user_id)
    const read = await pool.query(
      "UPDATE notification SET read ='true' WHERE user_id = $1 RETURNING * ",
      [req.user_id]
    );
    return res.json(read.rows);
  } catch (err) {
    return res.json(err)
  }
});

route.get("/comments/:video_id", async (req, res) => {
  try {
    const comments = await pool.query(
      "SELECT *  FROM comments JOIN users ON comments.user_id =  users.user_id WHERE comments.video_id = $1 ORDER BY comments.timestamp",
      [req.params.video_id]
    );
    return res.json(comments.rows);
  } catch (err) {
    throw new Error(err);
  }
});

route.post("/comments", authorization, async (req, res) => {
  try {
    console.log(req.body)
    const { cmt, video_id  } = req.body;
    const comments = await pool.query(
      "INSERT INTO comments (video_id, user_id, body ,timestamp) VALUES( $1, $2, $3, NOW()) RETURNING * ",
      [video_id, req.user_id, cmt ]
    );
    return res.json(comments.rows);
  } catch (err) {
    return res.json(err)
  }
});

route.get("/subscription", authorization, async (req, res) => {
  try {
    const subscriptions = await pool.query(
      "SELECT * FROM subscriptions JOIN videos ON subscriptions.user_id = videos.user_id JOIN users ON videos.user_id = users.user_id   WHERE followbyuser_id = $1",
      [req.user_id]
    );
    return res.json(subscriptions.rows);
  } catch (err) {
    throw new Error(err);
  }
});

route.post("/subscription", authorization, async (req, res) => {
  try {
    console.log(req.body)
    const { user_id } = req.body;
    const subscriptions = await pool.query(
      "SELECT * FROM subscriptions WHERE user_id = $1 AND followbyuser_id = $2",
      [user_id, req.user_id]
    );
    if (subscriptions.rows.length === 1) {
      const deleted = await pool.query(
        "DELETE FROM subscriptions WHERE user_id = $1 AND followbyuser_id = $2",
        [user_id, req.user_id]
      );
      return res.json({follow:"UnSubscribed"});
    } else {
      const addSub = await pool.query(
        "INSERT INTO subscriptions (user_id, followbyuser_id, timestamp) VALUES($1, $2, NOW())",
        [user_id, req.user_id]
      );
      return res.json({follow:"Subscribed"});
    }
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = route;
