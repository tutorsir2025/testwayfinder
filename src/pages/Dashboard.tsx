
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, FileCheck, Award, LogOut } from "lucide-react";
import { getCurrentUser, logout, User } from '@/utils/auth';
import { exams, Exam, getUserExamResults, hasUserPassedExam } from '@/utils/examData';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    setUser(currentUser);
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  const completedExams = user?.completedExams || [];
  const availableExams = exams.filter(exam => !completedExams.includes(exam.id));
  const certificates = exams.filter(exam => completedExams.includes(exam.id));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container py-12">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.firstName}</h1>
              <p className="text-muted-foreground mt-1">Manage your exams and certifications</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>

          {/* Dashboard Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Card className="glass">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Available Exams</CardTitle>
                <CardDescription>Exams ready to take</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{availableExams.length}</div>
              </CardContent>
              <CardFooter>
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {availableExams.length > 0 ? 'Ready for your next challenge' : 'No exams available'}
                </span>
              </CardFooter>
            </Card>
            
            <Card className="glass">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Completed Exams</CardTitle>
                <CardDescription>Exams you've passed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{completedExams.length}</div>
              </CardContent>
              <CardFooter>
                <FileCheck className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {completedExams.length > 0 ? 'Great progress!' : 'Pass an exam to see it here'}
                </span>
              </CardFooter>
            </Card>
            
            <Card className="glass">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Certificates</CardTitle>
                <CardDescription>Your earned credentials</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{certificates.length}</div>
              </CardContent>
              <CardFooter>
                <Award className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {certificates.length > 0 ? 'Showcase your achievements' : 'Earn certificates by passing exams'}
                </span>
              </CardFooter>
            </Card>
          </div>

          {/* Available Exams */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Available Exams</h2>
            
            {availableExams.length === 0 ? (
              <Card className="glass">
                <CardContent className="py-8">
                  <div className="text-center">
                    <p className="text-muted-foreground">
                      You've completed all available exams. Great job!
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableExams.map((exam) => (
                  <Card key={exam.id} className="glass overflow-hidden transition-all duration-300 hover:shadow-md">
                    <CardHeader>
                      <CardTitle>{exam.title}</CardTitle>
                      <CardDescription>{exam.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Duration:</span>
                        <span>{exam.duration} minutes</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Pass Score:</span>
                        <span>{exam.passScore}%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Price:</span>
                        <span>${exam.price}</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link to={`/exam/${exam.id}`} className="w-full">
                        <Button className="w-full">Take Exam</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Certificates */}
          {certificates.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Your Certificates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates.map((exam) => (
                  <Card key={exam.id} className="glass overflow-hidden transition-all duration-300 hover:shadow-md">
                    <CardHeader>
                      <CardTitle>{exam.title}</CardTitle>
                      <CardDescription>Certificate of Completion</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-40 bg-secondary rounded-md flex items-center justify-center mb-4">
                        <Award className="h-16 w-16 text-primary/50" />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Issued to: {user?.firstName} {user?.lastName}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link to={`/certificate/${exam.id}`} className="w-full">
                        <Button className="w-full">View Certificate</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
