import { Model, Table, Column, DataType } from "sequelize-typescript";

@Table({
  tableName: "crystal_ball_question",
})
export default class CrystalBallQuestion extends Model {
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
    field: "counter_question",
    allowNull: false
  })
  counter_question?: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    field: "answers",
    allowNull: false
  })
  answers!: Array<string>;

  @Column({
    type: DataType.STRING(255),
    field: "country",
    allowNull: false
  })
  country!: string;

  @Column({
    type: DataType.DATE,
    field: "question_date",
    allowNull: true
  })
  question_date?: Date;

  @Column({
    type: DataType.STRING(255),
    field: "video_link",
    allowNull: false
  })
  video_link!: string;
}
