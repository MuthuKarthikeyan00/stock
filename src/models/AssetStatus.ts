import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Asset } from './Asset';


interface AssetStatusAttributes {
  id?: number;  
  name: string;
  isDeleted?: number | null;
  createdAt?: string;
  updatedAt?: string;
}@Table({
  tableName: 'asset_statuses', 
  timestamps: false,
})
export class AssetStatus extends Model<AssetStatus,AssetStatusAttributes> {
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
}