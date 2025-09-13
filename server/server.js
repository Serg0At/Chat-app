import 'dotenv/config';
import express from 'express';
import path from 'path';

import { connectDB } from './src/lib/db.js';

import authRoutes from './src/routes/auth.route.js';
import messageRoutes from './src/routes/message.route.js'

const PORT = process.env.PORT || 3000

const app = express();
const __dirname = path.resolve();

app.use(express.json()); // req.body

app.use('/api/auth', authRoutes)
app.use('/api/message', messageRoutes)

// one of many ways for deployment, easy way because we deploy only backend and it serves both api and client side
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")))

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client', 'dist', 'index.html'))
    })
}

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
    connectDB()
})