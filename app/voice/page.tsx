'use client'

import { useState, useEffect, useRef } from "react"
import {motion} from "framer-motion"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Mic, MicOff, Play, Square, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { GradientBackground } from "@/components/ui/gradient-background";
import { Textarea } from "@/components/ui/textarea";
import { analyzeVoice } from "@/lib/ai-utils";
import { useBioTwinXStore } from "@/lib/store";
import { clearInterval } from "timers";


export default function VoicePage() {
  const [processingStatus, setProcessingStatus] = useState<"idle" | "processing" | "complete" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{ 
    stressLevel: number; 
    fatigueLevel: number; 
    emotionalTone: string; 
    transcription: string; 
} | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isRecording, setIsRecording] = useState(false); 
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);


  const addVoiceEntry = useBioTwinXStore((state) => state.addVoiceEntry);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
 
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  useEffect(() => {
    return () => {
      // Clean up timer when component unmounts
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Clean up audio URL when component unmounts
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);

  // Simulate progress animation
  useEffect(() => {
    if (processingStatus === "processing") {
        const interval = setInterval(() => {
            setProgress((prevProgress) => {
                const newProgress = prevProgress + 5
                if (newProgress >=100) {
                    clearInterval(interval)
                    return 100
                }
                return newProgress
            })
        }, 100)
    }
  }, [processingStatus])

  // Start records
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        const url = URL.createObjectURL(audioBlob)
        setAudioURL(url)
      }

        // Start Recording
        mediaRecorder.start()
        setIsRecording(true)
        setError(null)

        // Start Timer
        setRecordingTime(0)
        timerRef.current = setInterval(() => {
            setRecordingTime((prevTime) => prevTime + 1)
        }, 1000)
    } catch (err) {
        console.error("Error accessing camera:", err)
        setError("Unable to access camera. Please check permissions or try again.")
    }
  }

  // Stop all audio track
  const stopRecording = ()  => {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') return
    mediaRecorderRef.current.stop()
    setIsRecording(false)
   const stream = mediaRecorderRef.current.stream
   stream.getTracks().forEach(track => track.stop())
   
   // Clear Timer
   if(timerRef.current){
    clearInterval(timerRef.current)
    timerRef.current = null
   }
  }      

//   TODO: Remove it to sepearate utils
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
  }

  const playAudio = () => {
    const audioElement = document.getElementById('audio-player') as HTMLAudioElement

    if (audioElement) {
        audioElement.play()
    }
  }

  const stopAudio = () => {
    const audioElement = document.getElementById('audio-player') as HTMLAudioElement

    if (audioElement) {
        audioElement.pause()
        audioElement.currentTime = 0
    }
  }

  const processAudio = async () => {
    if (!audioURL) return
    
    try {
        setProcessingStatus("processing")
        setProgress(0)

        // Call the AI utility func to analyze the audio
        const analysisResults = await analyzeVoice(audioURL)

        setResults(analysisResults)

        addVoiceEntry({
            audioUrl: audioURL,
            transcription: analysisResults.transcription,
            stressLevel: analysisResults.stressLevel,
            fatigueLevel: analysisResults.fatigueLevel,
            notes: `Stress level estimated at ${analysisResults.stressLevel}. Fatigue level estimated at ${analysisResults.fatigueLevel}. Emotional tone: ${analysisResults.emotionalTone}.`
        })

        setProcessingStatus("complete")
    } catch (err) {
        console.error("Error processing audio:", err)
        setError("Error analyzing audio. Please try again.")
        setProcessingStatus("error")
    }
  }

  const resetState = () => {
    if(audioURL){
        URL.revokeObjectURL(audioURL)
        setAudioURL(null)
    }
    
    setProcessingStatus("idle")
    setProgress(0)
    setResults(null)
    setError(null)
    setIsRecording(false)
    setRecordingTime(0)
    mediaRecorderRef.current = null
    audioChunksRef.current = []
    timerRef.current = null

    // setAudioURL(null) 
    // setProcessingStatus("idle")
    // setProgress(0)
    // setResults(null)
    // setError(null)
  }


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
          <Mic className="h-8 w-8 text-accent mr-2" />
          <h1 className="text-3xl font-bold">Voice Analysis</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Record your voice to analyze stress and fatigue levels based on your tone and speech patterns.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        >
          <Card>
            <CardHeader>
              <CardTitle>Record Your Voice</CardTitle>
              <CardDescription>Speak naturally for at least 10 seconds for the most accurate analysis.</CardDescription>
            </CardHeader>
              
            <CardContent className="flex-grow flex flex-col">
                <div className="space-y-6 flex-grow flex flex-col">
                  <div className="flex-grow flex flex-col items-center justify-center p-6 border rounded-lg min-h-[200px] relative">
                    {isRecording ? (
                      <div className="flex flex-col items-center space-y-4 w-full">
                        <div className="relative w-24 h-24 rounded-full border-4 border-accent flex items-center justify-center animate-pulse">
                          <Mic className="h-12 w-12 text-accent" />
                        </div>
                        <div className="text-2xl font-mono">{formatTime(recordingTime)}</div>
                        <p className="text-sm text-muted-foreground">Recording in progress...</p>
                        <Button 
                          variant="destructive" 
                          onClick={stopRecording}
                          className="mt-4"
                        >
                          <Square className="h-4 w-4 mr-2" />
                          Stop Recording
                        </Button>
                      </div>
                    ) : audioURL ? (
                      <div className="flex flex-col items-center space-y-4 w-full">
                        <audio id="audio-player" src={audioURL} className="hidden" />
                        <div className="wave-animation w-full h-16 bg-muted/30 rounded-md"></div>
                        <div className="flex space-x-4">
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={playAudio}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={stopAudio}
                          >
                            <Square className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {processingStatus === "idle" && (
                          <div className="flex flex-col space-y-4 w-full mt-4">
                            <Button onClick={processAudio}>
                              Analyze Recording
                            </Button>
                            <Button variant="outline" onClick={resetState}>
                              Record Again
                            </Button>
                          </div>
                        )}
                        
                        {processingStatus === "processing" && (
                          <div className="space-y-4 w-full mt-4">
                            <div className="flex items-center space-x-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <p className="text-sm text-muted-foreground">Analyzing voice...</p>
                            </div>
                            <Progress value={progress} />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center space-y-4">
                        <Button 
                          size="lg" 
                          onClick={startRecording}
                          className="rounded-full w-16 h-16 p-0"
                        >
                          <Mic className="h-6 w-6" />
                        </Button>
                        <p className="text-muted-foreground">Click to start recording</p>
                      </div>
                    )}
                  </div>
                  
                  {error && (
                    <div className="flex items-center text-destructive text-sm mt-2">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <p>{error}</p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Recording Tips:</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Speak in a normal, conversational tone</li>
                      <li>• Try to record in a quiet environment</li>
                      <li>• Talk about how your day is going or how you're feeling</li>
                      <li>• Aim for at least 10 seconds of speech</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
          </Card>
        </motion.div>
      </div>
      </div>
    </div>
  )
}
