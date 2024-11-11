import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Employee } from './Employee';
import { TinyIntegerDataType } from 'sequelize';


// The interface for the model attributes
interface EmployeeRoleAttributes {
  id?: number;  // Optional id because it's auto-incremented
  name: string;
  isDeleted?: number;
  createdAt?: string;
  updatedAt?: string;
}@Table({
  tableName: 'employee_roles',  // Ensure this matches the table name in migration
  timestamps: false,
})
export class EmployeeRole extends Model<EmployeeRole,EmployeeRoleAttributes> {
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
  isDeleted!: number;

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

  @HasMany(() => Employee)
  employees!: Employee[];
}