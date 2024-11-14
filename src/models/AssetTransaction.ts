import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { AssetLog } from './AssetLog';
import { Employee } from './Employee';
import { AssetStatus } from './AssetStatus';
import { AssetTransactionType } from './AssetTransactionType';
import { Asset } from './Asset';

// The interface for the model attributes
interface AssetTransactionAttributes {
  id?: number; 
  assetTransactionTypeId: number;
  assetStatusId?: number;
  employeeId?: number; 
  assetId: number; 
  amount: number;
  createdAt?: string;
}

@Table({
  tableName: 'asset_transactions',  // Ensure this matches the table name in migration
  timestamps: false,
})
export class AssetTransaction extends Model<AssetTransaction, AssetTransactionAttributes> {
  @ForeignKey(() => Asset) 
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  assetId!: number;

  @ForeignKey(() => Employee) 
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  employeeId!: number;

  @ForeignKey(() => AssetStatus) 
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  assetStatusId!: number;

  @ForeignKey(() => AssetTransactionType) 
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  assetTransactionTypeId!: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: true,
  })
  amount!: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  createdAt!: Date;

  @BelongsTo(() => Asset) 
  asset!: Asset;

  @BelongsTo(() => AssetStatus) 
  assetStatus!: AssetStatus;

  @BelongsTo(() => Employee) 
  employee!: Employee;

  @BelongsTo(() => AssetTransactionType) 
  assetTransactionType!: AssetTransactionType;
}
