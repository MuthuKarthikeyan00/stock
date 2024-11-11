import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { EmployeeRole } from "./EmployeeRole";
interface EmployeeAttributes {
  id?: number; 
  name: string;
  email: string;
  phone: number;
  roleId: number;
  status:string;
  createdAt?: string;
  updatedAt?: string;
}
@Table({
  tableName: 'employees',
  timestamps: true
})
export class Employee extends Model<Employee,EmployeeAttributes> {
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
  email!: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false
  })
  phone!: number;

  @ForeignKey(() => EmployeeRole)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  roleId!: number;

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

  @BelongsTo(() => EmployeeRole)
  EmployeeRole!: EmployeeRole;
}
