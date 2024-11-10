import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { EmployeeRole } from "./EmployeeRole";

@Table({
  tableName: 'employees',
  timestamps: true
})
export class Employee extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  firstName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  lastName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  phone!: number;

  @ForeignKey(() => EmployeeRole)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  roleId!: number;

  @BelongsTo(() => EmployeeRole)
  EmployeeRole!: EmployeeRole;
}
