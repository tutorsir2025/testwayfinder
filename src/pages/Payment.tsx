
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { getCurrentUser } from '@/utils/auth';
import { getExam } from '@/utils/examData';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Payment = () => {
  const { examId } = useParams<{ examId: string }>();
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const navigate = useNavigate();

  // Load exam and check authentication
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }

    if (examId) {
      const exam = getExam(examId);
      if (!exam) {
        toast({
          title: "Error",
          description: "Exam not found.",
          variant: "destructive",
        });
        navigate('/dashboard');
      }
    } else {
      navigate('/dashboard');
    }
  }, [examId, navigate]);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 16) {
      setCardNumber(value);
    }
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 4) {
      if (value.length > 2) {
        setExpiryDate(value.slice(0, 2) + '/' + value.slice(2));
      } else {
        setExpiryDate(value);
      }
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 3) {
      setCvv(value);
    }
  };

  const formatCardNumber = (value: string) => {
    const groups = [];
    for (let i = 0; i < value.length; i += 4) {
      groups.push(value.slice(i, i + 4));
    }
    return groups.join(' ');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (cardNumber.length !== 16) {
      toast({
        title: "Error",
        description: "Please enter a valid card number.",
        variant: "destructive",
      });
      return;
    }
    
    if (!cardName) {
      toast({
        title: "Error",
        description: "Please enter the name on card.",
        variant: "destructive",
      });
      return;
    }
    
    if (expiryDate.length < 4) {
      toast({
        title: "Error",
        description: "Please enter a valid expiry date.",
        variant: "destructive",
      });
      return;
    }
    
    if (cvv.length !== 3) {
      toast({
        title: "Error",
        description: "Please enter a valid CVV.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Payment Successful",
        description: "Your certificate is now available to download.",
      });
      navigate(`/certificate/${examId}`);
    }, 2000);
  };

  const exam = examId ? getExam(examId) : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container py-12">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">Payment</h1>
            
            <Card className="glass">
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>
                  {exam ? `Complete payment to receive your ${exam.title} certificate.` : 'Complete your payment.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex justify-between items-center py-2 px-4 rounded-lg bg-primary/5 mb-4">
                    <span>Certificate Fee</span>
                    <span className="font-medium">${exam?.price || 0}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-4 rounded-lg bg-primary/5">
                    <span>Total</span>
                    <span className="font-bold">${exam?.price || 0}</span>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formatCardNumber(cardNumber)}
                      onChange={handleCardNumberChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={handleExpiryDateChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={cvv}
                        onChange={handleCvvChange}
                        required
                        maxLength={3}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full mt-6"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : `Pay $${exam?.price || 0}`}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex justify-center text-sm text-muted-foreground">
                Your payment information is secure and encrypted
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Payment;
