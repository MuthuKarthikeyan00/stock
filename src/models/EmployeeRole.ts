
import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Employee } from './Employee';

@Table({
  tableName: 'employee_roles',
  timestamps: false,
})
export class EmployeeRole extends Model<EmployeeRole> {
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

  @HasMany(() => Employee)
  employees!: Employee[];
}
