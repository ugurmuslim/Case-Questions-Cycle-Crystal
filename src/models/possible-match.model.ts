import {Model, Table, Column, DataType, BelongsTo, ForeignKey, HasMany} from "sequelize-typescript";
import User from "./users.model";
import CrystalBallAnswer from "./crystal-ball-answer.model";

@Table({
    tableName: "possible_match",
    indexes: [
        {
            unique: true, // Ensure the combination is unique
            fields: ['user_id', 'counter_user_id']
        }]
})

export default class PossibleMatch extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "id"
    })
    id?: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        field: "user_id",
        allowNull: false
    })
    user_id!: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        field: "counter_user_id",
        allowNull: false
    })
    counter_user_id!: number;

    @Column({
        type: DataType.STRING(100),
        field: "match_date",
        allowNull: true
    })
    match_date?: Date;

    @Column({
        type: DataType.STRING(100),
        field: "match_initiator_gender",
        allowNull: false
    })
    match_initiator_gender?: Date;

    @Column({
        type: DataType.INTEGER,
        field: "question_id",
        allowNull: false
    })
    question_id?: number;

    @BelongsTo(() => User, 'user_id')
    user!: User;

    @BelongsTo(() => User, 'counter_user_id')
    counter_user!: User;
}
