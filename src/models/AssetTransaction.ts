// models/AssetTransaction.ts
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Asset } from './Asset';
import { Employee } from './Employee';
import { AssetTransactionType } from './AssetTransactionType';
import { AssetStatus } from './AssetStatus';

interface AssetTransactionAttributes {
  id?: number;
  assetTransactionTypeId?: number;
  assetStatusId: number;
  employeeId?: number;
  assetId: number;
  amount?: number;
  createdAt?: string;
}

@Table({
  tableName: 'asset_transactions',
  timestamps: false
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
    allowNull: false,
  })
  assetStatusId!: number;

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
