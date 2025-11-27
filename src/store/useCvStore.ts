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
}));