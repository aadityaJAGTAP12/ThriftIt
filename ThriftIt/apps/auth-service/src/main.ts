import express from 'express';
import cors from 'cors';
import {errorMiddleware} from '../../../packages/error-handler/error-middleware.js';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cors({
  origin: ["http://localhost:3000"],
  allowedHeaders: ['Authorization', 'content-type'],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.get('/', (req, res) => {
    res.send({ message: 'Hello API'});
});

app.use(errorMiddleware);
const port = process.env.PORT || 6001;
const server = app.listen(port,()=>{
    console.log(`Auth service running at http://localhost:${port}/api`);
});



server.on("error",(err)=>{
    console.log("Server Error:",err);
});
