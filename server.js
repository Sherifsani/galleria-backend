require('dotenv').config()
const express = require('express')
const connectToDb = require('./database/database')
const authRoutes = require('./routes/auth-routes')

connectToDb()

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use('/api/auth', authRoutes)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})