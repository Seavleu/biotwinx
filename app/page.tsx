"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Dna, Mic, PenLine, BarChart, Heart } from "lucide-react";
import { GradientBackground } from "@/components/ui/gradient-background";

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
      <GradientBackground variant="accent" intensity="medium" />
      
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
      
      <section id="features" className="container py-16 md:py-24">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Comprehensive Wellness Toolkit</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore the different ways BioTwinX helps you understand and improve your wellbeing.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="group relative overflow-hidden rounded-2xl bg-card p-8 shadow-md transition-all hover:shadow-lg border hover:border-accent"
              whileHover={{ y: -5 }}
              variants={fadeIn}
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                {feature.icon}
              </div>
              <h3 className="mb-3 text-xl font-bold">{feature.title}</h3>
              <p className="mb-6 text-muted-foreground">{feature.description}</p>
              <Button asChild variant="ghost" className="group-hover:text-accent">
                <Link href={feature.href} className="flex items-center gap-2">
                  Explore
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </section>
      
      <section className="container py-16 md:py-24">
        <div className="rounded-2xl bg-card border p-8 md:p-12 relative overflow-hidden">
          <GradientBackground variant="primary" intensity="light" className="opacity-40" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
            <motion.div 
              className="space-y-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-3xl md:text-4xl font-bold">Privacy-First Approach</h2>
              <p className="text-lg text-muted-foreground">
                Your data never leaves your device. BioTwinX uses local storage and processing to ensure your personal information remains private and secure.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-accent"></span>
                  <span>No accounts or sign-ups required</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-accent"></span>
                  <span>All processing happens locally on your device</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-accent"></span>
                  <span>Optional encrypted data storage</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-accent"></span>
                  <span>Clear data deletion options</span>
                </li>
              </ul>
              <Button asChild>
                <Link href="/selfie">Try it Now</Link>
              </Button>
            </motion.div>
            <motion.div 
              className="relative h-[300px] md:h-[400px] rounded-lg bg-muted/50 flex items-center justify-center p-6 border"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <div className="text-center">
                <p className="text-muted-foreground mb-2">Your data visualization will appear here</p>
                <p className="text-sm text-muted-foreground">Start using BioTwinX to generate insights</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      <section className="container py-16 md:py-24">
        <motion.div 
          className="text-center max-w-3xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to discover your wellness potential?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Start your wellness journey today with BioTwinX and gain valuable insights into your health and emotional wellbeing.
          </p>
          <Button asChild size="lg" className="gap-2">
            <Link href="/selfie">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </section>
    </div>
  );
}