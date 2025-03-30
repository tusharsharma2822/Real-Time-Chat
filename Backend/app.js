import express from 'express';
import 'dotenv/config.js';
import morgan from 'morgan';
import cors from 'cors';
import connectToDB from './db/db.js';
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";

connectToDB();

const app = express();

app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRoutes);

app.get('/', (req, res) => {
    res.send("Hello, World!");
})

export default app;