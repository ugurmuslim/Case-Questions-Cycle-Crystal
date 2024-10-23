// seedQuestions.ts
import {Sequelize} from "sequelize-typescript";
import {config} from "../config/db.config";
import Question from "../models/question.model";
import {COUNTRIES, crystalBallQuestions} from "../utils/constants";
import CrystalBallQuestion from "../models/crystal-ball-question.model"; // Updated import statement

const sequelize = new Sequelize({
    database: config.DB,
    username: config.USER,
    password: config.PASSWORD,
    host: config.HOST,
    dialect: "postgres",
    models: [CrystalBallQuestion]
});

const seedQuestions = async (numQuestions: number, countries: Array<string>) => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");

        // Sync the model with the database
        await sequelize.sync({force: true}); // Use with caution: drops the table if it exists

        for (const country of countries) {
            for (const question of crystalBallQuestions) {
                const questions = Array.from({length: numQuestions}, () => ({
                    question: question.question_female,
                    counter_question: question.question_male,
                    country: country,
                    answers: question.answers,
                }));

                await CrystalBallQuestion.bulkCreate(questions);
            }
        }
        console.log(`${numQuestions} questions seeded successfully.`);
    } catch (error) {
        console.error("Error seeding questions:", error);
    } finally {
        await sequelize.close();
    }
};

seedQuestions(1, COUNTRIES.LIST); // Seed 100 questions for the specified countries
