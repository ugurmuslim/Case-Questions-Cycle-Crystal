import { Model, Table, Column, DataType } from "sequelize-typescript";

@Table({
  tableName: "questions",
})
export default class Question extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: "id"
  })
  id?: number;

  @Column({
    type: DataType.STRING(255),
    field: "question",
    allowNull: false
  })
  question!: string;

  @Column({
    type: DataType.STRING(255),
    field: "country",
    allowNull: false
  })
  country?: string;

  @Column({
    type: DataType.INTEGER,
    field: "cycle_number",
    allowNull: false
  })
  cycle_number?: number;
}
