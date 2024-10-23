import CrystalBallQuestion from "../models/crystal-ball-question.model";
import User from "../models/users.model";
import {ICrystalBallQuestionRepository} from "../repositories/crystall-ball-question.repository";
import CrystalBallAnswer from "../models/crystal-ball-answer.model";
import {ICrystalBallAnswerRepository} from "../repositories/crystal-ball-answer.repository";
import {IMatchRepository} from "../repositories/match.repository";
import {COUNTRIES, CRYSTAL_BALL_CONSTANTS, GENDERS} from "../utils/constants";

export class CrystalBallService {
    private crystalBallQuestionRepository: ICrystalBallQuestionRepository;
    private crystalBallAnswerRepository: ICrystalBallAnswerRepository;
    private matchRepository: IMatchRepository;

    constructor(
        crystalBallQuestionRepository: ICrystalBallQuestionRepository,
        crystalBallAnswerRepository: ICrystalBallAnswerRepository,
        matchRepository: IMatchRepository
    ) {
        this.crystalBallQuestionRepository = crystalBallQuestionRepository;
        this.crystalBallAnswerRepository = crystalBallAnswerRepository;
        this.matchRepository = matchRepository;
    }

    async getQuestions(user: User): Promise<CrystalBallQuestion | CrystalBallQuestion[]> {
        switch (user.gender) {
            case 'Female':
                return await this.getFemaleQuestions(user.country);
            default:
                return await this.getMaleQuestions(user.id, user.country);
        }
    }

    async getMaleQuestions(user_id: number, country: string): Promise<CrystalBallQuestion[]> {
        return await this.crystalBallQuestionRepository.getQuestionsNotAnswered(user_id, country)
    }

    async getFemaleQuestions(country: string): Promise<CrystalBallQuestion> {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const searchParams: { country: string, question_date: Date } = {country: country, question_date: today}

        const questions = await this.crystalBallQuestionRepository.retrieveOne(searchParams)
        if (questions === null) {
            throw new Error("No questions found!")
        }
        return questions
    }

    async answerQuestions(question_id: number, answer_id: number, user: User): Promise<CrystalBallAnswer> {
        const answer = await this.crystalBallAnswerRepository.saveAnswer(question_id, answer_id, user.id)

        if (answer) {
            this.matchWithPeople(user, question_id);
        }

        return answer
    }

    async matchWithPeople(user: User, questionId: number): Promise<any> {
        const matchingPeople = await this.matchingAnswersWithCounterGender(user, questionId);
        const users = matchingPeople.map(m => m.user.get({plain: true}));

        // Step 2: Prepare matches for saving
        const matchData = users.map(matchingUser => ({
            user_id: user.gender == GENDERS.MALE ? matchingUser.id : user.id,
            counter_user_id: user.gender == GENDERS.MALE ? user.id : matchingUser.id,
            possible_match: true,
            user_match: null,
            counter_user_match: null,
            match_date: new Date()
        }));

        try {
            await this.matchRepository.bulkMatchingCreation(matchData);
        } catch (error) {
            throw new Error("Failed to create matches: " + error);
        }

        return users; // Return the users as needed
    }

    async matchingAnswersWithCounterGender(user: User, question_id: number): Promise<CrystalBallAnswer[]> {
        const searchParams: { question_id: number, user_id: number } = {question_id, user_id: user.id}

        const answer = await this.crystalBallAnswerRepository.retrieveOne(searchParams)

        if (answer === null) {
            throw new Error("No answers found!")
        }
        switch (user.gender) {
            case GENDERS.FEMALE:
                return await this.getMatchingAnswersForFemale(answer.answer_id, question_id, user.id);
            default:
                return await this.getMatchingAnswersForMale(answer.answer_id, question_id, user.id);
        }
    }

    async getMatchingAnswersForFemale(answer_id: number, question_id: number, user_id: number): Promise<CrystalBallAnswer[]> {
        if (answer_id == CRYSTAL_BALL_CONSTANTS.ANSWERS.IDK) {
            const matchingAnswers1 = await this.crystalBallAnswerRepository.findMatchingAnswersForSpecificQuestion(question_id, CRYSTAL_BALL_CONSTANTS.ANSWERS.ANSWER1, user_id, GENDERS.MALE);
            const matchingAnswers2 = await this.crystalBallAnswerRepository.findMatchingAnswersForSpecificQuestion(question_id, CRYSTAL_BALL_CONSTANTS.ANSWERS.ANSWER2, user_id, GENDERS.MALE);
            return [...matchingAnswers1, ...matchingAnswers2];
        }
        return await this.crystalBallAnswerRepository.findMatchingAnswersForSpecificQuestion(question_id, answer_id, user_id, GENDERS.MALE, 14)
    }

    async getMatchingAnswersForMale(answer_id: number, question_id: number, user_id: number): Promise<CrystalBallAnswer[]> {
        return await this.crystalBallAnswerRepository.findMatchingAnswers(user_id, GENDERS.FEMALE)
    }

    async updateDailyQuestions(): Promise<void> {
        for (const country of COUNTRIES.LIST) {
            const questions = await this.crystalBallQuestionRepository.getQuestionsNotInitialized(country)
            if (questions.length > 0) {
                const randomIndex = Math.floor(Math.random() * questions.length);
                const question = questions[randomIndex]; // Select a random question
                question.question_date = new Date();
                await question.save();
            }
        }
    }

    async getMatchingPeople(user: User): Promise<User[]> {
        const matches = await this.matchRepository.getMatchingPeople(user.id, 14)

        if (user.gender == 'Female') {
            return matches.map(m => m.counter_user.get({plain: true}))
        }
        return matches.map(m => m.user.get({plain: true}))
    }

    async decide(user: User, matchingUserId: number, decision: boolean): Promise<void> {
        let searchParams: { user_id: number, counter_user_id: number } = {
            user_id: user.id,
            counter_user_id: matchingUserId
        };
        let body: { user_match?: boolean; counter_user_match?: boolean } = {
            user_match: decision
        };

        if (user.gender == GENDERS.MALE) {
            searchParams = {user_id: matchingUserId, counter_user_id: user.id};
            body = {
                counter_user_match: decision
            }
        }
        const matches = await this.matchRepository.updateMatching(searchParams, body)
    }
}