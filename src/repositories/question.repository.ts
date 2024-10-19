import { Op } from "sequelize";
import Question from "../models/question.model";

export interface IQuestionRepository {
  retrieveAll(searchParams: {title: string, published: boolean}): Promise<Question[]>;
  retrieveById(questionId: number): Promise<Question | null>;
  retrieveByCycleNumber(cycleNumber: number): Promise<Question | null>;
  updateByCycleNumber(cycleNumber: number, updateData: Partial<Question>): Promise<Question | null>;
}

interface SearchCondition {
  [key: string]: any;
}

class QuestionRepository implements IQuestionRepository {
  async retrieveAll(searchParams: {title?: string, published?: boolean}): Promise<Question[]> {
    try {
      let condition: SearchCondition = {};

      if (searchParams?.published) condition.published = true;

      if (searchParams?.title)
        condition.title = { [Op.iLike]: `%${searchParams.title}%` };

      return await Question.findAll({ where: condition });
    } catch (error) {
      throw new Error("Failed to retrieve Questions!");
    }
  }
  async retrieveById(questionId: number): Promise<Question | null> {
    try {
      return await Question.findByPk(questionId);
    } catch (error) {
      throw new Error("Failed to retrieve Questions!");
    }
  }

  async retrieveByCycleNumber(cycleNumber: number): Promise<Question | null> {
    try {
      // Find a question with the specified cycle_number
      return await Question.findOne({
        where: {
          cycle_number: cycleNumber, // Filter by cycle_number
        },
      });
    } catch (error) {
      throw new Error("Failed to retrieve Questions!");
    }
  }

  async updateByCycleNumber(cycleNumber: number, updateData: Partial<Question>): Promise<Question | null> {
    try {
      // Find the question with the specified cycle_number
      const question = await Question.findOne({
        where: {
          cycle_number: cycleNumber,
        },
      });

      if (!question) {
        throw new Error("Question not found!");
      }

      // Update the question with the provided data
      await question.update(updateData);

      return question; // Return the updated question
    } catch (error) {
      throw new Error(`Failed to update question: ${error}`);
    }
  }
}

export default new QuestionRepository();
