import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { AssetTransaction } from './AssetTransaction';
import { Asset } from './Asset';


// The interface for the model attributes
interface AssetTransactionTypeAttributes {
  id?: number;  // Optional id because it's auto-incremented
  name: string;
  isDeleted?: number | null;
  createdAt?: string;
  updatedAt?: string;
}@Table({
  tableName: 'asset_transaction_types',  // Ensure this matches the table name in migration
  timestamps: false,
})
export class AssetTransactionType extends Model<AssetTransactionType,AssetTransactionTypeAttributes> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.SMALLINT,
    allowNull: true,
  })
  isDeleted!: number | null;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  createdAt!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  updatedAt!: Date;

  @HasMany(() => Asset)
  assets!: Asset[];

  @HasMany(() => AssetTransaction)
  assetTransactions!: AssetTransaction[];
}