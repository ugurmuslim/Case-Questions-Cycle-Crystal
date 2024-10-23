import {Request, Response} from "express";
import {CrystalBallService} from "../services/crystal-ball-service";
import CrystalBallQuestionRepository from "../repositories/crystall-ball-question.repository";
import {UserService} from "../services/user-service";
import UserRepository from "../repositories/user.repository";
import CrystalBallAnswerRepository from "../repositories/crystal-ball-answer.repository";
import MatchRepository from "../repositories/match.repository";

export default class CrystalBallController {
    private crystalBallService: CrystalBallService;
    private userService: UserService;
    constructor() {
        this.crystalBallService = new CrystalBallService(CrystalBallQuestionRepository, CrystalBallAnswerRepository, MatchRepository);
        this.userService = new UserService(UserRepository);
    }
    // Arrow function to keep the `this` context
    getQuestions = async (req: Request, res: Response) => {
        try {
            if(req.headers.token === undefined && false) {
                return res.status(401).send({
                    message: "Unauthorized!"
                });

            }
            const token: string = req.headers.token?.toString() || "";
            const user = await this.userService.getUserByToken(token);
            const questions = await this.crystalBallService.getQuestions(user)
            res.json({ question: questions });
        } catch (err) {
            console.log(err);
            res.status(500).send({
                message: `Error retrieving questions.`
            });
        }
    }

    answerQuestions = async (req: Request, res: Response) => {
        try {
            const { answerId }: { answerId: number } = req.body;
            const questionId = req.params.questionId;

            if(req.headers.token === undefined && false) {
                return res.status(401).send({
                    message: "Unauthorized!"
                });
            }
            const token: string = req.headers.token?.toString() || "";
            const user = await this.userService.getUserByToken(token);
            const answer = await this.crystalBallService.answerQuestions(Number(questionId), answerId, user)
            res.json({ answer: answer });
        } catch (err) {
            console.log(err);
            res.status(500).send({
                message: `Error retrieving questions.`
            });
        }
    }

    matchingCounterGenders = async (req: Request, res: Response) => {
        try {
            if(req.headers.token === undefined && false) {
                return res.status(401).send({
                    message: "Unauthorized!"
                });
            }
            const token: string = req.headers.token?.toString() || "";
            const user = await this.userService.getUserByToken(token);
            const users = await this.crystalBallService.matchWithPeople(user, Number(req.params.questionId))
            res.json({ users: users });
        } catch (err) {
            console.log(err);
            res.status(500).send({
                message: `Error retrieving questions.`
            });
        }
    }

    getMatchingPeople = async (req: Request, res: Response) => {
        try {
            if(req.headers.token === undefined && false) {
                return res.status(401).send({
                    message: "Unauthorized!"
                });
            }
            const token: string = req.headers.token?.toString() || "";
            const user = await this.userService.getUserByToken(token);
            const users = await this.crystalBallService.getMatchingPeople(user)
            res.json({ users: users });
        } catch (err) {
            console.log(err);
            res.status(500).send({
                message: `Error retrieving questions.`
            });
        }
    }

    decide = async (req: Request, res: Response) => {
        try {
            if(req.headers.token === undefined && false) {
                return res.status(401).send({
                    message: "Unauthorized!"
                });
            }
            const token: string = req.headers.token?.toString() || "";
            const user = await this.userService.getUserByToken(token);
            const decision = req.body.decision;
            const matchingUserId = req.body.matchingUserId;
            console.log(matchingUserId)

            const users = await this.crystalBallService.decide(user, matchingUserId, !!decision)
            res.json({ users: users });
        } catch (err) {
            console.log(err);
            res.status(500).send({
                message: `Error retrieving questions.`
            });
        }
    }
}
