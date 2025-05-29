"use client"

import {useEffect, useState} from 'react'
import {motion} from 'framer-motion'
import {GradientBackground} from '@/components/ui/gradient-background'
import {Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter} from '@/components/ui/card'
import {Tabs, TabsList, TabsTrigger, TabsContent} from '@/components/ui/tabs'
import { ScrollArea } from "@/components/ui/scroll-area"
import {Button} from '@/components/ui/button'
import {useBioTwinXStore} from '@/lib/store'
import {generateWellnessAdvice} from '@/lib/ai-utils'
import Link from 'next/link' 
import { Activity, Dna, Mic, PenLine } from 'lucide-react'
import { format, parseISO } from 'date-fns'

export default function InsightsPage() {
    const [activeTab, setActiveTab] =useState("overview")
    const [isGeneratingAdvice, setIsGeneratingAdvice] = useState(false)

    const {
        journalEntries,
        voiceEntries,
        selfieEntries,
        wellnessAdvice,
        toggleWellnessAdviceCompleted
    } = useBioTwinXStore()

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

    const formatDate = (dateString: string) => {
        try {
            return format(parseISO(dateString), 'MMM d, yyyy');
          } catch (error) {
            return dateString;
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
        return emotionColors[emotion] || "bg-gray-500";
    }
    
    const hasData = selfieEntries.length > 0 || voiceEntries.length > 0 || journalEntries.length > 0
    

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
                    <div className="h-8 w-8 text-accent mr-2" />
                    <h1 className="text-3xl font-bold">Wellness Insights</h1>
                </div>
                <p className="text-muted-foreground text-lg">
                    Track your progress and discover patterns in your physical and emotional health.
                </p>
            </motion.div>

            <Tabs
             defaultValue='overview'
             value={activeTab}
             onValueChange={setActiveTab}
             className='mx-w-6xl mx-auto'
            >
                <motion.div
                 initial="hidden"
                 animate="visible"
                 variants={fadeIn}
                 className='mb-8 flex justify-center'
                >
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="history">History</TabsTrigger>
                        <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                        <TabsTrigger value="trends">Trends</TabsTrigger>
                    </TabsList>
                </motion.div>

                {/* TODO: Overview Tabs */}
                <TabsContent value="overview" className='space-y-8'>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    >
                        <motion.div 
                            variants={fadeIn} 
                        >
                            <Card>
                                <CardHeader className='pb-2'>
                                    <CardTitle className='flex items-center gap-2 text-sm font-medium'>
                                        <Dna className="h-4 w-4 text-accent mr-2"/>
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
                    </motion.div>

                    {/* Record stress level */}
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

                    {/* Mood  */}
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

                    {/* Recent journal entries */}
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
                                            const entryType = 'bioAge' in entry ? 'selfie' : 'transcription' in entry ? 'voice' : 'journal';
                                            const entryIcon = entryType === 'selfie' ? <Dna className="h-5 w-5" /> : 
                                                            entryType === 'voice' ? <Mic className="h-5 w-5" /> : 
                                                            <PenLine className="h-5 w-5" />;
                                            
                                            let entryContent = '';
                                            if (entryType === 'selfie') {
                                            const typedEntry = entry as (typeof selfieEntries)[0];
                                            entryContent = `Biological age: ${typedEntry.bioAge} years`;
                                            } else if (entryType === 'voice') {
                                            const typedEntry = entry as (typeof voiceEntries)[0];
                                            entryContent = `Stress: ${typedEntry.stressLevel}%, Fatigue: ${typedEntry.fatigueLevel}%`;
                                            } else {
                                            const typedEntry = entry as (typeof journalEntries)[0];
                                            entryContent = `Mood: ${typedEntry.emotionalState}`;
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
                                            );
                                        })}
                                    </div>
                                    )} 
                                </ScrollArea>
                            </CardContent>
                        </Card>
                        </motion.div>
                </TabsContent>

                {/* TODO: user history */}
                <TabsContent value="history" className='space-y-8'>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    >
                        
                    </motion.div>
                </TabsContent>
                {/* TODO: recommendations */}
                <TabsContent value="recommendations" className='space-y-8'>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    >
                        
                    </motion.div>
                </TabsContent>
                {/* TODO: trends chart*/}
                <TabsContent value="trends" className='space-y-8'>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    >
                        
                    </motion.div>
                </TabsContent>
            </Tabs>
        </div>
    </div>
  )
}
