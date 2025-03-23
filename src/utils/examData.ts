
export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  passScore: number; // percentage needed to pass
  price: number; // in USD
  questions: Question[];
}

export const exams: Exam[] = [
  {
    id: "web-dev-fundamentals",
    title: "Web Development Fundamentals",
    description: "Test your knowledge of HTML, CSS, and JavaScript fundamentals.",
    duration: 60,
    passScore: 70,
    price: 99,
    questions: [
      {
        id: "q1",
        text: "Which HTML element is used to define the title of a document?",
        options: ["<header>", "<title>", "<h1>", "<head>"],
        correctAnswer: 1
      },
      {
        id: "q2",
        text: "Which CSS property is used to change the text color of an element?",
        options: ["color", "text-color", "font-color", "text-style"],
        correctAnswer: 0
      },
      {
        id: "q3",
        text: "Which of the following is NOT a JavaScript data type?",
        options: ["Boolean", "Undefined", "Integer", "Symbol"],
        correctAnswer: 2
      },
      {
        id: "q4",
        text: "Which CSS property is used to create space between elements?",
        options: ["spacing", "gap", "margin", "padding"],
        correctAnswer: 2
      },
      {
        id: "q5",
        text: "What does the 'let' keyword do in JavaScript?",
        options: [
          "Declares a global variable",
          "Declares a constant variable",
          "Declares a block-scoped variable",
          "Declares a function"
        ],
        correctAnswer: 2
      },
      {
        id: "q6",
        text: "Which HTML tag is used to create a hyperlink?",
        options: ["<link>", "<a>", "<href>", "<url>"],
        correctAnswer: 1
      },
      {
        id: "q7",
        text: "What is the correct way to include an external JavaScript file?",
        options: [
          "<script href='script.js'>",
          "<script link='script.js'>",
          "<script src='script.js'>",
          "<javascript src='script.js'>"
        ],
        correctAnswer: 2
      },
      {
        id: "q8",
        text: "Which CSS property is used to make text bold?",
        options: ["font-style", "text-weight", "font-weight", "text-style"],
        correctAnswer: 2
      },
      {
        id: "q9",
        text: "What does API stand for?",
        options: [
          "Application Programming Interface",
          "Application Process Integration",
          "Automated Programming Interface",
          "Application Protocol Interface"
        ],
        correctAnswer: 0
      },
      {
        id: "q10",
        text: "Which HTML element is used to create a dropdown list?",
        options: ["<dropdown>", "<list>", "<select>", "<option>"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: "react-fundamentals",
    title: "React Fundamentals",
    description: "Test your knowledge of React.js fundamentals and best practices.",
    duration: 45,
    passScore: 75,
    price: 129,
    questions: [
      {
        id: "q1",
        text: "What is React?",
        options: [
          "A JavaScript framework",
          "A JavaScript library for building user interfaces",
          "A programming language",
          "A database management system"
        ],
        correctAnswer: 1
      },
      {
        id: "q2",
        text: "Which of the following is used to pass data from parent to child component?",
        options: ["State", "Props", "Context", "Refs"],
        correctAnswer: 1
      },
      {
        id: "q3",
        text: "What is JSX in React?",
        options: [
          "A JavaScript extension that allows writing HTML in JavaScript",
          "A new programming language",
          "JavaScript XML library",
          "JavaScript execution engine"
        ],
        correctAnswer: 0
      },
      {
        id: "q4",
        text: "Which hook is used to add state to a functional component?",
        options: ["useEffect", "useState", "useContext", "useReducer"],
        correctAnswer: 1
      },
      {
        id: "q5",
        text: "What is the virtual DOM in React?",
        options: [
          "A physical duplicate of the actual DOM",
          "A lightweight copy of the actual DOM in memory",
          "A programming concept unrelated to React",
          "The visible part of the React application"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "cloud-computing",
    title: "Cloud Computing Essentials",
    description: "Test your knowledge of cloud computing concepts and services.",
    duration: 90,
    passScore: 80,
    price: 149,
    questions: [
      {
        id: "q1",
        text: "What is the primary advantage of using cloud computing?",
        options: [
          "Lower security risks",
          "Reduced need for internet connectivity",
          "Scalability and flexibility",
          "Simplified programming requirements"
        ],
        correctAnswer: 2
      },
      {
        id: "q2",
        text: "Which cloud service model provides virtual machines and other infrastructure?",
        options: ["SaaS", "PaaS", "IaaS", "XaaS"],
        correctAnswer: 2
      },
      {
        id: "q3",
        text: "What does AWS stand for?",
        options: [
          "Advanced Web Services",
          "Amazon Web Services",
          "Automated Web System",
          "Application Web Service"
        ],
        correctAnswer: 1
      },
      {
        id: "q4",
        text: "Which of the following is NOT a major cloud service provider?",
        options: ["Microsoft Azure", "Google Cloud Platform", "Oracle Cloud", "IBM Server"],
        correctAnswer: 3
      },
      {
        id: "q5",
        text: "What is the key characteristic of a private cloud?",
        options: [
          "It's owned and operated by a third-party provider",
          "It's accessible to anyone with internet access",
          "It's dedicated to a single organization",
          "It's always less expensive than public clouds"
        ],
        correctAnswer: 2
      }
    ]
  }
];

export const getExam = (examId: string): Exam | undefined => {
  return exams.find(exam => exam.id === examId);
};

export interface ExamResult {
  examId: string;
  userId: string;
  score: number;
  passed: boolean;
  date: string;
  answers: { [questionId: string]: number };
}

// Mock storage key
const EXAM_RESULTS_STORAGE_KEY = 'certifypro-exam-results';

export const saveExamResult = (result: ExamResult): void => {
  const resultsJson = localStorage.getItem(EXAM_RESULTS_STORAGE_KEY);
  const results = resultsJson ? JSON.parse(resultsJson) : [];
  results.push(result);
  localStorage.setItem(EXAM_RESULTS_STORAGE_KEY, JSON.stringify(results));
  
  // Update user completed exams if passed
  if (result.passed) {
    const userJson = localStorage.getItem('certifypro-user');
    if (userJson) {
      const user = JSON.parse(userJson);
      if (!user.completedExams.includes(result.examId)) {
        user.completedExams.push(result.examId);
        localStorage.setItem('certifypro-user', JSON.stringify(user));
      }
    }
  }
};

export const getUserExamResults = (userId: string): ExamResult[] => {
  const resultsJson = localStorage.getItem(EXAM_RESULTS_STORAGE_KEY);
  const results = resultsJson ? JSON.parse(resultsJson) : [];
  return results.filter((result: ExamResult) => result.userId === userId);
};

export const getExamResult = (userId: string, examId: string): ExamResult | undefined => {
  const results = getUserExamResults(userId);
  return results.find(result => result.examId === examId);
};

export const hasUserPassedExam = (userId: string, examId: string): boolean => {
  const result = getExamResult(userId, examId);
  return result ? result.passed : false;
};
