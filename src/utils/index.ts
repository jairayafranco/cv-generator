export const socialNetworks = [
    { name: "website", label: "Website" },
    { name: "linkedin", label: "LinkedIn" },
    { name: "github", label: "GitHub" },
    { name: "twitter", label: "X (Formerly Twitter)" },
    { name: "email", label: "Email" },
    { name: "phone", label: "Phone" },
];

export const splitByComma = (str: string) => str.split(",").map((item) => item.trim());

export const getFormData = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    return data;
}
