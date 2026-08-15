import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './db.js';
import authRouter from './routes/authRouter.js';
import postRouter from "./routes/postRouter.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/authRouter", authRouter);
app.use("/postRouter", postRouter)

app.get('/', (req, res) => {
    res.json({ status: 'ok', db: 'connected' });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server started on  http://localhost:${PORT}`));
});
