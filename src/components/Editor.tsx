import { useCvStore } from "../store/useCvStore";
import type { Contact, Education, Experience, Projects } from "../types/CvStore";
import { useState } from "react";
import { getFormData, socialNetworks, splitByComma } from "../utils";
import { useFormValidation, type ValidationSchema } from "../hooks/useFormValidation";
import { validateEmail, validateUrl, validateDateRange, validateImage } from "../utils/validation";

export default function Editor() {
    const { name, role, bio, contact, setBasic, setContact, setArrData } = useCvStore();
    const [currently, setCurrently] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);

    // Validation schemas for each form section
    const basicInfoSchema: ValidationSchema = {
        name: { required: true, minLength: 2 },
        role: { required: true, minLength: 2 },
    };

    const contactSchema: ValidationSchema = {
        email: { 
            required: true, 
            custom: (value) => validateEmail(value as string) 
        },
        website: { 
            custom: (value) => value ? validateUrl(value as string) : null 
        },
        linkedin: { 
            custom: (value) => value ? validateUrl(value as string) : null 
        },
        github: { 
            custom: (value) => value ? validateUrl(value as string) : null 
        },
        twitter: { 
            custom: (value) => value ? validateUrl(value as string) : null 
        },
    };

    const experienceSchema: ValidationSchema = {
        title: { required: true },
        company: { required: true },
        location: { required: true },
        startDate: { required: true },
        endDate: { 
            custom: (value, data?: Record<string, unknown>) => {
                if (currently) return null; // Skip validation if currently working
                if (!value) return 'End date is required';
                const formData = data as Record<string, string>;
                return validateDateRange(formData?.startDate || '', value as string);
            }
        },
    };

    const educationSchema: ValidationSchema = {
        title: { required: true },
        school: { required: true },
        location: { required: true },
        startDate: { required: true },
        endDate: { 
            required: true,
            custom: (value, data?: Record<string, unknown>) => {
                const formData = data as Record<string, string>;
                return validateDateRange(formData?.startDate || '', value as string);
            }
        },
    };

    const projectsSchema: ValidationSchema = {
        name: { required: true },
        url: { 
            required: true,
            custom: (value) => validateUrl(value as string) 
        },
    };

    const skillsSchema: ValidationSchema = {
        skills: { required: true, minLength: 2 },
    };

    const certificationsSchema: ValidationSchema = {
        certifications: { required: true, minLength: 2 },
    };

    const languagesSchema: ValidationSchema = {
        languages: { required: true, minLength: 2 },
    };

    // Validation hooks for each form
    const basicInfoValidation = useFormValidation(basicInfoSchema);
    const contactValidation = useFormValidation(contactSchema);
    const experienceValidation = useFormValidation(experienceSchema);
    const educationValidation = useFormValidation(educationSchema);
    const projectsValidation = useFormValidation(projectsSchema);
    const skillsValidation = useFormValidation(skillsSchema);
    const certificationsValidation = useFormValidation(certificationsSchema);
    const languagesValidation = useFormValidation(languagesSchema);

    return (
        <div className="flex-1 p-4 mb-5 overflow-auto">

            <section className="mt-4">
                <h1 className="text-3xl font-bold">Basic Info</h1>

                <div className="form-control w-full max-w-sm mt-4">
                    <label className="label">
                        <span className="label-text">Profile Image</span>
                    </label>
                    <input
                        type="file"
                        className={`file-input file-input-bordered file-input-primary file-input-sm w-full ${imageFile && validateImage(imageFile) ? 'file-input-error' : ''}`}
                        onChange={(e) => {
                            const file = e.currentTarget.files?.[0];
                            if (!file) {
                                setImageFile(null);
                                return;
                            }
                            
                            setImageFile(file);
                            const validationError = validateImage(file);
                            
                            if (validationError) {
                                // Don't process invalid images
                                return;
                            }
                            
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                setBasic("img", reader.result as string);
                            };
                            reader.readAsDataURL(file);
                        }}
                    />
                    {imageFile && validateImage(imageFile) && (
                        <label className="label">
                            <span className="label-text-alt text-error">{validateImage(imageFile)}</span>
                        </label>
                    )}
                </div>

                <div className="flex gap-4 mt-2">
                    <div className="form-control w-full max-w-sm">
                        <label className="label">
                            <span className="label-text">Name <span className="text-error">*</span></span>
                        </label>
                        <input
                            type="text"
                            placeholder="Your name"
                            className={`input input-bordered w-full ${basicInfoValidation.errors.name ? 'input-error' : ''}`}
                            value={name}
                            onChange={(e) => {
                                setBasic("name", e.currentTarget.value);
                                basicInfoValidation.validate("name", e.currentTarget.value);
                            }}
                            onBlur={(e) => basicInfoValidation.validate("name", e.currentTarget.value)}
                        />
                        {basicInfoValidation.errors.name && (
                            <label className="label">
                                <span className="label-text-alt text-error">{basicInfoValidation.errors.name}</span>
                            </label>
                        )}
                    </div>
                    <div className="form-control w-full max-w-sm">
                        <label className="label">
                            <span className="label-text">Role <span className="text-error">*</span></span>
                        </label>
                        <input
                            type="text"
                            placeholder="Your role"
                            className={`input input-bordered w-full ${basicInfoValidation.errors.role ? 'input-error' : ''}`}
                            value={role}
                            onChange={(e) => {
                                setBasic("role", e.currentTarget.value);
                                basicInfoValidation.validate("role", e.currentTarget.value);
                            }}
                            onBlur={(e) => basicInfoValidation.validate("role", e.currentTarget.value)}
                        />
                        {basicInfoValidation.errors.role && (
                            <label className="label">
                                <span className="label-text-alt text-error">{basicInfoValidation.errors.role}</span>
                            </label>
                        )}
                    </div>
                </div>
                <div className="form-control w-full mt-2">
                    <label className="label">
                        <span className="label-text">Bio</span>
                    </label>
                    <textarea
                        className="textarea textarea-bordered w-full"
                        placeholder="Your bio"
                        value={bio}
                        onChange={(e) => setBasic("bio", e.currentTarget.value)}
                    />
                </div>
            </section>

            <div className="divider"></div>

            <section>
                <h1 className="text-3xl font-bold mt-4">Social Networks</h1>
                <div className="grid grid-cols-3 gap-4 mt-4">
                    {socialNetworks.map((socialNetwork) => {
                        const fieldName = socialNetwork.name as keyof Contact;
                        const isRequired = fieldName === 'email';
                        return (
                            <div key={socialNetwork.name} className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">
                                        {socialNetwork.label} {isRequired && <span className="text-error">*</span>}
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    placeholder={socialNetwork.label}
                                    className={`input input-bordered w-full ${contactValidation.errors[fieldName] ? 'input-error' : ''}`}
                                    value={contact[fieldName]}
                                    onChange={(e) => {
                                        setContact(fieldName, e.currentTarget.value);
                                        contactValidation.validate(fieldName, e.currentTarget.value);
                                    }}
                                    onBlur={(e) => contactValidation.validate(fieldName, e.currentTarget.value)}
                                />
                                {contactValidation.errors[fieldName] && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{contactValidation.errors[fieldName]}</span>
                                    </label>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            <div className="divider"></div>

            <section className="mt-4">
                <h1 className="text-3xl font-bold">Experience</h1>

                <form onSubmit={(e) => {
                    e.preventDefault();
                    const data = getFormData(e);

                    if (data.currently) {
                        data.endDate = "Currently";
                    }

                    // Validate all fields
                    const isValid = experienceValidation.validateAll(data);
                    if (!isValid) {
                        return; // Prevent submission if validation fails
                    }

                    setArrData("experience", data as Experience);
                    e.currentTarget.reset();
                    experienceValidation.clearAllErrors();
                    setCurrently(false);
                }}>
                    <div className="flex gap-4 mt-4">
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">Title <span className="text-error">*</span></span>
                            </label>
                            <input
                                name="title"
                                type="text"
                                placeholder="Your title"
                                className={`input input-bordered w-full ${experienceValidation.errors.title ? 'input-error' : ''}`}
                                onChange={(e) => experienceValidation.validate("title", e.currentTarget.value)}
                            />
                            {experienceValidation.errors.title && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{experienceValidation.errors.title}</span>
                                </label>
                            )}
                        </div>
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">Company <span className="text-error">*</span></span>
                            </label>
                            <input
                                name="company"
                                type="text"
                                placeholder="Company"
                                className={`input input-bordered w-full ${experienceValidation.errors.company ? 'input-error' : ''}`}
                                onChange={(e) => experienceValidation.validate("company", e.currentTarget.value)}
                            />
                            {experienceValidation.errors.company && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{experienceValidation.errors.company}</span>
                                </label>
                            )}
                        </div>
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">Location <span className="text-error">*</span></span>
                            </label>
                            <input
                                name="location"
                                type="text"
                                placeholder="Location"
                                className={`input input-bordered w-full ${experienceValidation.errors.location ? 'input-error' : ''}`}
                                onChange={(e) => experienceValidation.validate("location", e.currentTarget.value)}
                            />
                            {experienceValidation.errors.location && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{experienceValidation.errors.location}</span>
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4 items-start">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Start Date <span className="text-error">*</span></span>
                            </label>
                            <input
                                name="startDate"
                                type="date"
                                placeholder="Start Date"
                                className={`input input-bordered w-full max-w-xs ${experienceValidation.errors.startDate ? 'input-error' : ''}`}
                                onChange={(e) => experienceValidation.validate("startDate", e.currentTarget.value)}
                            />
                            {experienceValidation.errors.startDate && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{experienceValidation.errors.startDate}</span>
                                </label>
                            )}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">End Date {!currently && <span className="text-error">*</span>}</span>
                            </label>
                            <input
                                name="endDate"
                                disabled={currently}
                                type="date"
                                placeholder="End Date"
                                className={`input input-bordered w-full max-w-xs ${experienceValidation.errors.endDate ? 'input-error' : ''}`}
                                onChange={(e) => experienceValidation.validate("endDate", e.currentTarget.value)}
                            />
                            {experienceValidation.errors.endDate && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{experienceValidation.errors.endDate}</span>
                                </label>
                            )}
                        </div>

                        <div className="form-control mt-9">
                            <label className="label cursor-pointer gap-2">
                                <input
                                    type="checkbox"
                                    name="currently"
                                    className="checkbox checkbox-sm"
                                    checked={currently}
                                    onChange={() => {
                                        setCurrently(!currently);
                                        if (!currently) {
                                            experienceValidation.clearError("endDate");
                                        }
                                    }}
                                />
                                <span className="label-text">Currently</span>
                            </label>
                        </div>
                    </div>

                    <div className="form-control w-full mt-2">
                        <label className="label">
                            <span className="label-text">Description</span>
                        </label>
                        <textarea
                            name="description"
                            className="textarea textarea-bordered w-full"
                            placeholder="Description"
                        />
                    </div>

                    <button className="btn btn-sm btn-primary mt-4">
                        Add Experience
                    </button>
                </form>
            </section>

            <div className="divider"></div>

            <section className="mt-4">
                <h1 className="text-3xl font-bold">Education</h1>

                <form onSubmit={(e) => {
                    e.preventDefault();
                    const data = getFormData(e);
                    
                    // Validate all fields
                    const isValid = educationValidation.validateAll(data);
                    if (!isValid) {
                        return; // Prevent submission if validation fails
                    }

                    setArrData("education", data as Education);
                    e.currentTarget.reset();
                    educationValidation.clearAllErrors();
                }}>

                    <div className="mt-2 flex gap-4">
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">Degree <span className="text-error">*</span></span>
                            </label>
                            <input 
                                name="title" 
                                type="text" 
                                placeholder="Your degree" 
                                className={`input input-bordered w-full ${educationValidation.errors.title ? 'input-error' : ''}`}
                                onChange={(e) => educationValidation.validate("title", e.currentTarget.value)}
                            />
                            {educationValidation.errors.title && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{educationValidation.errors.title}</span>
                                </label>
                            )}
                        </div>
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">School <span className="text-error">*</span></span>
                            </label>
                            <input 
                                name="school" 
                                type="text" 
                                placeholder="School Name" 
                                className={`input input-bordered w-full ${educationValidation.errors.school ? 'input-error' : ''}`}
                                onChange={(e) => educationValidation.validate("school", e.currentTarget.value)}
                            />
                            {educationValidation.errors.school && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{educationValidation.errors.school}</span>
                                </label>
                            )}
                        </div>
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">Location <span className="text-error">*</span></span>
                            </label>
                            <input 
                                name="location" 
                                type="text" 
                                placeholder="Location" 
                                className={`input input-bordered w-full ${educationValidation.errors.location ? 'input-error' : ''}`}
                                onChange={(e) => educationValidation.validate("location", e.currentTarget.value)}
                            />
                            {educationValidation.errors.location && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{educationValidation.errors.location}</span>
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Start Date <span className="text-error">*</span></span>
                            </label>
                            <input 
                                name="startDate" 
                                type="date" 
                                placeholder="Start Date" 
                                className={`input input-bordered w-full max-w-xs ${educationValidation.errors.startDate ? 'input-error' : ''}`}
                                onChange={(e) => educationValidation.validate("startDate", e.currentTarget.value)}
                            />
                            {educationValidation.errors.startDate && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{educationValidation.errors.startDate}</span>
                                </label>
                            )}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">End Date <span className="text-error">*</span></span>
                            </label>
                            <input 
                                name="endDate" 
                                type="date" 
                                placeholder="End Date" 
                                className={`input input-bordered w-full max-w-xs ${educationValidation.errors.endDate ? 'input-error' : ''}`}
                                onChange={(e) => educationValidation.validate("endDate", e.currentTarget.value)}
                            />
                            {educationValidation.errors.endDate && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{educationValidation.errors.endDate}</span>
                                </label>
                            )}
                        </div>
                    </div>

                    <button className="btn btn-sm btn-primary mt-4">
                        Add Education
                    </button>
                </form>
            </section>

            <div className="divider"></div>

            <section className="mt-4">
                <h1 className="text-3xl font-bold">Skills</h1>

                <form onSubmit={(e) => {
                    e.preventDefault();
                    const data = getFormData(e);
                    
                    // Validate all fields
                    const isValid = skillsValidation.validateAll(data);
                    if (!isValid) {
                        return; // Prevent submission if validation fails
                    }

                    const skills = splitByComma(data.skills as string);
                    setArrData("skills", skills);
                    e.currentTarget.reset();
                    skillsValidation.clearAllErrors();
                }}>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Skills <span className="text-error">*</span></span>
                        </label>
                        <textarea
                            name="skills"
                            className={`textarea textarea-bordered w-full ${skillsValidation.errors.skills ? 'textarea-error' : ''}`}
                            placeholder="Separate your skills with a comma ( , )"
                            onChange={(e) => skillsValidation.validate("skills", e.currentTarget.value)}
                        />
                        {skillsValidation.errors.skills && (
                            <label className="label">
                                <span className="label-text-alt text-error">{skillsValidation.errors.skills}</span>
                            </label>
                        )}
                    </div>
                    <button className="btn btn-sm btn-primary mt-4">
                        Add Skills
                    </button>
                </form>
            </section>

            <div className="divider"></div>

            <section className="mt-4">
                <h1 className="text-3xl font-bold">Projects</h1>

                <form onSubmit={(e) => {
                    e.preventDefault();
                    const data = getFormData(e);
                    
                    // Validate all fields
                    const isValid = projectsValidation.validateAll(data);
                    if (!isValid) {
                        return; // Prevent submission if validation fails
                    }

                    setArrData("projects", data as Projects);
                    e.currentTarget.reset();
                    projectsValidation.clearAllErrors();
                }}>
                    <div className="mt-2 flex gap-4">
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">Project Name <span className="text-error">*</span></span>
                            </label>
                            <input 
                                name="name" 
                                type="text" 
                                placeholder="Name" 
                                className={`input input-bordered w-full ${projectsValidation.errors.name ? 'input-error' : ''}`}
                                onChange={(e) => projectsValidation.validate("name", e.currentTarget.value)}
                            />
                            {projectsValidation.errors.name && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{projectsValidation.errors.name}</span>
                                </label>
                            )}
                        </div>
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">Project URL <span className="text-error">*</span></span>
                            </label>
                            <input 
                                name="url" 
                                type="text" 
                                placeholder="URL" 
                                className={`input input-bordered w-full ${projectsValidation.errors.url ? 'input-error' : ''}`}
                                onChange={(e) => projectsValidation.validate("url", e.currentTarget.value)}
                            />
                            {projectsValidation.errors.url && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{projectsValidation.errors.url}</span>
                                </label>
                            )}
                        </div>
                    </div>
                    <button className="btn btn-sm btn-primary mt-4">
                        Add Projects
                    </button>
                </form>
            </section>

            <div className="divider"></div>

            <section className="mt-4">
                <h1 className="text-3xl font-bold">Certifications</h1>

                <form onSubmit={(e) => {
                    e.preventDefault();
                    const data = getFormData(e);
                    
                    // Validate all fields
                    const isValid = certificationsValidation.validateAll(data);
                    if (!isValid) {
                        return; // Prevent submission if validation fails
                    }

                    const certs = splitByComma(data.certifications as string);
                    setArrData("certifications", certs);
                    e.currentTarget.reset();
                    certificationsValidation.clearAllErrors();
                }}>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Certifications <span className="text-error">*</span></span>
                        </label>
                        <textarea
                            name="certifications"
                            className={`textarea textarea-bordered w-full ${certificationsValidation.errors.certifications ? 'textarea-error' : ''}`}
                            placeholder="Separate your certifications with a comma ( , )"
                            onChange={(e) => certificationsValidation.validate("certifications", e.currentTarget.value)}
                        />
                        {certificationsValidation.errors.certifications && (
                            <label className="label">
                                <span className="label-text-alt text-error">{certificationsValidation.errors.certifications}</span>
                            </label>
                        )}
                    </div>
                    <button className="btn btn-sm btn-primary mt-4">
                        Add Certifications
                    </button>
                </form>
            </section>

            <div className="divider"></div>

            <section className="mt-4">
                <h1 className="text-3xl font-bold">Languages</h1>

                <form onSubmit={(e) => {
                    e.preventDefault();
                    const data = getFormData(e);
                    
                    // Validate all fields
                    const isValid = languagesValidation.validateAll(data);
                    if (!isValid) {
                        return; // Prevent submission if validation fails
                    }

                    const langs = splitByComma(data.languages as string);
                    setArrData("languages", langs);
                    e.currentTarget.reset();
                    languagesValidation.clearAllErrors();
                }}>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Languages <span className="text-error">*</span></span>
                        </label>
                        <textarea
                            name="languages"
                            className={`textarea textarea-bordered w-full ${languagesValidation.errors.languages ? 'textarea-error' : ''}`}
                            placeholder="Separate your languages with a comma ( , )"
                            onChange={(e) => languagesValidation.validate("languages", e.currentTarget.value)}
                        />
                        {languagesValidation.errors.languages && (
                            <label className="label">
                                <span className="label-text-alt text-error">{languagesValidation.errors.languages}</span>
                            </label>
                        )}
                    </div>
                    <button className="btn btn-sm btn-primary mt-4">
                        Add Languages
                    </button>
                </form>
            </section>
        </div>
    );
}
