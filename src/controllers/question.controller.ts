import {Request, Response} from "express";
import {QuestionService} from "../services/question-service";
import QuestionRepository from "../repositories/question.repository";
import SettingRepository from "../repositories/setting.repository";

export default class QuestionController {
    private questionService: QuestionService;
    constructor() {
        this.questionService = new QuestionService(QuestionRepository, SettingRepository);
    }
    // Arrow function to keep the `this` context
    getQuestion = async (req: Request, res: Response) => {
        const country: string = req.params.country;
        try {
            const assignedQuestion = await this.questionService.getAssignedQuestion(country);
            res.json({ question: assignedQuestion });
        } catch (err) {
            console.log(err);
            res.status(500).send({
                message: `Error retrieving Country question for name=${country}.`
            });
        }
    }
}
