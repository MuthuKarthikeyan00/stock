import { Sequelize } from 'sequelize-typescript';
import { Employee } from '../models/Employee'; // Correct import path to your model

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',  // adjust to your db configuration
  username: 'admin',
  password: 'admin',
  database: 'stock',
  models: [Employee],  // Add your models here
});

export default sequelize;
