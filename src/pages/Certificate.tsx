
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { getCurrentUser } from '@/utils/auth';
import { getExam, hasUserPassedExam } from '@/utils/examData';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Certificate = () => {
  const { examId } = useParams<{ examId: string }>();
  const [loading, setLoading] = useState(true);
  const certificateRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }

    if (!examId) {
      navigate('/dashboard');
      return;
    }

    // Check if user has passed the exam
    const hasPassed = hasUserPassedExam(user.id, examId);
    if (!hasPassed) {
      toast({
        title: "Access Denied",
        description: "You need to pass the exam to access the certificate.",
        variant: "destructive",
      });
      navigate('/dashboard');
      return;
    }

    setLoading(false);
  }, [examId, navigate]);

  const downloadCertificate = async () => {
    if (!certificateRef.current) return;

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });
      
      const imgWidth = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('certificate.pdf');
      
      toast({
        title: "Success",
        description: "Certificate downloaded successfully.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to download certificate.",
        variant: "destructive",
      });
    }
  };

  const shareCertificate = () => {
    // In a real app, this would open a share dialog or copy a sharing link
    toast({
      title: "Share Certificate",
      description: "Sharing functionality would be implemented here.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading certificate...</div>
      </div>
    );
  }

  const user = getCurrentUser();
  const exam = examId ? getExam(examId) : null;
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container py-12">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <h1 className="text-2xl font-bold mb-4 md:mb-0">Your Certificate</h1>
              <div className="flex space-x-4">
                <Button variant="outline" onClick={shareCertificate}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button onClick={downloadCertificate}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
            
            {/* Certificate Preview */}
            <div className="p-4 border rounded-lg overflow-hidden bg-white shadow-lg">
              <div 
                ref={certificateRef}
                className="relative aspect-[1.414/1] bg-gradient-to-r from-primary/5 to-primary/10 p-12 rounded-lg flex flex-col justify-between items-center"
              >
                {/* Certificate Border */}
                <div className="absolute inset-4 border-[3px] border-primary/20 rounded-lg pointer-events-none"></div>
                
                {/* Certificate Header */}
                <div className="text-center">
                  <div className="text-sm font-medium uppercase tracking-wider mb-2 text-primary/70">Certificate of Completion</div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-1">{exam?.title}</h2>
                  <div className="h-0.5 w-32 bg-primary/20 mx-auto my-4"></div>
                </div>
                
                {/* Certificate Content */}
                <div className="text-center max-w-2xl">
                  <p className="text-lg md:text-xl mb-6">
                    This is to certify that
                  </p>
                  <p className="text-2xl md:text-3xl font-bold mb-6">{user?.firstName} {user?.lastName}</p>
                  <p className="text-base md:text-lg mb-6">
                    has successfully completed the {exam?.title} examination
                    with a passing score, demonstrating proficiency in the subject matter.
                  </p>
                </div>
                
                {/* Certificate Footer */}
                <div className="flex flex-col md:flex-row justify-between items-center w-full">
                  <div className="text-center md:text-left mb-4 md:mb-0">
                    <div className="h-0.5 w-20 bg-primary/20 mb-2"></div>
                    <div className="text-sm">Date Issued</div>
                    <div>{currentDate}</div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                      <span className="text-primary text-2xl font-bold">CP</span>
                    </div>
                    <div className="text-sm">CertifyPro</div>
                  </div>
                  
                  <div className="text-center md:text-right mt-4 md:mt-0">
                    <div className="h-0.5 w-20 bg-primary/20 mb-2 md:ml-auto"></div>
                    <div className="text-sm">Certificate ID</div>
                    <div>{user?.id.slice(0, 8)}-{examId?.slice(0, 6)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Certificate;
