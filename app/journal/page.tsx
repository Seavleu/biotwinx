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
      <GradientBackground variant="accent" intensity="light" />
      
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
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            {/* TODO: Add journal card */}
            <Card className="h-full flex flex-col">
              {/* TODO: Add journal header */}
              <CardHeader>
                <CardTitle>Your Reflection</CardTitle>
                <CardDescription>
                  {processingStatus === "complete" 
                    ? "Analysis complete. Here's your personalized reflection." 
                    : "Complete your journal entry to receive a reflection."}
                </CardDescription>
              </CardHeader> 

              {/* TODO: Add journal results */}
              <CardContent className="flex-grow">
                {processingStatus === "complete" && results ? (
                  <div className="space-y-8">
                    <div className="flex items-center justify-center">
                      <div className="flex items-center space-x-3">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="text-4xl">{emotionEmojis[results.emotionalState]}</div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Detected emotional state: {results.emotionalState}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <div className="h-12 w-[1px] bg-border"></div>
                        <div>
                          <p className="text-sm text-muted-foreground">Sentiment</p>
                          <div className="w-40 h-4 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                results.sentiment > 0.3 ? "bg-success" : 
                                results.sentiment < -0.3 ? "bg-destructive" : "bg-primary"
                              }`}
                              style={{ 
                                width: `${Math.abs(results.sentiment * 100)}%`,
                                marginLeft: results.sentiment < 0 ? 0 : "50%",
                                marginRight: results.sentiment > 0 ? 0 : "50%"
                              }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>Negative</span>
                            <span>Neutral</span>
                            <span>Positive</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* TODO: Add personalized reflection */}
                    <div className="space-y-4">
                      <h3 className="font-medium">Personalized Reflection</h3>
                      <div className="p-6 bg-card rounded-lg border shadow-sm">
                        <p className="italic">{results.reflection}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">Mindfulness Suggestion</h3>
                      {/* TODO: Add mindfulness suggestion */}
                      <div className="p-4 bg-muted/30 rounded-lg">
                        {results.emotionalState === "happy" || results.emotionalState === "energetic" ? (
                          <p className="text-sm">
                            Channel this positive energy into something creative or meaningful. Consider reaching out to someone who might need your uplifting presence today.
                          </p>
                        ) : results.emotionalState === "sad" ? (
                          <p className="text-sm">
                            Practice self-compassion today. Try a 5-minute guided meditation focusing on self-kindness, or engage in a small activity that usually brings you joy.
                          </p>
                        ) : results.emotionalState === "anxious" || results.emotionalState === "stressed" ? (
                          <p className="text-sm">
                            Try the 4-7-8 breathing technique: inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds. Repeat 4 times to help calm your nervous system.
                          </p>
                        ) : results.emotionalState === "tired" ? (
                          <p className="text-sm">
                            Listen to your body's needs. Consider a 20-minute power nap if possible, or take a short walk outside to refresh your energy.
                          </p>
                        ) : results.emotionalState === "calm" ? (
                          <p className="text-sm">
                            This is a good time for reflection or planning. Your calm state can help you see things more clearly and make balanced decisions.
                          </p>
                        ) : (
                          <p className="text-sm">
                            Take a moment to check in with yourself. What would help you feel more engaged or positive right now? Sometimes a small change in environment can shift your perspective.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-12 text-center space-y-4">
                    <PenLine className="h-16 w-16 text-muted-foreground/30" />
                    <div>
                      <p className="text-muted-foreground">Your reflection will appear here</p>
                      <p className="text-sm text-muted-foreground">Complete your journal entry to receive insights</p>
                    </div>
                  </div>
                )}
              </CardContent>
              
              {/* TODO: Add journal footer results + write another entry button */}
              <CardFooter className="flex flex-col">
                {processingStatus === "complete" && (
                  <>
                    <div className="flex flex-col space-y-3 w-full">
                      <Button asChild>
                        <Link href="/insights\" className="w-full">
                          View Your Insights
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" onClick={resetState}>
                        Write Another Entry
                      </Button>
                    </div>
                  </>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
