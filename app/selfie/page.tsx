"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Dna, Camera, Upload, Loader2, AlertCircle, Clock, ArrowRight } from "lucide-react";
import { GradientBackground } from "@/components/ui/gradient-background";
import { useBioTwinXStore } from "@/lib/store";
import { analyzeFacialImage } from "@/lib/ai-utils";
import Link from "next/link";

export default function SelfiePage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<"idle" | "processing" | "complete" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{
    bioAge: number;
    chronologicalAge: number;
    features: { [key: string]: number };
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [hasCameraSupport, setHasCameraSupport] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const addSelfieEntry = useBioTwinXStore((state) => state.addSelfieEntry);

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
    // Check if MediaDevices API is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setHasCameraSupport(false);
    }
    
    return () => {
      // Stop camera when component unmounts
      if (isCameraActive) {
        stopCamera();
      }
    };
  }, []);

  // Simulate progress animation
  useEffect(() => {
    if (processingStatus === "processing") {
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + 5;
          if (newProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return newProgress;
        });
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [processingStatus]);

  const startCamera = async () => {
    try {
      if (!videoRef.current) return;
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" }
      });
      
      videoRef.current.srcObject = stream;
      setIsCameraActive(true);
      setError(null);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Unable to access camera. Please check permissions or try uploading an image instead.");
      setIsCameraActive(false);
      setHasCameraSupport(false);
    }
  };
  
  const stopCamera = () => {
    if (!videoRef.current || !videoRef.current.srcObject) return;
    
    const stream = videoRef.current.srcObject as MediaStream;
    const tracks = stream.getTracks();
    
    tracks.forEach(track => track.stop());
    videoRef.current.srcObject = null;
    setIsCameraActive(false);
  };
  
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to image data URL
    const imageDataURL = canvas.toDataURL("image/jpeg");
    setSelectedImage(imageDataURL);
    
    // Stop camera
    stopCamera();
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check if the file is an image
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    
    // Read the file and convert to data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataURL = e.target?.result as string;
      setSelectedImage(imageDataURL);
      setError(null);
    };
    reader.onerror = () => {
      setError("Error reading file. Please try again.");
    };
    reader.readAsDataURL(file);
  };
  
  const processImage = async () => {
    if (!selectedImage) return;
    
    try {
      setProcessingStatus("processing");
      setProgress(0);
      
      // For demo purposes, generate a random age between 25-45
      const chronologicalAge = Math.floor(Math.random() * 20) + 25;
      
      // Call the AI utility function to analyze the image
      const analysisResults = await analyzeFacialImage(selectedImage);
      
      // Set the results
      setResults({
        bioAge: analysisResults.bioAge,
        chronologicalAge,
        features: analysisResults.features
      });
      
      // Add entry to store
      addSelfieEntry({
        imageUrl: selectedImage,
        bioAge: analysisResults.bioAge,
        chronologicalAge,
        notes: `Biological age estimated at ${analysisResults.bioAge} years.`
      });
      
      setProcessingStatus("complete");
    } catch (err) {
      console.error("Error processing image:", err);
      setError("Error analyzing image. Please try again.");
      setProcessingStatus("error");
    }
  };
  
  const resetState = () => {
    setSelectedImage(null);
    setProcessingStatus("idle");
    setProgress(0);
    setResults(null);
    setError(null);
  };

  const getAgeDifference = () => {
    if (!results) return 0;
    return results.chronologicalAge - results.bioAge;
  };

    return (
        <div className="relative min-h-screen pb-16">
        <GradientBackground variant="primary" intensity="light" />
        
        <div className="container pt-12 md:pt-16">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-12"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="flex items-center justify-center mb-4">
              <Dna className="h-8 w-8 text-accent mr-2" />
              <h1 className="text-3xl font-bold">Biological Age Estimation</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Upload a selfie or take a photo to estimate your biological age and track how lifestyle changes affect your health over time.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle>Capture Your Image</CardTitle>
                  <CardDescription>
                    Take a clear selfie or upload a photo for the most accurate results.
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-grow flex flex-col">
                  {!selectedImage ? (
                    <div className="space-y-6 flex-grow flex flex-col">
                      {isCameraActive ? (
                        <div className="relative flex-grow min-h-[300px] flex flex-col items-center justify-center border rounded-lg overflow-hidden bg-muted/50">
                          <video 
                            ref={videoRef} 
                            autoPlay 
                            playsInline 
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <Button 
                            onClick={captureImage}
                            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10"
                            size="lg"
                          >
                            <Camera className="mr-2 h-4 w-4" />
                            Take Photo
                          </Button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                          {hasCameraSupport && (
                            <div 
                              className="border rounded-lg p-6 flex flex-col items-center justify-center hover:border-primary cursor-pointer transition-colors h-full min-h-[200px]"
                              onClick={startCamera}
                            >
                              <Camera className="h-10 w-10 text-muted-foreground mb-4" />
                              <p className="text-center font-medium">Take a Photo</p>
                              <p className="text-xs text-muted-foreground text-center mt-2">
                                Use your camera to take a selfie
                              </p>
                            </div>
                          )}
                          <div 
                            className="border rounded-lg p-6 flex flex-col items-center justify-center hover:border-primary cursor-pointer transition-colors h-full min-h-[200px]"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                            <p className="text-center font-medium">Upload an Image</p>
                            <p className="text-xs text-muted-foreground text-center mt-2">
                              Select an image from your device
                            </p>
                            <input 
                              type="file" 
                              ref={fileInputRef}
                              className="hidden" 
                              accept="image/*"
                              onChange={handleFileUpload}
                            />
                          </div>
                        </div>
                      )}
                      
                      {error && (
                        <div className="flex items-center text-destructive text-sm mt-2">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          <p>{error}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-6 flex-grow flex flex-col">
                      <div className="relative aspect-square max-h-[400px] rounded-lg overflow-hidden border mx-auto">
                        <img 
                          src={selectedImage} 
                          alt="Selected"
                          className="object-cover w-full h-full"
                        />
                      </div>
                      
                      {processingStatus === "idle" && (
                        <div className="flex flex-col space-y-4">
                          <Button onClick={processImage}>
                            Analyze Image
                          </Button>
                          <Button variant="outline" onClick={resetState}>
                            Select Different Image
                          </Button>
                        </div>
                      )}
                      
                      {processingStatus === "processing" && (
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <p className="text-sm text-muted-foreground">Analyzing image...</p>
                          </div>
                          <Progress value={progress} />
                        </div>
                      )}
                      
                      {processingStatus === "error" && (
                        <div className="flex items-center text-destructive">
                          <AlertCircle className="h-5 w-5 mr-2" />
                          <p>{error || "An error occurred during analysis. Please try again."}</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
                
                <canvas ref={canvasRef} className="hidden" />
              </Card>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <Card className={`h-full flex flex-col ${processingStatus === "complete" ? "bio-card" : ""}`}>
                <CardHeader>
                  <CardTitle>Your Biological Age</CardTitle>
                  <CardDescription>
                    {processingStatus === "complete" 
                      ? "Analysis complete. Here are your results." 
                      : "Complete the analysis to see your results."}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-grow">
                  {processingStatus === "complete" && results ? (
                    <div className="space-y-8">
                      <div className="grid grid-cols-2 gap-6 text-center">
                        <div className="space-y-2">
                          <p className="text-muted-foreground text-sm">Biological Age</p>
                          <div className="text-4xl font-bold text-accent">{results.bioAge}</div>
                          <p className="text-xs text-muted-foreground">years</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-muted-foreground text-sm">Chronological Age</p>
                          <div className="text-4xl font-bold">{results.chronologicalAge}</div>
                          <p className="text-xs text-muted-foreground">years</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Age Difference</h3>
                          <div className={`text-sm font-medium ${getAgeDifference() > 0 ? "text-success" : getAgeDifference() < 0 ? "text-destructive" : ""}`}>
                            {getAgeDifference() > 0 ? "+" : ""}{getAgeDifference()} years
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {getAgeDifference() > 5 
                            ? "Your biological age is significantly younger than your chronological age. Great job maintaining your health!" 
                            : getAgeDifference() > 0 
                              ? "Your biological age is younger than your chronological age. You're doing well!" 
                              : getAgeDifference() < -5 
                                ? "Your biological age is significantly older than your chronological age. Consider lifestyle improvements." 
                                : getAgeDifference() < 0 
                                  ? "Your biological age is older than your chronological age. There's room for improvement." 
                                  : "Your biological age matches your chronological age."}
                        </p>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <h3 className="font-medium">Feature Analysis</h3>
                        {Object.entries(results.features).map(([feature, value], index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <p className="capitalize">{feature.replace(/([A-Z])/g, ' $1').trim()}</p>
                              <p className="text-muted-foreground">{Math.round(value * 100)}%</p>
                            </div>
                            <Progress value={value * 100} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full py-12 text-center space-y-4">
                      <Clock className="h-16 w-16 text-muted-foreground/30" />
                      <div>
                        <p className="text-muted-foreground">Your results will appear here</p>
                        <p className="text-sm text-muted-foreground">Upload or take a photo to begin analysis</p>
                      </div>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="flex flex-col">
                  {processingStatus === "complete" && (
                    <>
                      <div className="flex flex-col space-y-3 w-full">
                        <Button asChild>
                          <Link href="/voice\" className="w-full">
                            Continue to Voice Analysis
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" onClick={resetState}>
                          Start Over
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
