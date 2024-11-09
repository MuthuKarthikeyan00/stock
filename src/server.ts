import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import multer from 'multer';


dotenv.config();
const app = express();
const upload = multer(); 

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 


const PORT = process.env.PORT ;


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
