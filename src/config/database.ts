import { Sequelize } from 'sequelize-typescript';
import { Employee } from '../models/Employee'; // Correct import path to your model
import { EmployeeRole } from '@src/models/EmployeeRole';
import { AssetType } from '@src/models/AssetType';
import { Asset } from '@src/models/Asset';
import { AssetCategory } from '@src/models/AssetCategory';
import { AssetLog } from '@src/models/AssetLog';
import { EmployeeBranch } from '@src/models/EmployeeBranch';
import { AssetStatus } from '@src/models/AssetStatus';
import { AssetTransactionType } from '@src/models/AssetTransactionType';
import { AssetTransaction } from '@src/models/AssetTransaction';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',  
  username: 'admin',
  password: 'admin',
  database: 'stock',
  models: [Asset, AssetType, AssetCategory,AssetStatus,AssetTransactionType,AssetTransaction, AssetLog,Employee,EmployeeRole,EmployeeBranch],  // Add your models here
});

export default sequelize;
