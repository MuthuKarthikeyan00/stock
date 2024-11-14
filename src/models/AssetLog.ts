import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Asset } from "./Asset";
import { Employee } from './Employee';
import { AssetTransactionType } from './AssetTransactionType';
import { AssetType } from './AssetType';
import { AssetStatus } from './AssetStatus';


interface AssetLogAttributes {
  id?: number; 
  reason: string | null;
  transactionType: number;
  employeeId: number; 
  assetId: number; 
  createdAt?: string;
}

@Table({
  tableName: 'asset_logs',
  timestamps: true
})
export class AssetLog extends Model<AssetLog , AssetLogAttributes> {
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

  @ForeignKey(() => AssetStatus) 
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  AssetStatusId!: number;

  @ForeignKey(() => AssetTransactionType) 
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  assetTransactionTypeId!: number;

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