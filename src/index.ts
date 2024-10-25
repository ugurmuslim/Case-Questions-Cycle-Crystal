import express, { Application } from "express";
import cors, { CorsOptions } from "cors";
import Routes from "./routes";
import Database from "./db";
import cron from 'node-cron';
import {QuestionService} from "./services/question-service";
import QuestionRepository from "./repositories/question.repository";
import SettingRepository from "./repositories/setting.repository";
import {CrystalBallService} from "./services/crystal-ball-service";
import CrystallBallQuestionRepository from "./repositories/crystall-ball-question.repository";
import CrystalBallAnswerRepository from "./repositories/crystal-ball-answer.repository";
import MatchRepository from "./repositories/match.repository";
import PossibleMatchRepository from "./repositories/possible-match.repository";

export default class Server {
  private questionService: QuestionService;
  private crystalBallService: CrystalBallService;
  constructor(app: Application) {
    this.config(app);
    this.syncDatabase();
    this.questionService = new QuestionService(QuestionRepository, SettingRepository);
    this.crystalBallService = new CrystalBallService(CrystallBallQuestionRepository, CrystalBallAnswerRepository, MatchRepository, PossibleMatchRepository);
    new Routes(app);
  }

  private config(app: Application): void {
    const corsOptions: CorsOptions = {
      origin: "http://localhost:3001"
    };


    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    cron.schedule('0 19 * * *', async () => {
      console.log('Running cron job every day at 7 PM');
      await this.questionService.assigner();
    });

      cron.schedule('0 0 * * *', async () => {
        console.log('Running cron job every day at 12 PM');
        await this.crystalBallService.updateDailyQuestions();
      });
  }

  private syncDatabase(): void {
    const db = new Database();
    db.sequelize?.sync();
  }
}

