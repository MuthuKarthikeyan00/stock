import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import Routers from './Routers';
import { removeNullPrototype } from './helpers/removeNullPrototype';
import sequelize from './config/database';

dotenv.config();
const app = express();
const upload = multer();

// Sync Sequelize models with the database
sequelize.sync()
  .then(() => {
    console.log('Database connected and models synced');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(express.static(path.join(__dirname,"..", 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(upload.none()); 

app.use(removeNullPrototype)

app.use(Routers.init());


const PORT = process.env.PORT || 7100;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});