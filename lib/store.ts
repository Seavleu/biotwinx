import { create } from "zustand";
import { persist } from "zustand/middleware";
import { format } from "date-fns";

export type EmotionalState = 'happy' | 'sad' | 'anxious' | 'calm' | 'stressed' | 'energetic' | 'tired' | 'neutral';
export type WellnessCategory = 'nutrition' | 'exercise' | 'sleep' | 'mental' | 'social';

export interface JournalEntry {
    // have id, text, emotionalState, createdAt, reflection
    id: string;
    text: string;
    emotionalState: EmotionalState;
    createdAt: string;
    reflection: string;
}

// VoiceEntry have id, audioUrl, stressLevel, fatigueLevel, createdAt, notes
export interface VoiceEntry {
  id: string;
  audioUrl?: string;
  transcription?: string;
  stressLevel: number;
  fatigueLevel: number;
  createdAt: string;
  notes: string;
}

// SelfieEntry have id, image, bioAge, chronologicalAge, features, createdAt
export interface SelfieEntry {
    id: string;
    imageUrl?: string;
    bioAge: number;
    chronologicalAge: number;
    createdAt: string;
    notes: string;
}

// WellnessAdvice id, textm category(nutrition ir excercise or sleep or mental or social) createdAt completed
export interface WellnessAdvice {
    id: string;
    text: string;
    category: WellnessCategory;
    createdAt: string;
    completed: boolean;
}

export interface BioTwinXState {
    // User profile
    userProfile: {
      name: string;
      birthdate: string | null;
      gender: string;
      height: number | null;
      weight: number | null;
    };
    
    // Journal entries
    journalEntries: JournalEntry[];
    
    // Voice analysis entries
    voiceEntries: VoiceEntry[];
    
    // Selfie/bio-age entries
    selfieEntries: SelfieEntry[];
    
    // Wellness advice
    wellnessAdvice: WellnessAdvice[];
    
    // Actions
    updateUserProfile: (profile: Partial<BioTwinXState['userProfile']>) => void;
    addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => void;
    addVoiceEntry: (entry: Omit<VoiceEntry, 'id' | 'createdAt'>) => void;
    addSelfieEntry: (entry: Omit<SelfieEntry, 'id' | 'createdAt'>) => void;
    addWellnessAdvice: (advice: Omit<WellnessAdvice, 'id' | 'createdAt' | 'completed'>) => void;
    toggleWellnessAdviceCompleted: (id: string) => void;
    clearAllData: () => void;
  }



  export const useBioTwinXStore = create<BioTwinXState>()(
    persist(
      (set) => ({
        // Initial state
        userProfile: {
          name: '',
          birthdate: null,
          gender: '',
          height: null,
          weight: null,
        },
        journalEntries: [],
        voiceEntries: [],
        selfieEntries: [],
        wellnessAdvice: [],
        
        // Actions
        updateUserProfile: (profile) => 
          set((state) => ({
            userProfile: { ...state.userProfile, ...profile },
          })),
          
        addJournalEntry: (entry) => 
          set((state) => ({
            journalEntries: [
              {
                id: crypto.randomUUID(),
                createdAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                ...entry,
              },
              ...state.journalEntries,
            ],
          })),
          
        addVoiceEntry: (entry) => 
          set((state) => ({
            voiceEntries: [
              {
                id: crypto.randomUUID(),
                createdAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                ...entry,
              },
              ...state.voiceEntries,
            ],
          })),
          
        addSelfieEntry: (entry) => 
          set((state) => ({
            selfieEntries: [
              {
                id: crypto.randomUUID(),
                createdAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                ...entry,
              },
              ...state.selfieEntries,
            ],
          })),
          
        addWellnessAdvice: (advice) => 
          set((state) => ({
            wellnessAdvice: [
              {
                id: crypto.randomUUID(),
                createdAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                completed: false,
                ...advice,
              },
              ...state.wellnessAdvice,
            ],
          })),
          
        toggleWellnessAdviceCompleted: (id) => 
          set((state) => ({
            wellnessAdvice: state.wellnessAdvice.map((item) =>
              item.id === id ? { ...item, completed: !item.completed } : item
            ),
          })),
          
        clearAllData: () => 
          set({
            journalEntries: [],
            voiceEntries: [],
            selfieEntries: [],
            wellnessAdvice: [],
          }),
      }),
      {
        name: 'biotwinx-storage',
      }
    )
  );