"use client"

import {useEffect, useState} from 'react'
import {motion} from 'framer-motion'
import {GradientBackground} from '@/components/ui/gradient-background'
import {Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter} from '@/components/ui/card'
import {Tabs, TabsList, TabsTrigger, TabsContent} from '@/components/ui/tabs'
import {Button} from '@/components/ui/button'
import {useBioTwinXStore} from '@/lib/store'
import {generateWellnessAdvice} from '@/lib/ai-utils'
import Link from 'next/link' 

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
                <motion.div>

                </motion.div>
                {/* TODO: Overview Tabs */}
                <TabsContent value="overview" className='space-y-8'>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    >
                        
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
