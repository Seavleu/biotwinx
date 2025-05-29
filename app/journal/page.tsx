"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { PenLine, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { GradientBackground } from "@/components/ui/gradient-background";
import { useBioTwinXStore, EmotionalState } from "@/lib/store";
import { analyzeJournalText } from "@/lib/ai-utils";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function JournalPage() {
  const [journalText, setJournalText] = useState("");
  const [processingStatus, setProcessingStatus] = useState<"idle" | "processing" | "complete" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{
    emotionalState: EmotionalState;
    sentiment: number;
    reflection: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const addJournalEntry = useBioTwinXStore((state) => state.addJournalEntry);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const emotionEmojis: Record<EmotionalState, string> = {
    happy: "😊",
    sad: "😔",
    anxious: "😰",
    calm: "😌",
    stressed: "😓",
    energetic: "😃",
    tired: "😴",
    neutral: "😐",
  };

  // Simulate progress animation
  const processJournal = async () => {
    if (!journalText.trim()) {
      setError("Please write something in your journal first.");
      return;
    }
    
    try {
      setProcessingStatus("processing");
      setProgress(0);
      setError(null);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + 5;
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return newProgress;
        });
      }, 100);
      
      // Call the AI utility function to analyze the journal text
      const analysisResults = await analyzeJournalText(journalText);
      
      // Clear interval
      clearInterval(progressInterval);
      setProgress(100);
      
      // Set the results
      setResults({
        emotionalState: analysisResults.emotionalState as EmotionalState,
        sentiment: analysisResults.sentiment,
        reflection: analysisResults.reflection
      });
      
      // Add entry to store
      addJournalEntry({
        text: journalText,
        emotionalState: analysisResults.emotionalState as EmotionalState,
        reflection: analysisResults.reflection
      });
      
      setProcessingStatus("complete");
    } catch (err) {
      console.error("Error processing journal:", err);
      setError("Error analyzing journal text. Please try again.");
      setProcessingStatus("error");
    }
  };
  
  const resetState = () => {
    setJournalText("");
    setProcessingStatus("idle");
    setProgress(0);
    setResults(null);
    setError(null);
  };

  return (
    <div className="relative min-h-screen pb-16">
      <GradientBackground variant="secondary" intensity="light" />
      
      <div className="container pt-12 md:pt-16">
        <motion.div 
          className="max-w-3xl mx-auto text-center mb-12"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div className="flex items-center justify-center mb-4">
            <PenLine className="h-8 w-8 text-accent mr-2" />
            <h1 className="text-3xl font-bold">Emotional Journal</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Express your thoughts and feelings to receive personalized wellness reflections.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* TODO: Add journal entry form */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Write Your Journal</CardTitle>
                <CardDescription>
                  Share your thoughts, feelings, or experiences from today.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-grow flex flex-col">
                <div className="space-y-6 flex-grow flex flex-col">
                  <Textarea 
                    value={journalText}
                    onChange={(e) => setJournalText(e.target.value)}
                    placeholder="How are you feeling today? What's on your mind?"
                    className="flex-grow min-h-[300px] resize-none"
                    disabled={processingStatus === "processing"}
                  />
                  
                  {error && (
                    <div className="flex items-center text-destructive text-sm">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <p>{error}</p>
                    </div>
                  )}
                  
                  {processingStatus === "idle" && (
                    <Button 
                      onClick={processJournal}
                      disabled={!journalText.trim()}
                    >
                      Analyze Journal
                    </Button>
                  )}
                  
                  {processingStatus === "processing" && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <p className="text-sm text-muted-foreground">Analyzing your journal...</p>
                      </div>
                      <Progress value={progress} />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* TODO: Add journal results */}
          
        </div>
      </div>
    </div>
  );
}