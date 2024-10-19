import { Model, Table, Column, DataType } from "sequelize-typescript";

@Table({
  tableName: "settings",
})
export default class Setting extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: "id"
  })
  id!: number;

  @Column({
    type: DataType.STRING(255),
    field: "country",
    allowNull: false
  })
  country!: string;

  @Column({
    type: DataType.STRING(100),
    field: "setting_type",
    allowNull: false
  })
  setting_type!: string;

  @Column({
    type: DataType.STRING(100),
    field: "value",
    allowNull: true
  })
  value?: string;


}
