import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Asset } from "./Asset";
import { Employee } from './Employee';


interface AssetTransactionAttributes {
  id?: number; 
  reason: number;
  transactionType: number;
  employeeId: number; // New field
  assetId: number; // New field
  createdAt?: string;
}

@Table({
  tableName: 'assets_transactions',
  timestamps: true
})
export class AssetTransaction extends Model<AssetTransaction , AssetTransactionAttributes> {
  @ForeignKey(() => Asset) 
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  assetId!: number;

  @ForeignKey(() => Employee) 
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  employeeId!: number;

  @Column({
    type: DataType.SMALLINT,
    allowNull: false,
  })
  transactionType!: number;

  @Column({
    type: DataType.SMALLINT,
    allowNull: false,
  })
  reason!: number;

  @BelongsTo(() => Asset) 
  asset!: Asset;

  @BelongsTo(() => Employee) 
  employee!: Employee;
}