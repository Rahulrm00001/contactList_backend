const express = require('express')
const app = express()
require('dotenv').config()
const bodyParser = require('body-parser')
const cors = require('cors')
const errorHandler = require('./middleware/errorHandler')
const connectDb = require('./config/dbConnection')


connectDb()
app.use(cors())
app.use(bodyParser.json())
app.use(express.json())
app.use('/api/contact', require('./routes/contactRoutes'))
app.use(errorHandler)

//.env process
const PORT = process.env.PORT || 4000

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})




