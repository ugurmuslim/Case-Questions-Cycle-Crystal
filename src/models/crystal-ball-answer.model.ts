import {Model, Table, Column, DataType, BelongsTo, HasMany} from "sequelize-typescript";
import User from "./users.model";
import Match from "./match.model";

@Table({
  tableName: "crystal_ball_answer",
})
export default class CrystalBallAnswer extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: "id"
  })
  id?: number;

  @Column({
    type: DataType.INTEGER,
    field: "user_id",
    allowNull: false
  })
  user_id!: number;

  @Column({
    type: DataType.INTEGER,
    field: "question_id",
    allowNull: false
  })
  question_id!: number;

  @Column({
    type: DataType.INTEGER,
    field: "answer_id",
    allowNull: false
  })
  answer_id!: number;

  @BelongsTo(() => User, {
    foreignKey: 'user_id',  // Set the foreign key in CrystalBallAnswer
  })
  user!: User;  // Answer belongs to a User

}

