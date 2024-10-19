import { Application } from "express";
import QuestionRoutes from "./question.routes";

export default class Routes {
  constructor(app: Application) {
    app.use("/api/questions", QuestionRoutes);
  }
}
