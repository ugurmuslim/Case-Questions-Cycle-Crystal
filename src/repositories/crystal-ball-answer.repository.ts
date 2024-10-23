import CrystalBallAnswer from "../models/crystal-ball-answer.model";
import {Sequelize} from "sequelize-typescript";
import User from "../models/users.model";
import {Op} from "sequelize";
import Match from "../models/match.model";

export interface ICrystalBallAnswerRepository {
    retrieveAll(searchParams: { country: string, question_date?: Date }): Promise<CrystalBallAnswer[]>;

    retrieveOne(searchParams: { question_id: number, user_id: number }): Promise<CrystalBallAnswer | null>;

    saveAnswer(question_id: number, answer_id: number, user_id: number): Promise<CrystalBallAnswer>;

    findMatchingAnswersForSpecificQuestion(question_id: number, answer_id: number, user_id: number, gender: string, limit?: number): Promise<CrystalBallAnswer[]>;

    findMatchingAnswers(user_id: number, gender: string): Promise<CrystalBallAnswer[]>;
}

interface SearchCondition {
    [key: string]: any;
}

class CrystalBallAnswerRepository implements ICrystalBallAnswerRepository {
    async retrieveAll(searchParams: { country?: string }): Promise<CrystalBallAnswer[]> {
        try {
            let condition: SearchCondition = {};

            if (searchParams?.country) condition.country = searchParams.country;

            return await CrystalBallAnswer.findAll({where: condition});
        } catch (error) {
            throw new Error("Failed to retrieve CrystalBallQuestions!");
        }
    }

    async retrieveOne(searchParams: { question_id: number, user_id: number }): Promise<CrystalBallAnswer | null> {
        try {
            let condition: SearchCondition = {};

            if (searchParams?.question_id) condition.question_id = searchParams.question_id;
            if (searchParams?.user_id) condition.user_id = searchParams.user_id;

            return await CrystalBallAnswer.findOne({where: condition});
        } catch (error) {
            throw new Error("Failed to retrieve CrystalBallQuestions!");
        }
    }

    async saveAnswer(question_id: number, answer_id: number, user_id: number): Promise<CrystalBallAnswer> {
        try {
            const newAnswer = await CrystalBallAnswer.create({
                question_id,
                answer_id,
                user_id,
            });
            return newAnswer;
        } catch (error) {
            throw new Error("Failed to save the answer!");
        }
    }

    async findMatchingAnswersForSpecificQuestion(question_id: number, answer_id: number, user_id: number, gender: string, limit?: number): Promise<CrystalBallAnswer[]> {
        try {
            const answers = await CrystalBallAnswer.findAll({
                include: [
                    {
                        model: User,
                        where: {
                            gender: gender,  // Look for Male users
                        },
                        attributes: ['id', 'name', 'gender', 'photo_url'] // Ensure this matches your User model
                    }
                ],
                where: {
                    user_id: {
                        [Op.ne]: user_id,  // Exclude current user's id
                    },
                    question_id: question_id, // Filter by question_id
                    answer_id: answer_id, // Filter by answer_id
                },
                limit: limit
            });
            return answers;  // Return the filtered answers
        } catch (error) {
            throw new Error("Failed to retrieve matching answers: " + error);
        }
    }

    async findMatchingAnswers(user_id: number, gender: string): Promise<CrystalBallAnswer[]> {
        try {
            const matchingUsers = await CrystalBallAnswer.findAll({
                attributes: [
                    'user_id',
                    [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.literal(`"question_id" || '-' || "answer_id"`))), 'match_count']
                ],
                include: [
                    {
                        model: User,
                        as: 'user',  // Set an alias here
                        where: {
                            gender: gender,
                        },
                        attributes: ['id', 'name', 'gender', 'photo_url'], // Ensure this matches your User model
                    }
                ],
                where: {
                    user_id: {
                        [Op.ne]: user_id,
                    },
                    [Op.and]: Sequelize.literal(`(question_id, answer_id) IN 
                    (SELECT question_id, answer_id FROM crystal_ball_answer WHERE user_id = ${user_id})`)
                },
                group: ['user_id', 'user.id', 'user.name', 'user.gender', 'user.photo_url'], // Use the alias in the GROUP BY clause
                having: Sequelize.literal(`COUNT(DISTINCT "question_id" || '-' || "answer_id") = 
                (SELECT COUNT(*) FROM crystal_ball_answer WHERE user_id = ${user_id})`)
            });
            return matchingUsers;
        } catch (error) {
            throw new Error("Failed to retrieve matching answers: " + error);
        }
    }
}

export default new CrystalBallAnswerRepository();
