import { create } from "zustand";
import type { Contact, CvStore, setArrDataName, setArrDataValue, setBasicName } from "../types/CvStore";

// Migration helper to add IDs to existing data
const addIdIfMissing = <T extends { id?: string }>(item: T): T & { id: string } => {
    return {
        ...item,
        id: item.id || crypto.randomUUID()
    };
};

export const useCvStore = create<CvStore>((set) => ({
    img: "",
    name: "",
    role: "",
    bio: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    contact: {
        email: "",
        phone: "",
        website: "",
        github: "",
        linkedin: "",
        twitter: "",
    },
    setBasic: (name: setBasicName, value: string) => set({ [name]: value }),
    setContact: (name: keyof Contact, value: string) => set((state) => ({
        contact: { ...state.contact, [name]: value }
    })),
    setArrData: (name: setArrDataName, value: setArrDataValue) => set((state) => {
        if (["skills", "certifications", "languages"].includes(name)) {
            return {
                [name]: state[name].length === 0
                    ? value
                    : [...state[name], value]
            }
        }

        // Add unique ID to Experience, Education, and Projects if not present
        const valueWithId = typeof value === 'object' && !Array.isArray(value)
            ? { ...value, id: value.id || crypto.randomUUID() }
            : value;

        return {
            [name]: [...state[name], valueWithId]
        }
    }),
    migrateData: () => set((state) => ({
        experience: state.experience.map(addIdIfMissing),
        education: state.education.map(addIdIfMissing),
        projects: state.projects.map(addIdIfMissing),
    })),
    updateArrItem: (name: setArrDataName, id: string, value: setArrDataValue) => set((state) => {
        // For simple arrays (skills, certifications, languages), we can't update by ID
        if (["skills", "certifications", "languages"].includes(name)) {
            return state;
        }

        // For object arrays (experience, education, projects), update the item with matching ID
        const currentArray = state[name] as Array<{ id: string }>;
        const updatedArray = currentArray.map(item => 
            item.id === id ? { ...value, id } as unknown : item
        );

        return {
            [name]: updatedArray
        };
    }),
    deleteArrItem: (name: setArrDataName, id: string) => set((state) => {
        // For simple arrays (skills, certifications, languages), treat id as index
        if (["skills", "certifications", "languages"].includes(name)) {
            const currentArray = state[name] as string[];
            const index = parseInt(id, 10);
            if (isNaN(index) || index < 0 || index >= currentArray.length) {
                return state;
            }
            return {
                [name]: currentArray.filter((_, i) => i !== index)
            };
        }

        // For object arrays (experience, education, projects), filter by ID
        const currentArray = state[name] as Array<{ id: string }>;
        return {
            [name]: currentArray.filter(item => item.id !== id)
        };
    }),
    clearAll: () => set({
        img: "",
        name: "",
        role: "",
        bio: "",
        experience: [],
        education: [],
        skills: [],
        projects: [],
        certifications: [],
        languages: [],
        contact: {
            email: "",
            phone: "",
            website: "",
            github: "",
            linkedin: "",
            twitter: "",
        },
    }),
    exportData: () => {
        const state = useCvStore.getState();
        const exportData = {
            img: state.img,
            name: state.name,
            role: state.role,
            bio: state.bio,
            experience: state.experience,
            education: state.education,
            skills: state.skills,
            projects: state.projects,
            certifications: state.certifications,
            languages: state.languages,
            contact: state.contact,
        };
        return JSON.stringify(exportData, null, 2);
    },
    importData: (jsonString: string) => {
        try {
            const data = JSON.parse(jsonString);
            
            // Validate that the data has the expected structure
            if (typeof data !== 'object' || data === null) {
                throw new Error('Invalid data format');
            }

            // Ensure arrays exist and have IDs where needed
            const experience = Array.isArray(data.experience) 
                ? data.experience.map(addIdIfMissing) 
                : [];
            const education = Array.isArray(data.education) 
                ? data.education.map(addIdIfMissing) 
                : [];
            const projects = Array.isArray(data.projects) 
                ? data.projects.map(addIdIfMissing) 
                : [];
            const skills = Array.isArray(data.skills) ? data.skills : [];
            const certifications = Array.isArray(data.certifications) ? data.certifications : [];
            const languages = Array.isArray(data.languages) ? data.languages : [];

            set({
                img: data.img || "",
                name: data.name || "",
                role: data.role || "",
                bio: data.bio || "",
                experience,
                education,
                skills,
                projects,
                certifications,
                languages,
                contact: {
                    email: data.contact?.email || "",
                    phone: data.contact?.phone || "",
                    website: data.contact?.website || "",
                    github: data.contact?.github || "",
                    linkedin: data.contact?.linkedin || "",
                    twitter: data.contact?.twitter || "",
                },
            });
        } catch (error) {
            console.error('Failed to import data:', error);
            throw error;
        }
    },
}));