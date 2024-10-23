// seedQuestions.ts
import {Sequelize} from "sequelize-typescript";
import {config} from "../config/db.config";
import {faker} from '@faker-js/faker';
import {COUNTRIES} from "../utils/constants";
import User from "../models/users.model";
import CrystalBallAnswer from "../models/crystal-ball-answer.model";
import Match from "../models/match.model"; // Updated import statement

const sequelize = new Sequelize({
    database: config.DB,
    username: config.USER,
    password: config.PASSWORD,
    host: config.HOST,
    dialect: "postgres",
    models: [User, CrystalBallAnswer, Match]
});

const seedUsers = async (numQuestions: number) => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");

        // Sync the model with the database
        await sequelize.sync({force: true}); // Use with caution: drops the table if it exists

        const users = Array.from({length: numQuestions}, () => ({
            email: faker.internet.email(),
            photo_url: faker.image.avatar(),
            name: faker.person.firstName(),
            surname: faker.person.lastName(),
            token: faker.string.alphanumeric(32),
            gender: ['Female','Male'][Math.floor(Math.random() * 2)],
            country: COUNTRIES.LIST[Math.floor(Math.random() * 5)],
        }));

        await User.bulkCreate(users);

        console.log(`Users seeding completed.`);
    } catch (error) {
        console.error("Error seeding questions:", error);
    } finally {
        await sequelize.close();
    }
};

seedUsers(100); // Seed 100 users for the specified countries
