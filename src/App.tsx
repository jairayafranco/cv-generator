import Preview from "./components/Preview";
import Editor from "./components/Editor";
import { EditModeProvider } from "./contexts/EditModeContext";
import { useEditMode } from "./hooks/useEditMode";
import type { Experience, Education, Projects } from "./types/CvStore";

export default function App() {
  // Create edit mode hooks at the App level
  const experienceEditMode = useEditMode<Experience>('experience');
  const educationEditMode = useEditMode<Education>('education');
  const projectsEditMode = useEditMode<Projects>('projects');

  return (
    <EditModeProvider
      value={{
        startEditExperience: experienceEditMode.startEdit,
        startEditEducation: educationEditMode.startEdit,
        startEditProjects: projectsEditMode.startEdit,
      }}
    >
      <div className="md:flex h-screen">
        <Editor 
          experienceEditMode={experienceEditMode}
          educationEditMode={educationEditMode}
          projectsEditMode={projectsEditMode}
        />
        <Preview />
      </div>
    </EditModeProvider>
  );
}
