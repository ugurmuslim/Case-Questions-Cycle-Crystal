import { Sequelize } from "sequelize-typescript";
import { config, dialect } from "../config/db.config";
import Question from "../models/question.model";
import Setting from "../models/setting.model";
import CrystalBallQuestion from "../models/crystal-ball-question.model";
import User from "../models/users.model";
import Match from "../models/match.model";
import CrystalBallAnswer from "../models/crystal-ball-answer.model";

class Database {
  public sequelize: Sequelize | undefined;

  constructor() {
    this.connectToDatabase();
  }

  private async connectToDatabase() {
    this.sequelize = new Sequelize({
      database: config.DB,
      username: config.USER,
      password: config.PASSWORD,
      host: config.HOST,
      dialect: dialect,
      pool: {
        max: config.pool.max,
        min: config.pool.min,
        acquire: config.pool.acquire,
        idle: config.pool.idle
      },
      models: [Question, Setting, CrystalBallQuestion, User, CrystalBallAnswer, Match]
    });

    await this.sequelize
      .authenticate()
      .then(() => {
        console.log("Connection has been established successfully.");
      })
      .catch((err) => {
        console.error("Unable to connect to the Database:", err);
      });
  }
}

export default Database;
