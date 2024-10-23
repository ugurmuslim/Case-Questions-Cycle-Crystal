import CrystalBallQuestion from "../models/crystal-ball-question.model";
import CrystalBallAnswerRepository from "./crystal-ball-answer.repository";
import {Op} from "sequelize";
import {Sequelize} from "sequelize-typescript";

export interface ICrystalBallQuestionRepository {
  retrieveAll(searchParams: {country: string, question_date?: Date}): Promise<CrystalBallQuestion[]>;
  retrieveOne(searchParams: {country: string, question_date?: Date, question_id?: number}): Promise<CrystalBallQuestion | null>;
  getQuestionsNotInitialized(country: string): Promise<CrystalBallQuestion[]>;
  getQuestionsNotAnswered(user_id: number, country: string): Promise<CrystalBallQuestion[]>
}

interface SearchCondition {
  [key: string]: any;
}

class CrystalBallQuestionRepository implements ICrystalBallQuestionRepository {
  async retrieveAll(searchParams: {country?: string}): Promise<CrystalBallQuestion[]> {
    try {
      let condition: SearchCondition = {};

      if (searchParams?.country) condition.country = searchParams.country;

      return await CrystalBallQuestion.findAll({ where: condition });
    } catch (error) {
      throw new Error("Failed to retrieve CrystalBallQuestions!");
    }
  }

  async retrieveOne(searchParams: {question_date?: Date, country: string, question_id?: number}): Promise<CrystalBallQuestion | null> {
    try {
      let condition: SearchCondition = {};

      if (searchParams?.country) condition.country = searchParams.country;
      if (searchParams?.question_date) condition.question_date = searchParams.question_date;
      if (searchParams?.question_id) condition.id = searchParams.question_id;


      console.log("condition", condition);
      return await CrystalBallQuestion.findOne({ where: condition });
    } catch (error) {
      throw new Error("Failed to retrieve CrystalBallQuestions!");
    }
  }

  async getQuestionsNotInitialized(country: string): Promise<CrystalBallQuestion[]> {
    return await CrystalBallQuestion.findAll({where: {country: country, question_date: null}});
  }

  async getQuestionsNotAnswered(user_id: number, country: string): Promise<CrystalBallQuestion[]> {
    try {
      // Find questions where the combination of question_id and user_id does not exist in CrystalBallAnswer
      const questionsNotAnswered = await CrystalBallQuestion.findAll({
        where: {
          country: country,
          id: {
            [Op.notIn]: Sequelize.literal(`(
              SELECT question_id FROM crystal_ball_answer WHERE user_id = ${user_id}
            )`)
          }
        }
      });

      return questionsNotAnswered;
    } catch (error) {
      throw new Error("Failed to retrieve questions not answered by the user!");
    }
  }
}

export default new CrystalBallQuestionRepository();
