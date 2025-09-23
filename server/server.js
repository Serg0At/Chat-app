import express from 'express';
import path from 'path';
import cors from 'cors'
import cookieParser from 'cookie-parser';

import { ENV } from './src/lib/env.js';
import { connectDB } from './src/lib/db.js';

import authRoutes from './src/routes/auth.route.js';
import messageRoutes from './src/routes/message.route.js'

const PORT = ENV.PORT || 3000

const app = express();
const __dirname = path.resolve();

app.use(express.json({ limit: '5mb' })); // req.body
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes)
app.use('/api/messages', messageRoutes)

// one of many ways for deployment, easy way because we deploy only backend and it serves both api and client side
if (ENV.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")))

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client', 'dist', 'index.html'))
    })
}

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
    connectDB()
})