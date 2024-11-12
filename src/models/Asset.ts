import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { AssetType } from "./AssetType";
import { AssetCategory } from "./AssetCategory";
import { AssetTransaction } from './AssetTransaction';


interface AssetAttributes {
  id?: number; 
  name: string;
  serialNumber: string;
  model: string;
  status: string;
  typeId: number; // New field
  categoryId: number; // New field
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
    unique: true,
    allowNull: false
  })
  model!: number;

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

  @Column({
    type: DataType.SMALLINT,
    allowNull: false,
  })
  status!: number;

  @Column({
    type: DataType.SMALLINT,
    allowNull: true,
  })
  isDeleted!: number;


  @BelongsTo(() => AssetType) 
  assetType!: AssetType;

  @BelongsTo(() => AssetCategory) 
  assetCategory!: AssetCategory;

  @HasMany(() => AssetTransaction)
  assetTransactions!: AssetTransaction[];
}
