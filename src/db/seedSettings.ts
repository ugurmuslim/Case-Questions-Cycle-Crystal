// seedQuestions.ts
import {Sequelize} from "sequelize-typescript";
import {config} from "../config/db.config";
import Question from "../models/question.model";
import {faker} from '@faker-js/faker';
import Setting from "../models/setting.model"; // Updated import statement

const sequelize = new Sequelize({
    database: config.DB,
    username: config.USER,
    password: config.PASSWORD,
    host: config.HOST,
    dialect: "postgres",
    models: [Setting]
});

const seedSettings = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");

        // Sync the model with the database
        await sequelize.sync({force: true}); // Use with caution: drops the table if it exists

        await Setting.bulkCreate([
            {
                country: 'US',
                setting_type: 'cycle_period',
                value: '7'
            },
            {
                country: 'UK',
                setting_type: 'cycle_period',
                value: '7'
            },
            {
                country: 'Australia',
                setting_type: 'cycle_period',
                value: '7'
            },
            {
                country: 'Canada',
                setting_type: 'cycle_period',
                value: '7'
            },
            {
                country: 'US',
                setting_type: 'last_publish_date',
                value: '2021-11-10'
            },
            {
                country: 'UK',
                setting_type: 'last_publish_date',
                value: '2021-11-10'
            },
            {
                country: 'Australia',
                setting_type: 'last_publish_date',
                value: '2021-11-10'
            },
            {
                country: 'Canada',
                setting_type: 'last_publish_date',
                value: '2021-11-10'
            },
            {
                country: 'US',
                setting_type: 'last_cycle_number',
                value: '1'
            },
            {
                country: 'UK',
                setting_type: 'last_cycle_number',
                value: '10'
            },
            {
                country: 'Australia',
                setting_type: 'last_cycle_number',
                value: '20'
            },
            {
                country: 'Canada',
                setting_type: 'last_cycle_number',
                value: '24'
            },
            {
                country: 'Singapore',
                setting_type: 'cycle_period',
                value: '7'
            },
            {
                country: 'Singapore',
                setting_type: 'last_cycle_number',
                value: '24'
            },
            {
                country: 'Singapore',
                setting_type: 'last_publish_date',
                value: '2021-11-10'
            }]);
        console.log(`Settings seeding completed.`);
    } catch (error) {
        console.error("Error seeding questions:", error);
    } finally {
        await sequelize.close();
    }
};

seedSettings(); // Seed 100 questions for the specified countries
