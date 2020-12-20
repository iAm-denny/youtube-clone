const route = require("express").Router();
const pool = require("../Database/db");
const bcrypt = require("bcrypt");
const generateJwt = require("../Middleware/generateJwt");
const authorization = require("../Middleware/authorization");

route.post("/signup", async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!/^[\w]{3,}@[a-zA-Z]{3,6}\.[a-z]{2,5}(\.[a-zA-Z]{2,5})?$/.test(email)) {
      return res.json("Your email is not validate");
    }

    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    if (user.rows.length !== 0) {
      return res.json("User already existed!!!");
    }
    const salt = await bcrypt.genSalt();
    const bcryptPassword = await bcrypt.hash(password, salt);
    const newUser = await pool.query(
      "INSERT INTO users (user_email, user_password, user_name,timestamp, profileImg) VALUES($1, $2, $3, Now(), 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfprGnUdkfOM7TTqA1D1-OyR849WC3bATRhw&usqp=CAU') RETURNING *",
      [email, bcryptPassword, name]
    );
    const token = generateJwt(newUser.rows[0].user_id);
    return res.json({ token, profileimg: user.profileimg });
  } catch (err) {
    throw new Error(err);
  }
});

route.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    if (user.rows.length == 0) {
      return res.status(401).json("Email or Password is incorrect");
    }
    const bcryptPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );
    if (!bcryptPassword) {
      return res.status(401).json("Email or Password incorrect");
    }
    const token = generateJwt(user.rows[0].user_id);
    return res.json({ token, profileimg: user.rows[0].profileimg, user_name: user.rows[0].user_name });
  } catch (err) {
    return res.json(err);
  }
});

route.get('/user', authorization, async (req,res) => {
   try {
    const data = await pool.query("SELECT * FROM users WHERE user_id = $1", [req.user_id])
    return res.json(data.rows[0])
   }
   catch(err) {
     return res.json(err.message)
   }
  
})

route.get("/is-verify", authorization, (req,res) => {
  try {
    return res.json(true)
  }
  catch(err) {
    return res.json(err.message)
  }
})
module.exports = route;
