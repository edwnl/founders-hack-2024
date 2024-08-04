// app/matchmaker/profile/profileHelpers.js
import moment from "moment";

export const initialProfile = {
  name: "John Doe",
  dateOfBirth: "1990-01-01",
  location: "Sydney",
  preference: "FRIENDS",
  bio: "I love meeting new people and exploring new places!",
  pictures: [null, null, null, null, null, null],
  prompts: {
    "Prompt 1": {
      question: "What's your favorite way to spend a weekend?",
      answer: "Hiking in the mountains and having a picnic with friends.",
    },
    "Prompt 2": {
      question:
        "If you could only eat one cuisine for the rest of your life, what would it be?",
      answer: "Italian cuisine, because of its variety and deliciousness!",
    },
    "Prompt 3": {
      question: "What's a popular opinion you disagree with?",
      answer: "That pineapple doesn't belong on pizza. It's delicious!",
    },
  },
  eventsAttended: 5,
  matchingEvents: 3,
};

export const promptQuestions = {
  "Prompt 1": [
    "What's your favorite way to spend a weekend?",
    "What's the most adventurous thing you've ever done?",
    "If you could have dinner with any historical figure, who would it be and why?",
    "What's your favorite book and why?",
    "If you could instantly become an expert in one subject, what would it be?",
  ],
  "Prompt 2": [
    "If you could only eat one cuisine for the rest of your life, what would it be?",
    "What's your favorite travel destination and why?",
    "If you could have any superpower, what would it be and how would you use it?",
    "What's the best piece of advice you've ever received?",
    "If you could switch lives with anyone for a day, who would it be?",
  ],
  "Prompt 3": [
    "What's a popular opinion you disagree with?",
    "What's your most controversial food opinion?",
    "If you could change one thing about society, what would it be?",
    "What's a skill you think everyone should learn?",
    "What's your unpopular opinion about technology?",
  ],
};

export const getAge = (dateOfBirth) => {
  return moment().diff(moment(dateOfBirth.toDate()), "years");
};
