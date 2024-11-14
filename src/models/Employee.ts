import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { EmployeeRole } from "./EmployeeRole";
import { AssetLog } from './AssetLog';
import { EmployeeBranch } from './EmployeeBranch';
interface EmployeeAttributes {
  id?: number; 
  name: string;
  email: string;
  phone: number;
  roleId: number;
  branchId:number;
  isDeleted?: number | null;
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

  @ForeignKey(() => EmployeeBranch)
  @Column({
    type: DataType.SMALLINT,
    allowNull: false,
  })
  branchId!: number;

  @Column({
    type: DataType.SMALLINT,
    allowNull: true,
  })
  isDeleted!: number | null;

  @BelongsTo(() => EmployeeRole)
  employeeRole!: EmployeeRole;

  @BelongsTo(() => EmployeeBranch)
  employeeBranch!: EmployeeBranch;

  @HasMany(() => AssetLog)
  assetLogs!: AssetLog[];
}
