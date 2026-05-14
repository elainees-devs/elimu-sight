import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SchoolState {
  schoolId: string | null
  schoolName: string | null
  setSchool: (schoolId: string, schoolName: string) => void
  clearSchool: () => void
}

export const useSchoolStore = create<SchoolState>()(
  persist(
    (set) => ({
      schoolId: null,
      schoolName: null,
      setSchool: (schoolId, schoolName) => set({ schoolId, schoolName }),
      clearSchool: () => set({ schoolId: null, schoolName: null }),
    }),
    {
      name: 'elimu-school',
      partialize: (state) => ({
        schoolId: state.schoolId,
        schoolName: state.schoolName,
      }),
    },
  ),
)
