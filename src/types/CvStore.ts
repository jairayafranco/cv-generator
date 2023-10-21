type BasicData = {
    img: string,
    name: string,
    role: string,
    bio: string,
}

type ArrData = {
    experience: Experience[],
    education: Education[],
    skills: string[],
    projects: Projects[],
    certifications: string[],
    languages: string[],
}

export type Experience = {
    title: string,
    company: string,
    location: string,
    startDate: string,
    endDate: string,
    description: string,
};

export type Education = {
    title: string,
    school: string,
    location: string,
    startDate: string,
    endDate: string,
}

export type Projects = {
    name: string,
    url: string,
}

export type Contact = {
    email: string,
    phone: string,
    website: string,
    github: string,
    linkedin: string,
    twitter: string,
}

export type CvStore = BasicData & ArrData & {
    contact: Contact,
    setBasic: (name: setBasicName, value: string) => void,
    setContact: (name: keyof Contact, value: string) => void,
    setArrData: (name: setArrDataName, value: setArrDataValue) => void,
};

export type setBasicName = keyof BasicData;
export type setArrDataName = keyof ArrData;
export type setArrDataValue = Experience | Education | string[] | Projects;
