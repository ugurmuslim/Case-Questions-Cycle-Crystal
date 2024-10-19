import { Router } from "express";
import QuestionController from "../controllers/question.controller";

class QuestionRoutes {
  router = Router();
  controller = new QuestionController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.get("/:country", this.controller.getQuestion);
  }
}

export default new QuestionRoutes().router;
