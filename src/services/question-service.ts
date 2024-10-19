import settingRepository, {ISettingRepository} from "../repositories/setting.repository";
import {IQuestionRepository} from "../repositories/question.repository";
import moment from 'moment'
import Setting from "../models/setting.model";
import Question from "../models/question.model";
import {getQuestions, setQuestions} from "../utils/questions";

export class QuestionService {
    private questionRepository: IQuestionRepository;
    private settingRepository: ISettingRepository;

    constructor(questionRepository: IQuestionRepository, settingRepository: ISettingRepository) {
        this.questionRepository = questionRepository;
        this.settingRepository = settingRepository;
    }

    async assigner(): Promise<void> {

        const settings = await this.settingRepository.getCycleSettings()

        if (!settings) {
            return
        }
        await this.processSettings(settings)
    }

    async processSettings(settings: Setting[]) {
        const currentDate = moment();
        const settingsMap = this.mapSettings(settings);

        for (const country in settingsMap) {
            if (settingsMap.hasOwnProperty(country)) {
                const {cycle_period, last_cycle_number, last_publish_date} = settingsMap[country];

                if (currentDate.isAfter(moment(last_publish_date).add(cycle_period, 'days'))) {
                    console.log('Assigning question for country:', country);
                    let nextCycleNumber = parseInt(last_cycle_number) + 1;
                    console.log('Next cycle number:', nextCycleNumber);

                    let question = await this.questionRepository.retrieveByCycleNumber(country, nextCycleNumber);

                    // Reset nextCycleNumber to 1 if no question is found
                    if (!question) {
                        nextCycleNumber = 1;
                    }

                    const updates = [
                        { country: country, setting_type: 'last_cycle_number', value: nextCycleNumber.toString() },
                        { country: country, setting_type: 'last_publish_date', value:  moment().format('YYYY-DD-MM') },
                    ];

                    await this.settingRepository.bulkUpdateSettings(updates);

                    setQuestions(country, await this.getAssignedQuestion(country))
                }
            }
        }
    }

    async getAssignedQuestion(country: string): Promise<Question | null> {

        if(getQuestions(country)) {
            console.log('Returning cached question for country:', country);
            return getQuestions(country)
        }

        const settings = await this.settingRepository.getCycleSettingsByCountry(country)

        if(!settings)    {
         return null
        }

       const settingsMap=  this.mapSettings(settings)

        const question = await this.questionRepository.retrieveByCycleNumber(country, settingsMap[country].last_cycle_number)

        if(!question) {
            return null
        }

        setQuestions(country, question)

        return question
    }

    mapSettings(settings: Setting[]) {
        const settingsMap: { [key: string]: any } = {};

        for (const setting of settings) {
            const {country, setting_type, value} = setting;

            if (!settingsMap[country]) {
                settingsMap[country] = {};
            }
            settingsMap[country][setting_type] = value;
        }

        return settingsMap
    }
}