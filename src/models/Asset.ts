import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { AssetType } from "./AssetType";
import { AssetCategory } from "./AssetCategory";
import { AssetLog } from './AssetLog';
import { AssetStatus } from './AssetStatus';
import { Employee } from './Employee';
import { AssetTransactionType } from './AssetTransactionType';


interface AssetAttributes {
  id?: number; 
  name: string;
  serialNumber: string;
  model: string;
  statusId: number;
  typeId: number;
  categoryId: number; 
  employeeId?: number;
  createdAt?: string;
  updatedAt?: string;
}

@Table({
  tableName: 'assets',
  timestamps: true
})
export class Asset extends Model<Asset, AssetAttributes> {
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false
  })
  serialNumber!: string;

  @Column({
    type: DataType.STRING, 
    allowNull: false
  })
  model!: string; 

  @ForeignKey(() => AssetType) 
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  typeId!: number;

  @ForeignKey(() => AssetCategory) 
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  categoryId!: number;

  @ForeignKey(() => AssetStatus) 
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  AssetStatusId!: number;

  @ForeignKey(() => Employee) 
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  employeeId!: number;

  @Column({
    type: DataType.SMALLINT,
    allowNull: true,
  })
  isDeleted!: number | null;

  @ForeignKey(() => AssetTransactionType) 
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  assetTransactionTypeId!: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: true,
  })
  amount!: number;


  @BelongsTo(() => AssetStatus) 
  assetStatus!: AssetStatus;

  @BelongsTo(() => AssetType) 
  assetType!: AssetType;

  @BelongsTo(() => AssetCategory) 
  assetCategory!: AssetCategory;

  @BelongsTo(() => AssetTransactionType) 
  assetTransactionType!: AssetTransactionType;


  @BelongsTo(() => Employee) 
  employee!: Employee;

  @HasMany(() => AssetLog)
  assetLogs!: AssetLog[];
}
