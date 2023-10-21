import { create } from "zustand";
import type { Contact, CvStore, setArrDataName, setArrDataValue, setBasicName } from "../types/CvStore";

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

        return {
            [name]: [...state[name], value]
        }
    }),
}));