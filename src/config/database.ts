import { Sequelize } from 'sequelize-typescript';
import { Employee } from '../models/Employee'; // Correct import path to your model
import { EmployeeRole } from '@src/models/EmployeeRole';
import { AssetType } from '@src/models/AssetType';
import { Asset } from '@src/models/Asset';
import { AssetCategory } from '@src/models/AssetCategory';
import { AssetTransaction } from '@src/models/AssetTransaction';
import { EmployeeBranch } from '@src/models/EmployeeBranch';
import { AssetStatus } from '@src/models/AssetStatus';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',  // adjust to your db configuration
  username: 'admin',
  password: 'admin',
  database: 'stock',
  models: [Asset, AssetType, AssetCategory,AssetStatus,AssetTransaction,Employee,EmployeeRole,EmployeeBranch],  // Add your models here
});

export default sequelize;
