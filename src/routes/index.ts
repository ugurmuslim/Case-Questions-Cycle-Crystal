import { Application } from "express";
import QuestionRoutes from "./question.routes";
import CrystallBallRoutes from "./crystall-ball.routes";

export default class Routes {
  constructor(app: Application) {
    app.use("/api/questions", QuestionRoutes);
    app.use("/api/crystal-ball", CrystallBallRoutes);
  }
}
