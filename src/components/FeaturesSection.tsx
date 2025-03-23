
import { useState, useEffect, useRef } from 'react';
import { BookOpen, Award, Clock, FileCheck, CreditCard, Download } from "lucide-react";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const Feature = ({ icon, title, description, delay }: FeatureProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  return (
    <div 
      ref={ref}
      className={`p-6 rounded-xl glass transition-all duration-700 transform ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      title: "Comprehensive Exams",
      description: "Access industry-standard exams designed by experts to test your knowledge and skills.",
      delay: 0,
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: "Flexible Scheduling",
      description: "Take exams on your own time with our flexible scheduling system.",
      delay: 100,
    },
    {
      icon: <FileCheck className="h-6 w-6 text-primary" />,
      title: "Instant Results",
      description: "Receive your exam results immediately after completion with detailed feedback.",
      delay: 200,
    },
    {
      icon: <CreditCard className="h-6 w-6 text-primary" />,
      title: "Secure Payments",
      description: "Pay for certifications securely through our encrypted payment system.",
      delay: 300,
    },
    {
      icon: <Download className="h-6 w-6 text-primary" />,
      title: "Digital Certificates",
      description: "Download your personalized certificates immediately after passing exams.",
      delay: 400,
    },
    {
      icon: <Award className="h-6 w-6 text-primary" />,
      title: "Recognized Credentials",
      description: "Earn credentials recognized by leading companies and organizations worldwide.",
      delay: 500,
    },
  ];

  return (
    <section className="py-20 relative">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block py-1 px-3 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to get certified</h2>
          <p className="text-muted-foreground">
            Our platform provides all the tools and resources needed for your certification journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={feature.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
