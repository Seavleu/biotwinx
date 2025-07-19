"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BarChart, Activity, Heart, Calendar, Dna, Mic, PenLine, Check, Timer, ThumbsUp, Loader2, LucideBarChart } from "lucide-react"
import { GradientBackground } from "@/components/ui/gradient-background"
import { useBioTwinXStore } from "@/lib/store"
import { generateWellnessAdvice } from "@/lib/ai-utils"
import { format as formatDateFns, parseISO } from "date-fns"
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { mockBioAgeData, mockStressData, mockEmotionData } from "@/data/mockData"

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isGeneratingAdvice, setIsGeneratingAdvice] = useState(false)
  
  const { 
    journalEntries, 
    voiceEntries, 
    selfieEntries, 
    wellnessAdvice,
    addWellnessAdvice,
    toggleWellnessAdviceCompleted
  } = useBioTwinXStore()

  const bioAgeData = prepareBioAgeData();
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  useEffect(() => {
    // Auto-generate wellness advice if none exists
    if (wellnessAdvice.length === 0 && 
        (journalEntries.length > 0 || voiceEntries.length > 0 || selfieEntries.length > 0)) {
      generateAdvice()
    }
  }, [])

  const generateAdvice = async () => {
    setIsGeneratingAdvice(true)
    
    try {
      const advice = await generateWellnessAdvice({
        recentJournals: journalEntries.slice(0, 5),
        recentVoice: voiceEntries.slice(0, 5),
        recentSelfies: selfieEntries.slice(0, 5)
      })
      
      // Add each piece of advice to the store
      addWellnessAdvice({
        text: advice.nutritionAdvice,
        category: 'nutrition'
      })
      
      addWellnessAdvice({
        text: advice.exerciseAdvice,
        category: 'exercise'
      })
      
      addWellnessAdvice({
        text: advice.sleepAdvice,
        category: 'sleep'
      })
      
      addWellnessAdvice({
        text: advice.mentalAdvice,
        category: 'mental'
      })
      
      addWellnessAdvice({
        text: advice.socialAdvice,
        category: 'social'
      })
    } catch (error) {
      console.error("Error generating wellness advice:", error)
    } finally {
      setIsGeneratingAdvice(false)
    }
  }

  const formatDate = (dateString: string | Date) => {
    try {
      const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
      return formatDateFns(date, 'MMM d, yyyy');
    } catch (error) {
      return typeof dateString === 'string' ? dateString : dateString.toString();
    }
  }

  const getEmotionColor = (emotion: string) => {
    const emotionColors: Record<string, string> = {
      happy: "bg-green-500",
      sad: "bg-blue-500",
      anxious: "bg-yellow-500",
      calm: "bg-teal-500",
      stressed: "bg-red-500",
      energetic: "bg-orange-500",
      tired: "bg-purple-500",
      neutral: "bg-gray-500"
    }
    
    return emotionColors[emotion] || "bg-gray-500"
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'nutrition':
        return <Heart className="h-5 w-5 text-accent" />
      case 'exercise':
        return <Activity className="h-5 w-5 text-accent" />
      case 'sleep':
        return <Timer className="h-5 w-5 text-accent" />
      case 'mental':
        return <ThumbsUp className="h-5 w-5 text-accent" />
      case 'social':
        return <Calendar className="h-5 w-5 text-accent" />
      default:
        return <Heart className="h-5 w-5 text-accent" />
    }
  }

  // Prepare data for charts
  const prepareStressData = () => {
    return voiceEntries.length > 0
      ? voiceEntries.slice(0, 7).reverse().map(entry => ({
          date: formatDate(entry.createdAt),
          stress: entry.stressLevel,
          fatigue: entry.fatigueLevel,
        }))
      : mockStressData; // fallback
  }
  
  const prepareBioAgeData = () => {
    return selfieEntries.length > 0
      ? selfieEntries.slice(0, 7).reverse().map(entry => ({
          date: formatDate(entry.createdAt),
          bioAge: entry.bioAge,
          chronologicalAge: entry.chronologicalAge,
          difference: entry.chronologicalAge - entry.bioAge,
        }))
      : mockBioAgeData;
  }
  
  const prepareEmotionData = () => {
    if (journalEntries.length === 0) return mockEmotionData;
  
    const emotions = journalEntries.reduce((acc, entry) => {
      acc[entry.emotionalState] = (acc[entry.emotionalState] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  
    return Object.entries(emotions).map(([emotion, count]) => ({
      emotion,
      count,
    }))
  }
  

  const hasData = journalEntries.length > 0 || voiceEntries.length > 0 || selfieEntries.length > 0;

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
            <LucideBarChart className="h-8 w-8 text-accent mr-2" />
            <h1 className="text-3xl font-bold">Wellness Insights</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Track your progress and discover patterns in your physical and emotional well-being.
          </p>
        </motion.div>
        
        <Tabs 
          defaultValue="overview" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="max-w-6xl mx-auto"
        >
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="flex justify-center mb-8"
          >
            <TabsList className="grid grid-cols-4 w-full max-w-xl">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>
          </motion.div>
          
          <TabsContent value="overview" className="space-y-8">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Dna className="h-4 w-4 mr-2" />
                      Bio Age
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selfieEntries.length > 0 ? (
                      <div>
                        <div className="text-2xl font-bold">{selfieEntries[0].bioAge}</div>
                        <p className="text-xs text-muted-foreground">
                          vs chronological age {selfieEntries[0].chronologicalAge}
                        </p>
                        <p className={`text-xs ${selfieEntries[0].chronologicalAge - selfieEntries[0].bioAge > 0 ? 'text-success' : 'text-destructive'}`}>
                          {selfieEntries[0].chronologicalAge - selfieEntries[0].bioAge > 0 ? '+' : ''}
                          {selfieEntries[0].chronologicalAge - selfieEntries[0].bioAge} years
                        </p>
                      </div>
                    ) : (
                      <div className="text-muted-foreground text-sm flex flex-col items-center justify-center h-12">
                        <p>No data yet</p>
                        <Button variant="link" size="sm" asChild className="p-0 h-auto">
                          <a href="/selfie">Take a selfie</a>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Mic className="h-4 w-4 mr-2" />
                      Stress Level
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {voiceEntries.length > 0 ? (
                      <div>
                        <div className="text-2xl font-bold">{voiceEntries[0].stressLevel}%</div>
                        <div className="w-full h-2 bg-muted rounded-full mt-2">
                          <div 
                            className={`h-full rounded-full ${
                              voiceEntries[0].stressLevel > 75 ? "bg-destructive" : 
                              voiceEntries[0].stressLevel > 50 ? "bg-warning" : 
                              "bg-success"
                            }`}
                            style={{ width: `${voiceEntries[0].stressLevel}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Last measured {formatDate(voiceEntries[0].createdAt)}
                        </p>
                      </div>
                    ) : (
                      <div className="text-muted-foreground text-sm flex flex-col items-center justify-center h-12">
                        <p>No data yet</p>
                        <Button variant="link" size="sm" asChild className="p-0 h-auto">
                          <a href="/voice">Record your voice</a>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <PenLine className="h-4 w-4 mr-2" />
                      Mood
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {journalEntries.length > 0 ? (
                      <div>
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-2 ${getEmotionColor(journalEntries[0].emotionalState)}`} />
                          <div className="text-2xl font-bold capitalize">{journalEntries[0].emotionalState}</div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Based on your latest journal entry
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(journalEntries[0].createdAt)}
                        </p>
                      </div>
                    ) : (
                      <div className="text-muted-foreground text-sm flex flex-col items-center justify-center h-12">
                        <p>No data yet</p>
                        <Button variant="link" size="sm" asChild className="p-0 h-auto">
                          <a href="/journal">Write in journal</a>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
            
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your latest wellness check-ins and entries
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px] pr-4">
                    {!hasData ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <Activity className="h-12 w-12 text-muted-foreground/30 mb-4" />
                        <p className="text-muted-foreground">No activity yet</p>
                        <p className="text-sm text-muted-foreground">
                          Start by taking a selfie, recording your voice, or writing in your journal.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {[...selfieEntries, ...voiceEntries, ...journalEntries]
                          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                          .slice(0, 10)
                          .map((entry, index) => {
                            const entryType = 'bioAge' in entry ? 'selfie' : 'transcription' in entry ? 'voice' : 'journal'
                            const entryIcon = entryType === 'selfie' ? <Dna className="h-5 w-5" /> : 
                                            entryType === 'voice' ? <Mic className="h-5 w-5" /> : 
                                            <PenLine className="h-5 w-5" />
                            
                            let entryContent = ''
                            if (entryType === 'selfie') {
                              const typedEntry = entry as (typeof selfieEntries)[0]
                              entryContent = `Biological age: ${typedEntry.bioAge} years`
                            } else if (entryType === 'voice') {
                              const typedEntry = entry as (typeof voiceEntries)[0]
                              entryContent = `Stress: ${typedEntry.stressLevel}%, Fatigue: ${typedEntry.fatigueLevel}%`
                            } else {
                              const typedEntry = entry as (typeof journalEntries)[0]
                              entryContent = `Mood: ${typedEntry.emotionalState}`
                            }
                            
                            return (
                              <div key={index} className="flex">
                                <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                  {entryIcon}
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm font-medium leading-none">
                                    {entryType === 'selfie' ? 'Biological Age Analysis' : 
                                     entryType === 'voice' ? 'Voice Analysis' : 
                                     'Journal Entry'}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {entryContent}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatDate(entry.createdAt)}
                                  </p>
                                </div>
                              </div>
                            )
                          })}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-8">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Journal History</CardTitle>
                  <CardDescription>
                    Your emotional journey through journal entries
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    {journalEntries.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <PenLine className="h-12 w-12 text-muted-foreground/30 mb-4" />
                        <p className="text-muted-foreground">No journal entries yet</p>
                        <Button variant="link" asChild>
                          <a href="/journal">Write your first entry</a>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {journalEntries.map((entry, index) => (
                          <div key={index} className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full mr-2 ${getEmotionColor(entry.emotionalState)}`} />
                                <h3 className="font-medium capitalize">{entry.emotionalState}</h3>
                              </div>
                              <p className="text-xs text-muted-foreground">{formatDate(entry.createdAt)}</p>
                            </div>
                            <div className="pl-5 border-l-2 border-muted">
                              <p className="text-sm">{entry.text}</p>
                            </div>
                            <div className="bg-muted/30 p-4 rounded-md">
                              <p className="text-sm italic">{entry.reflection}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="recommendations" className="space-y-8">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="space-y-1">
                    <CardTitle>Wellness Recommendations</CardTitle>
                    <CardDescription>
                      Personalized suggestions based on your data
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={generateAdvice}
                    disabled={isGeneratingAdvice}
                  >
                    {isGeneratingAdvice ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating
                      </>
                    ) : (
                      "Refresh Advice"
                    )}
                  </Button>
                </CardHeader>
                <CardContent>
                  {wellnessAdvice.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[300px] text-center">
                      <Heart className="h-12 w-12 text-muted-foreground/30 mb-4" />
                      <p className="text-muted-foreground">No recommendations yet</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Complete at least one activity to receive personalized wellness advice
                      </p>
                      {hasData && (
                        <Button onClick={generateAdvice} disabled={isGeneratingAdvice}>
                          {isGeneratingAdvice ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Generating Advice
                            </>
                          ) : (
                            "Generate Advice"
                          )}
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {wellnessAdvice.map((advice, index) => (
                        <div key={index} className="flex items-start space-x-4">
                          <div className="mt-0.5">
                            <Button
                              variant="outline"
                              size="icon"
                              className={`h-6 w-6 rounded-full ${advice.completed ? 'bg-accent text-accent-foreground' : ''}`}
                              onClick={() => toggleWellnessAdviceCompleted(advice.id)}
                            >
                              {advice.completed ? (
                                <Check className="h-3 w-3" />
                              ) : (
                                <span className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              {getCategoryIcon(advice.category)}
                              <p className="text-sm font-medium capitalize">{advice.category}</p>
                            </div>
                            <p className="text-sm">{advice.text}</p>
                            <p className="text-xs text-muted-foreground">
                              Added {formatDate(advice.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="trends" className="space-y-8">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader>
                    <CardTitle>Stress & Fatigue Trends</CardTitle>
                    <CardDescription>
                      Track changes in your stress and fatigue levels over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {voiceEntries.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={prepareStressData()} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="stress" stroke="hsl(var(--destructive))" name="Stress" />
                          <Line type="monotone" dataKey="fatigue" stroke="hsl(var(--warning))" name="Fatigue" />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[300px] text-center">
                        <Activity className="h-12 w-12 text-muted-foreground/30 mb-4" />
                        <p className="text-muted-foreground">No voice data yet</p>
                        <Button variant="link" asChild>
                          <a href="/voice">Record your voice</a>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={fadeIn}>
                <Card>
                  <CardHeader>
                    <CardTitle>Biological Age Analysis</CardTitle>
                    <CardDescription>
                      Compare your biological age to your chronological age
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-center justify-center">
                      <p className="text-muted-foreground">Biological age visualization will appear here</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={fadeIn} className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Emotional Distribution</CardTitle>
                    <CardDescription>
                      Breakdown of your emotional states from journal entries
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {journalEntries.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={prepareEmotionData()} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="emotion" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="hsl(var(--chart-1))" name="Frequency" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[300px] text-center">
                        <PenLine className="h-12 w-12 text-muted-foreground/30 mb-4" />
                        <p className="text-muted-foreground">No journal entries yet</p>
                        <Button variant="link" asChild>
                          <a href="/journal">Write your first entry</a>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}