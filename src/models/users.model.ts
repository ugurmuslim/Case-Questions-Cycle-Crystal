import {Model, Table, Column, DataType, HasMany} from "sequelize-typescript";
import CrystalBallAnswer from "./crystal-ball-answer.model";

@Table({
  tableName: "users",
})

export default class User extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: "id"
  })
  id!: number;

  @Column({
    type: DataType.STRING(255),
    field: "name",
    allowNull: false
  })
  name!: string;

  @Column({
    type: DataType.STRING(255),
    field: "surname",
    allowNull: false
  })
  country!: string;

  @Column({
    type: DataType.STRING(100),
    field: "email",
    allowNull: false
  })
  email!: string;

  @Column({
    type: DataType.STRING(255),
    field: "token",
    allowNull: false
  })
  token!: string;

  @Column({
    type: DataType.STRING(30),
    field: "gender",
    allowNull: false
  })
  gender!: string;

  @Column({
    type: DataType.STRING(100),
    field: "photo_url",
    allowNull: true
  })
  photo_url?: string;

  @HasMany(() => CrystalBallAnswer, {
    foreignKey: 'user_id',  // Foreign key on CrystalBallAnswer
  })
  answers!: CrystalBallAnswer[];  // User can have many answers
}
