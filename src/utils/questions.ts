import Question from "../models/question.model";

let questions: { [key: string]: any } = {};

// Function to set questions
export const setQuestions = (country: string, data: Question | null) => {
    questions[country] = data;
};

// Function to get questions
export const getQuestions = (country: string) => {
    return questions[country];
};