
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const Hero = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative pt-32 pb-16 md:pt-48 md:pb-32 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-70 animate-pulse-subtle" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-70 animate-spin-slow" />
      
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div 
            className={`mb-6 opacity-0 ${
              mounted ? 'animate-fade-in' : ''
            }`}
          >
            <span className="inline-block py-1 px-3 rounded-full text-sm font-medium bg-primary/10 text-primary">
              Professional Certification Platform
            </span>
          </div>
          
          <h1 
            className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6 opacity-0 ${
              mounted ? 'animate-fade-in animate-delay-100' : ''
            }`}
          >
            Advance Your Career with
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Professional Certifications
            </span>
          </h1>
          
          <p 
            className={`text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto opacity-0 ${
              mounted ? 'animate-fade-in animate-delay-200' : ''
            }`}
          >
            Demonstrate your expertise with industry-recognized credentials. 
            Register, take exams, and get certified to stand out in your field.
          </p>
          
          <div 
            className={`flex flex-col sm:flex-row gap-4 justify-center items-center opacity-0 ${
              mounted ? 'animate-fade-in animate-delay-300' : ''
            }`}
          >
            <Link to="/register">
              <Button size="lg" className="rounded-full px-8 transition-all">
                Get Started
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="lg" className="rounded-full px-8 transition-all">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Hero Image */}
        <div 
          className={`mt-16 md:mt-24 max-w-5xl mx-auto relative opacity-0 ${
            mounted ? 'animate-fade-in animate-delay-400' : ''
          }`}
        >
          <div className="relative overflow-hidden rounded-xl border shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20 z-10" />
            <div className="aspect-[16/9] bg-muted/30 flex items-center justify-center">
              <div className="relative w-full h-full bg-gradient-to-br from-secondary to-background/80 flex items-center justify-center">
                <div className="glass absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 flex items-center justify-center rounded-xl">
                  <div className="text-center">
                    <h3 className="text-xl font-medium mb-2">Demo Certificate</h3>
                    <p className="text-sm text-muted-foreground mb-4">This could be yours after certification</p>
                    <div className="w-32 h-32 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary text-5xl font-bold">A+</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
