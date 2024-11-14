import { Table, Column, Model, DataType, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { AssetLog } from './AssetLog';
import { Employee } from './Employee';
import { AssetStatus } from './AssetStatus';
import { AssetTransactionType } from './AssetTransactionType';
import { Asset } from './Asset';


// The interface for the model attributes
interface AssetTransactionAttributes {
  id?: number;  // Optional id because it's auto-incremented
  name: string;
  isDeleted?: number | null;
  createdAt?: string;
  updatedAt?: string;
}@Table({
  tableName: 'asset_transactions',  // Ensure this matches the table name in migration
  timestamps: false,
})
export class AssetTransaction extends Model<AssetTransaction,AssetTransactionAttributes> {
  @ForeignKey(() => AssetTransaction) 
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
  AssetTransactionType!: AssetTransactionType;
}