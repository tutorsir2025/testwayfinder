
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Clock, AlertTriangle } from "lucide-react";
import { getCurrentUser } from '@/utils/auth';
import { getExam, Exam, Question, saveExamResult } from '@/utils/examData';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ExamPage = () => {
  const { examId } = useParams<{ examId: string }>();
  const [exam, setExam] = useState<Exam | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: string]: number }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  // Load exam
  useEffect(() => {
    if (examId) {
      const loadedExam = getExam(examId);
      if (loadedExam) {
        setExam(loadedExam);
        setTimeLeft(loadedExam.duration * 60); // Convert to seconds
      } else {
        toast({
          title: "Error",
          description: "Exam not found.",
          variant: "destructive",
        });
        navigate('/dashboard');
      }
    }
  }, [examId, navigate]);

  // Timer
  useEffect(() => {
    if (!examStarted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          submitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, timeLeft]);

  const startExam = () => {
    setExamStarted(true);
  };

  const handleAnswerChange = (questionId: string, answerIndex: number) => {
    setAnswers({
      ...answers,
      [questionId]: answerIndex,
    });
  };

  const navToQuestion = (index: number) => {
    if (index >= 0 && exam && index < exam.questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const isLastQuestion = () => {
    return exam && currentQuestionIndex === exam.questions.length - 1;
  };

  const submitExam = () => {
    if (!exam) return;
    
    const user = getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Calculate score
    let correctAnswers = 0;
    exam.questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const scorePercentage = (correctAnswers / exam.questions.length) * 100;
    const passed = scorePercentage >= exam.passScore;
    
    // Save result
    saveExamResult({
      examId: exam.id,
      userId: user.id,
      score: scorePercentage,
      passed,
      date: new Date().toISOString(),
      answers,
    });
    
    if (passed) {
      toast({
        title: "Congratulations!",
        description: `You passed with a score of ${scorePercentage.toFixed(1)}%`,
      });
      navigate(`/payment/${exam.id}`);
    } else {
      toast({
        title: "Exam failed",
        description: `Your score: ${scorePercentage.toFixed(1)}%. Required: ${exam.passScore}%`,
        variant: "destructive",
      });
      navigate('/dashboard');
    }
  };

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading exam...</div>
      </div>
    );
  }

  const currentQuestion: Question = exam.questions[currentQuestionIndex];
  const progress = Math.round(
    (Object.keys(answers).length / exam.questions.length) * 100
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container py-12">
          {!examStarted ? (
            <Card className="max-w-2xl mx-auto glass">
              <CardHeader>
                <CardTitle>{exam.title}</CardTitle>
                <CardDescription>{exam.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Duration:</span>
                  <span>{exam.duration} minutes</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Questions:</span>
                  <span>{exam.questions.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Pass Score:</span>
                  <span>{exam.passScore}%</span>
                </div>
                
                <Alert className="mt-6">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    Once you start the exam, the timer will begin. You must complete the exam within the allocated time.
                  </AlertDescription>
                </Alert>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={startExam}>
                  Start Exam
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="max-w-3xl mx-auto">
              {/* Exam Header */}
              <div className="mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <h1 className="text-2xl font-bold">{exam.title}</h1>
                  <div className="flex items-center mt-2 md:mt-0">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className={`font-mono ${timeLeft < 60 ? 'text-destructive animate-pulse' : ''}`}>
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Question {currentQuestionIndex + 1} of {exam.questions.length}</span>
                  <span>{progress}% Completed</span>
                </div>
              </div>

              {/* Question */}
              <Card className="mb-6 glass">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Question {currentQuestionIndex + 1}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-6">{currentQuestion.text}</p>
                  <RadioGroup
                    value={answers[currentQuestion.id]?.toString()}
                    onValueChange={(value) => 
                      handleAnswerChange(currentQuestion.id, parseInt(value))
                    }
                  >
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 rounded-md hover:bg-secondary/50 transition-colors">
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => navToQuestion(currentQuestionIndex - 1)}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>
                
                {isLastQuestion() ? (
                  <Button 
                    onClick={submitExam}
                    disabled={Object.keys(answers).length < exam.questions.length}
                  >
                    Submit Exam
                  </Button>
                ) : (
                  <Button
                    onClick={() => navToQuestion(currentQuestionIndex + 1)}
                  >
                    Next
                  </Button>
                )}
              </div>

              {/* Question Navigation */}
              <div className="mt-8">
                <h3 className="text-sm font-medium mb-2">Question Navigation</h3>
                <div className="flex flex-wrap gap-2">
                  {exam.questions.map((_, index) => (
                    <Button
                      key={index}
                      variant={currentQuestionIndex === index ? "default" : 
                        answers[exam.questions[index].id] !== undefined ? "outline" : "ghost"
                      }
                      size="sm"
                      onClick={() => navToQuestion(index)}
                      className="w-10 h-10 p-0"
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExamPage;
