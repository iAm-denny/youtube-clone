const express = require('express')
const cors = require('cors')

require('dotenv').config()

const app = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use('/auth', require('./routes/auth'))
app.use('/video', require('./routes/video'))


app.listen(process.env.SERVER_PORT, () => console.log(process.env.SERVER_PORT))