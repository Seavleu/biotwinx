"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Dna, Mic, PenLine, BarChart, Heart } from "lucide-react";
// import { GradientBackground } from "@/components/ui/gradient-background";

export default function Home() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const features = [
    {
      icon: <Dna className="h-10 w-10 text-accent" />,
      title: "Biological Age",
      description: "Upload a selfie to estimate your biological age and track changes over time.",
      href: "/selfie"
    },
    {
      icon: <Mic className="h-10 w-10 text-accent" />,
      title: "Voice Analysis",
      description: "Record your voice to analyze stress and fatigue levels from your tone and speech patterns.",
      href: "/voice"
    },
    {
      icon: <PenLine className="h-10 w-10 text-accent" />,
      title: "Emotional Journal",
      description: "Keep a journal to track your mood and receive personalized wellness reflections.",
      href: "/journal"
    },
    {
      icon: <BarChart className="h-10 w-10 text-accent" />,
      title: "Wellness Insights",
      description: "View trends and patterns in your data to gain insights into your overall wellbeing.",
      href: "/insights"
    }
  ];

  return (
    <div className="relative min-h-screen">
      {/* <GradientBackground variant="accent" intensity="medium" /> */}
      
      <section className="container pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="flex items-center gap-2"
          >
            <Heart className="h-6 w-6 text-accent" />
            <span className="text-sm font-medium text-accent">Your AI-powered Wellness Companion</span>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-bold tracking-tight"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            Discover Your <span className="text-accent">Bio Twin</span> and Optimize Your Wellbeing
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground max-w-3xl"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            BioTwinX is your multimodal, AI-powered self-health and emotional wellness companion. Understand your biological age, track stress levels, and receive personalized wellness suggestions - all with privacy as our priority.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 pt-4"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <Button asChild size="lg" className="gap-2">
              <Link href="/selfie">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#features">
                Learn More
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
      
      {/* TODO: Comprehensive Wellness ToolKit */}
      <section id="features" className="container py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Comprehensive Wellness Toolkit</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore the different ways BioTwinX helps you understand and improve your wellbeing.
          </p>
        </div>  
      </section>
      {/* TODO: Privacy-First Approach */}
      <section className="container py-16 md:py-24">
        <div className="rounded-2xl bg-card border p-8 md:p-12 relative overflow-hidden"> 
        <h2 className="text-3xl md:text-4xl font-bold">Privacy-First Approach</h2>
        </div>
      </section>
      
      {/* TODO: Comprehensive Wellness ToolKit */}
      <section className="container py-16 md:py-24">
         
      </section>
    </div>
  );
}