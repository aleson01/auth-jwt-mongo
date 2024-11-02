import express from 'express';
import mongoose from 'mongoose';
require('dotenv').config()
import authRoutes from './auth';
import userRoutes from './user';
import cors from 'cors';
import { authMiddleware } from './middleware/authMiddleware';



const app = express();
app.use(cors());

app.use(express.json());

mongoose.connect(process.env.MONGO_URI as string).then(()=>{
    console.log("conectado ao mongoDB")
}).catch((error)=>console.error("Erro ao conectar ao MongoDb",error))

app.use('/auth', authRoutes);
app.use('/user',authMiddleware, userRoutes);

const PORT = process.env.PORT || 3000;



app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});