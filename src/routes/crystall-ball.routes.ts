import { Router } from "express";
import CrystalBallController from "../controllers/crystall-ball.controller";

class CrystalBallRoutes {
  router = Router();
  controller = new CrystalBallController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.get("/questions", this.controller.getQuestions);
    this.router.post("/questions/:questionId", this.controller.answerQuestions);
    this.router.get("/daily-match/:questionId?", this.controller.matchingCounterGenders);
    this.router.get("/matches", this.controller.getMatchingPeople);
    this.router.post("/matches", this.controller.decide);
  }
}

export default new CrystalBallRoutes().router;
