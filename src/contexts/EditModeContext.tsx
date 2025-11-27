import { createContext, useContext, ReactNode } from 'react';
import type { Experience, Education, Projects } from '../types/CvStore';

interface EditModeContextType {
  startEditExperience: (id: string, data: Experience) => void;
  startEditEducation: (id: string, data: Education) => void;
  startEditProjects: (id: string, data: Projects) => void;
}

const EditModeContext = createContext<EditModeContextType | undefined>(undefined);

export function useEditModeContext() {
  const context = useContext(EditModeContext);
  if (!context) {
    throw new Error('useEditModeContext must be used within EditModeProvider');
  }
  return context;
}

interface EditModeProviderProps {
  children: ReactNode;
  value: EditModeContextType;
}

export function EditModeProvider({ children, value }: EditModeProviderProps) {
  return (
    <EditModeContext.Provider value={value}>
      {children}
    </EditModeContext.Provider>
  );
}
