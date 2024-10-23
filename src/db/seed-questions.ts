// seedQuestions.ts
import { Sequelize } from "sequelize-typescript";
import { config } from "../config/db.config";
import Question from "../models/question.model";
import { faker } from '@faker-js/faker';
import {COUNTRIES} from "../utils/constants"; // Updated import statement

const sequelize = new Sequelize({
    database: config.DB,
    username: config.USER,
    password: config.PASSWORD,
    host: config.HOST,
    dialect: "postgres",
    models: [Question]
});

const seedQuestions = async (numQuestions: number, countries: Array<string>) => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");

        // Sync the model with the database
        await sequelize.sync({ force: true }); // Use with caution: drops the table if it exists

        for (const country of countries) {
            const questions = Array.from({length: numQuestions}, (_, index) => ({
                question: faker.lorem.sentence(),
                country: country,
                cycle_number: index + 1,
            }));

            await Question.bulkCreate(questions);
        }
        console.log(`${numQuestions} questions seeded successfully.`);
    } catch (error) {
        console.error("Error seeding questions:", error);
    } finally {
        await sequelize.close();
    }
};

seedQuestions(100, COUNTRIES.LIST); // Seed 100 questions for the specified countries
