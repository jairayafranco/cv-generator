import { useCvStore } from "../store/useCvStore";
import type { Contact, Education, Experience, Projects } from "../types/CvStore";
import { useState, useEffect, useRef } from "react";
import { getFormData, socialNetworks, splitByComma } from "../utils";
import { useFormValidation, type ValidationSchema } from "../hooks/useFormValidation";
import { validateEmail, validateUrl, validateDateRange, validateImage } from "../utils/validation";
import { useNotification } from "../hooks/useNotification";
import { NotificationContainer } from "./NotificationContainer";
import ConfirmDialog from "./ConfirmDialog";

interface UseEditModeReturn<T> {
  isEditing: boolean;
  editingId: string | null;
  editData: T | null;
  startEdit: (id: string, data: T) => void;
  cancelEdit: () => void;
  saveEdit: (data: T) => void;
}

interface EditorProps {
    experienceEditMode: UseEditModeReturn<Experience>;
    educationEditMode: UseEditModeReturn<Education>;
    projectsEditMode: UseEditModeReturn<Projects>;
}

export default function Editor({ experienceEditMode, educationEditMode, projectsEditMode }: EditorProps) {
    const { name, role, bio, contact, setBasic, setContact, setArrData, clearAll, exportData, importData } = useCvStore();
    const [currently, setCurrently] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [showClearDialog, setShowClearDialog] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Notification system
    const { notifications, showNotification, dismissNotification } = useNotification();

    // Form refs for resetting
    const experienceFormRef = useRef<HTMLFormElement>(null);
    const educationFormRef = useRef<HTMLFormElement>(null);
    const projectsFormRef = useRef<HTMLFormElement>(null);

    // Populate experience form when editing
    useEffect(() => {
        if (experienceEditMode.isEditing && experienceEditMode.editData && experienceFormRef.current) {
            const form = experienceFormRef.current;
            const data = experienceEditMode.editData;
            
            (form.elements.namedItem('title') as HTMLInputElement).value = data.title;
            (form.elements.namedItem('company') as HTMLInputElement).value = data.company;
            (form.elements.namedItem('location') as HTMLInputElement).value = data.location;
            (form.elements.namedItem('startDate') as HTMLInputElement).value = data.startDate;
            (form.elements.namedItem('description') as HTMLTextAreaElement).value = data.description;
            
            if (data.endDate === 'Currently') {
                setCurrently(true);
                (form.elements.namedItem('endDate') as HTMLInputElement).value = '';
            } else {
                setCurrently(false);
                (form.elements.namedItem('endDate') as HTMLInputElement).value = data.endDate;
            }
        }
    }, [experienceEditMode.isEditing, experienceEditMode.editData]);

    // Populate education form when editing
    useEffect(() => {
        if (educationEditMode.isEditing && educationEditMode.editData && educationFormRef.current) {
            const form = educationFormRef.current;
            const data = educationEditMode.editData;
            
            (form.elements.namedItem('title') as HTMLInputElement).value = data.title;
            (form.elements.namedItem('school') as HTMLInputElement).value = data.school;
            (form.elements.namedItem('location') as HTMLInputElement).value = data.location;
            (form.elements.namedItem('startDate') as HTMLInputElement).value = data.startDate;
            (form.elements.namedItem('endDate') as HTMLInputElement).value = data.endDate;
        }
    }, [educationEditMode.isEditing, educationEditMode.editData]);

    // Populate projects form when editing
    useEffect(() => {
        if (projectsEditMode.isEditing && projectsEditMode.editData && projectsFormRef.current) {
            const form = projectsFormRef.current;
            const data = projectsEditMode.editData;
            
            (form.elements.namedItem('name') as HTMLInputElement).value = data.name;
            (form.elements.namedItem('url') as HTMLInputElement).value = data.url;
        }
    }, [projectsEditMode.isEditing, projectsEditMode.editData]);

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
        <div className="flex-1 p-6 mb-5 overflow-auto bg-gradient-to-b from-base-100 to-base-200 border-r border-base-300/50" data-theme="dark">
            <div className="max-w-4xl mx-auto">
            <section className="mt-4 card-modern">
                <h1 className="text-3xl font-bold font-display gradient-text mb-6">Basic Info</h1>

                <div className="form-control w-full max-w-sm mt-4">
                    <label className="label" htmlFor="profile-image">
                        <span className="label-text">Profile Image</span>
                    </label>
                    <input
                        id="profile-image"
                        type="file"
                        className={`file-input file-input-bordered file-input-primary file-input-sm w-full ${imageFile && validateImage(imageFile) ? 'file-input-error' : ''}`}
                        aria-describedby={imageFile && validateImage(imageFile) ? "profile-image-error" : undefined}
                        aria-invalid={imageFile && validateImage(imageFile) ? "true" : "false"}
                        onChange={(e) => {
                            try {
                                const file = e.currentTarget.files?.[0];
                                if (!file) {
                                    setImageFile(null);
                                    return;
                                }
                                
                                setImageFile(file);
                                const validationError = validateImage(file);
                                
                                if (validationError) {
                                    // Don't process invalid images
                                    showNotification('error', validationError);
                                    return;
                                }
                                
                                const reader = new FileReader();
                                
                                reader.onloadend = () => {
                                    try {
                                        const result = reader.result as string;
                                        if (!result) {
                                            throw new Error('Failed to read image file');
                                        }
                                        setBasic("img", result);
                                        showNotification('success', 'Image uploaded successfully!');
                                    } catch (error) {
                                        console.error('Image processing error:', error);
                                        showNotification('error', 'Failed to process image. Please try again.');
                                        setImageFile(null);
                                    }
                                };
                                
                                reader.onerror = () => {
                                    console.error('FileReader error:', reader.error);
                                    showNotification('error', 'Failed to read image file. Please try again.');
                                    setImageFile(null);
                                };
                                
                                reader.readAsDataURL(file);
                            } catch (error) {
                                console.error('Image upload error:', error);
                                showNotification('error', 'Failed to upload image. Please try again.');
                                setImageFile(null);
                            }
                        }}
                    />
                    {imageFile && validateImage(imageFile) && (
                        <label className="label">
                            <span id="profile-image-error" className="label-text-alt text-error" role="alert">{validateImage(imageFile)}</span>
                        </label>
                    )}
                </div>

                <div className="flex gap-4 mt-2">
                    <div className="form-control w-full max-w-sm">
                        <label className="label" htmlFor="name-input">
                            <span className="label-text">Name <span className="text-error">*</span></span>
                        </label>
                        <input
                            id="name-input"
                            type="text"
                            placeholder="Your name"
                            className={`input input-bordered input-modern w-full ${basicInfoValidation.errors.name ? 'input-error' : ''}`}
                            value={name}
                            aria-required="true"
                            aria-invalid={basicInfoValidation.errors.name ? "true" : "false"}
                            aria-describedby={basicInfoValidation.errors.name ? "name-error" : undefined}
                            onChange={(e) => {
                                setBasic("name", e.currentTarget.value);
                                basicInfoValidation.validate("name", e.currentTarget.value);
                            }}
                            onBlur={(e) => basicInfoValidation.validate("name", e.currentTarget.value)}
                        />
                        {basicInfoValidation.errors.name && (
                            <label className="label">
                                <span id="name-error" className="label-text-alt text-error" role="alert">{basicInfoValidation.errors.name}</span>
                            </label>
                        )}
                    </div>
                    <div className="form-control w-full max-w-sm">
                        <label className="label" htmlFor="role-input">
                            <span className="label-text">Role <span className="text-error">*</span></span>
                        </label>
                        <input
                            id="role-input"
                            type="text"
                            placeholder="Your role"
                            className={`input input-bordered input-modern w-full ${basicInfoValidation.errors.role ? 'input-error' : ''}`}
                            value={role}
                            aria-required="true"
                            aria-invalid={basicInfoValidation.errors.role ? "true" : "false"}
                            aria-describedby={basicInfoValidation.errors.role ? "role-error" : undefined}
                            onChange={(e) => {
                                setBasic("role", e.currentTarget.value);
                                basicInfoValidation.validate("role", e.currentTarget.value);
                            }}
                            onBlur={(e) => basicInfoValidation.validate("role", e.currentTarget.value)}
                        />
                        {basicInfoValidation.errors.role && (
                            <label className="label">
                                <span id="role-error" className="label-text-alt text-error" role="alert">{basicInfoValidation.errors.role}</span>
                            </label>
                        )}
                    </div>
                </div>
                <div className="form-control w-full mt-2">
                    <label className="label" htmlFor="bio-input">
                        <span className="label-text">Bio</span>
                    </label>
                    <textarea
                        id="bio-input"
                        className="textarea textarea-bordered input-modern w-full"
                        placeholder="Your bio"
                        value={bio}
                        onChange={(e) => setBasic("bio", e.currentTarget.value)}
                    />
                </div>
            </section>

            <div className="divider-modern"></div>

            <section className="card-modern">
                <h1 className="text-3xl font-bold font-display gradient-text mb-6">Social Networks</h1>
                <div className="grid grid-cols-3 gap-4 mt-4">
                    {socialNetworks.map((socialNetwork) => {
                        const fieldName = socialNetwork.name as keyof Contact;
                        const isRequired = fieldName === 'email';
                        const inputId = `contact-${fieldName}`;
                        const errorId = `${inputId}-error`;
                        return (
                            <div key={socialNetwork.name} className="form-control w-full">
                                <label className="label" htmlFor={inputId}>
                                    <span className="label-text">
                                        {socialNetwork.label} {isRequired && <span className="text-error">*</span>}
                                    </span>
                                </label>
                                <input
                                    id={inputId}
                                    type="text"
                                    placeholder={socialNetwork.label}
                                    className={`input input-bordered input-modern w-full ${contactValidation.errors[fieldName] ? 'input-error' : ''}`}
                                    value={contact[fieldName]}
                                    aria-required={isRequired ? "true" : "false"}
                                    aria-invalid={contactValidation.errors[fieldName] ? "true" : "false"}
                                    aria-describedby={contactValidation.errors[fieldName] ? errorId : undefined}
                                    onChange={(e) => {
                                        setContact(fieldName, e.currentTarget.value);
                                        contactValidation.validate(fieldName, e.currentTarget.value);
                                    }}
                                    onBlur={(e) => contactValidation.validate(fieldName, e.currentTarget.value)}
                                />
                                {contactValidation.errors[fieldName] && (
                                    <label className="label">
                                        <span id={errorId} className="label-text-alt text-error" role="alert">{contactValidation.errors[fieldName]}</span>
                                    </label>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            <div className="divider-modern"></div>

            <section className="card-modern">
                <h1 className="text-3xl font-bold font-display gradient-text mb-6">Experience</h1>

                <form ref={experienceFormRef} onSubmit={(e) => {
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

                    if (experienceEditMode.isEditing) {
                        // Update existing item
                        experienceEditMode.saveEdit(data as Experience);
                    } else {
                        // Add new item
                        setArrData("experience", data as Experience);
                    }
                    
                    e.currentTarget.reset();
                    experienceValidation.clearAllErrors();
                    setCurrently(false);
                }}>
                    <div className="flex gap-4 mt-4">
                        <div className="form-control w-full max-w-xs">
                            <label className="label" htmlFor="exp-title">
                                <span className="label-text">Title <span className="text-error">*</span></span>
                            </label>
                            <input
                                id="exp-title"
                                name="title"
                                type="text"
                                placeholder="Your title"
                                className={`input input-bordered input-modern w-full ${experienceValidation.errors.title ? 'input-error' : ''}`}
                                aria-required="true"
                                aria-invalid={experienceValidation.errors.title ? "true" : "false"}
                                aria-describedby={experienceValidation.errors.title ? "exp-title-error" : undefined}
                                onChange={(e) => experienceValidation.validate("title", e.currentTarget.value)}
                            />
                            {experienceValidation.errors.title && (
                                <label className="label">
                                    <span id="exp-title-error" className="label-text-alt text-error" role="alert">{experienceValidation.errors.title}</span>
                                </label>
                            )}
                        </div>
                        <div className="form-control w-full max-w-xs">
                            <label className="label" htmlFor="exp-company">
                                <span className="label-text">Company <span className="text-error">*</span></span>
                            </label>
                            <input
                                id="exp-company"
                                name="company"
                                type="text"
                                placeholder="Company"
                                className={`input input-bordered w-full ${experienceValidation.errors.company ? 'input-error' : ''}`}
                                aria-required="true"
                                aria-invalid={experienceValidation.errors.company ? "true" : "false"}
                                aria-describedby={experienceValidation.errors.company ? "exp-company-error" : undefined}
                                onChange={(e) => experienceValidation.validate("company", e.currentTarget.value)}
                            />
                            {experienceValidation.errors.company && (
                                <label className="label">
                                    <span id="exp-company-error" className="label-text-alt text-error" role="alert">{experienceValidation.errors.company}</span>
                                </label>
                            )}
                        </div>
                        <div className="form-control w-full max-w-xs">
                            <label className="label" htmlFor="exp-location">
                                <span className="label-text">Location <span className="text-error">*</span></span>
                            </label>
                            <input
                                id="exp-location"
                                name="location"
                                type="text"
                                placeholder="Location"
                                className={`input input-bordered w-full ${experienceValidation.errors.location ? 'input-error' : ''}`}
                                aria-required="true"
                                aria-invalid={experienceValidation.errors.location ? "true" : "false"}
                                aria-describedby={experienceValidation.errors.location ? "exp-location-error" : undefined}
                                onChange={(e) => experienceValidation.validate("location", e.currentTarget.value)}
                            />
                            {experienceValidation.errors.location && (
                                <label className="label">
                                    <span id="exp-location-error" className="label-text-alt text-error" role="alert">{experienceValidation.errors.location}</span>
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4 items-start">
                        <div className="form-control">
                            <label className="label" htmlFor="exp-startDate">
                                <span className="label-text">Start Date <span className="text-error">*</span></span>
                            </label>
                            <input
                                id="exp-startDate"
                                name="startDate"
                                type="date"
                                placeholder="Start Date"
                                className={`input input-bordered input-modern w-full max-w-xs ${experienceValidation.errors.startDate ? 'input-error' : ''}`}
                                aria-required="true"
                                aria-invalid={experienceValidation.errors.startDate ? "true" : "false"}
                                aria-describedby={experienceValidation.errors.startDate ? "exp-startDate-error" : undefined}
                                onChange={(e) => experienceValidation.validate("startDate", e.currentTarget.value)}
                            />
                            {experienceValidation.errors.startDate && (
                                <label className="label">
                                    <span id="exp-startDate-error" className="label-text-alt text-error" role="alert">{experienceValidation.errors.startDate}</span>
                                </label>
                            )}
                        </div>

                        <div className="form-control">
                            <label className="label" htmlFor="exp-endDate">
                                <span className="label-text">End Date {!currently && <span className="text-error">*</span>}</span>
                            </label>
                            <input
                                id="exp-endDate"
                                name="endDate"
                                disabled={currently}
                                type="date"
                                placeholder="End Date"
                                className={`input input-bordered w-full max-w-xs ${experienceValidation.errors.endDate ? 'input-error' : ''}`}
                                aria-required={!currently ? "true" : "false"}
                                aria-invalid={experienceValidation.errors.endDate ? "true" : "false"}
                                aria-describedby={experienceValidation.errors.endDate ? "exp-endDate-error" : undefined}
                                onChange={(e) => experienceValidation.validate("endDate", e.currentTarget.value)}
                            />
                            {experienceValidation.errors.endDate && (
                                <label className="label">
                                    <span id="exp-endDate-error" className="label-text-alt text-error" role="alert">{experienceValidation.errors.endDate}</span>
                                </label>
                            )}
                        </div>

                        <div className="form-control mt-9">
                            <label className="label cursor-pointer gap-2" htmlFor="exp-currently">
                                <input
                                    id="exp-currently"
                                    type="checkbox"
                                    name="currently"
                                    className="checkbox checkbox-sm"
                                    checked={currently}
                                    aria-label="Currently working here"
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
                        <label className="label" htmlFor="exp-description">
                            <span className="label-text">Description</span>
                        </label>
                        <textarea
                            id="exp-description"
                            name="description"
                            className="textarea textarea-bordered input-modern w-full"
                            placeholder="Description"
                        />
                    </div>

                    <div className="flex gap-2 mt-4">
                        <button type="submit" className="btn btn-sm btn-primary shadow-soft hover:shadow-medium transition-all duration-200">
                            {experienceEditMode.isEditing ? 'Update Experience' : 'Add Experience'}
                        </button>
                        {experienceEditMode.isEditing && (
                            <button 
                                type="button" 
                                className="btn btn-sm btn-ghost"
                                onClick={() => {
                                    experienceEditMode.cancelEdit();
                                    experienceFormRef.current?.reset();
                                    experienceValidation.clearAllErrors();
                                    setCurrently(false);
                                }}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </section>

            <div className="divider-modern"></div>

            <section className="card-modern">
                <h1 className="text-3xl font-bold font-display gradient-text mb-6">Education</h1>

                <form ref={educationFormRef} onSubmit={(e) => {
                    e.preventDefault();
                    const data = getFormData(e);
                    
                    // Validate all fields
                    const isValid = educationValidation.validateAll(data);
                    if (!isValid) {
                        return; // Prevent submission if validation fails
                    }

                    if (educationEditMode.isEditing) {
                        // Update existing item
                        educationEditMode.saveEdit(data as Education);
                    } else {
                        // Add new item
                        setArrData("education", data as Education);
                    }
                    
                    e.currentTarget.reset();
                    educationValidation.clearAllErrors();
                }}>

                    <div className="mt-2 flex gap-4">
                        <div className="form-control w-full max-w-xs">
                            <label className="label" htmlFor="edu-title">
                                <span className="label-text">Degree <span className="text-error">*</span></span>
                            </label>
                            <input 
                                id="edu-title"
                                name="title" 
                                type="text" 
                                placeholder="Your degree" 
                                className={`input input-bordered input-modern w-full ${educationValidation.errors.title ? 'input-error' : ''}`}
                                aria-required="true"
                                aria-invalid={educationValidation.errors.title ? "true" : "false"}
                                aria-describedby={educationValidation.errors.title ? "edu-title-error" : undefined}
                                onChange={(e) => educationValidation.validate("title", e.currentTarget.value)}
                            />
                            {educationValidation.errors.title && (
                                <label className="label">
                                    <span id="edu-title-error" className="label-text-alt text-error" role="alert">{educationValidation.errors.title}</span>
                                </label>
                            )}
                        </div>
                        <div className="form-control w-full max-w-xs">
                            <label className="label" htmlFor="edu-school">
                                <span className="label-text">School <span className="text-error">*</span></span>
                            </label>
                            <input 
                                id="edu-school"
                                name="school" 
                                type="text" 
                                placeholder="School Name" 
                                className={`input input-bordered w-full ${educationValidation.errors.school ? 'input-error' : ''}`}
                                aria-required="true"
                                aria-invalid={educationValidation.errors.school ? "true" : "false"}
                                aria-describedby={educationValidation.errors.school ? "edu-school-error" : undefined}
                                onChange={(e) => educationValidation.validate("school", e.currentTarget.value)}
                            />
                            {educationValidation.errors.school && (
                                <label className="label">
                                    <span id="edu-school-error" className="label-text-alt text-error" role="alert">{educationValidation.errors.school}</span>
                                </label>
                            )}
                        </div>
                        <div className="form-control w-full max-w-xs">
                            <label className="label" htmlFor="edu-location">
                                <span className="label-text">Location <span className="text-error">*</span></span>
                            </label>
                            <input 
                                id="edu-location"
                                name="location" 
                                type="text" 
                                placeholder="Location" 
                                className={`input input-bordered w-full ${educationValidation.errors.location ? 'input-error' : ''}`}
                                aria-required="true"
                                aria-invalid={educationValidation.errors.location ? "true" : "false"}
                                aria-describedby={educationValidation.errors.location ? "edu-location-error" : undefined}
                                onChange={(e) => educationValidation.validate("location", e.currentTarget.value)}
                            />
                            {educationValidation.errors.location && (
                                <label className="label">
                                    <span id="edu-location-error" className="label-text-alt text-error" role="alert">{educationValidation.errors.location}</span>
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="form-control">
                            <label className="label" htmlFor="edu-startDate">
                                <span className="label-text">Start Date <span className="text-error">*</span></span>
                            </label>
                            <input 
                                id="edu-startDate"
                                name="startDate" 
                                type="date" 
                                placeholder="Start Date" 
                                className={`input input-bordered input-modern w-full max-w-xs ${educationValidation.errors.startDate ? 'input-error' : ''}`}
                                aria-required="true"
                                aria-invalid={educationValidation.errors.startDate ? "true" : "false"}
                                aria-describedby={educationValidation.errors.startDate ? "edu-startDate-error" : undefined}
                                onChange={(e) => educationValidation.validate("startDate", e.currentTarget.value)}
                            />
                            {educationValidation.errors.startDate && (
                                <label className="label">
                                    <span id="edu-startDate-error" className="label-text-alt text-error" role="alert">{educationValidation.errors.startDate}</span>
                                </label>
                            )}
                        </div>

                        <div className="form-control">
                            <label className="label" htmlFor="edu-endDate">
                                <span className="label-text">End Date <span className="text-error">*</span></span>
                            </label>
                            <input 
                                id="edu-endDate"
                                name="endDate" 
                                type="date" 
                                placeholder="End Date" 
                                className={`input input-bordered w-full max-w-xs ${educationValidation.errors.endDate ? 'input-error' : ''}`}
                                aria-required="true"
                                aria-invalid={educationValidation.errors.endDate ? "true" : "false"}
                                aria-describedby={educationValidation.errors.endDate ? "edu-endDate-error" : undefined}
                                onChange={(e) => educationValidation.validate("endDate", e.currentTarget.value)}
                            />
                            {educationValidation.errors.endDate && (
                                <label className="label">
                                    <span id="edu-endDate-error" className="label-text-alt text-error" role="alert">{educationValidation.errors.endDate}</span>
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                        <button type="submit" className="btn btn-sm btn-primary shadow-soft hover:shadow-medium transition-all duration-200">
                            {educationEditMode.isEditing ? 'Update Education' : 'Add Education'}
                        </button>
                        {educationEditMode.isEditing && (
                            <button 
                                type="button" 
                                className="btn btn-sm btn-ghost"
                                onClick={() => {
                                    educationEditMode.cancelEdit();
                                    educationFormRef.current?.reset();
                                    educationValidation.clearAllErrors();
                                }}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </section>

            <div className="divider-modern"></div>

            <section className="card-modern">
                <h1 className="text-3xl font-bold font-display gradient-text mb-6">Skills</h1>

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
                        <label className="label" htmlFor="skills-input">
                            <span className="label-text">Skills <span className="text-error">*</span></span>
                        </label>
                        <textarea
                            id="skills-input"
                            name="skills"
                            className={`textarea textarea-bordered input-modern w-full ${skillsValidation.errors.skills ? 'textarea-error' : ''}`}
                            placeholder="Separate your skills with a comma ( , )"
                            aria-required="true"
                            aria-invalid={skillsValidation.errors.skills ? "true" : "false"}
                            aria-describedby={skillsValidation.errors.skills ? "skills-error" : undefined}
                            onChange={(e) => skillsValidation.validate("skills", e.currentTarget.value)}
                        />
                        {skillsValidation.errors.skills && (
                            <label className="label">
                                <span id="skills-error" className="label-text-alt text-error" role="alert">{skillsValidation.errors.skills}</span>
                            </label>
                        )}
                    </div>
                    <button className="btn btn-sm btn-primary mt-4 shadow-soft hover:shadow-medium transition-all duration-200">
                        Add Skills
                    </button>
                </form>
            </section>

            <div className="divider-modern"></div>

            <section className="card-modern">
                <h1 className="text-3xl font-bold font-display gradient-text mb-6">Projects</h1>

                <form ref={projectsFormRef} onSubmit={(e) => {
                    e.preventDefault();
                    const data = getFormData(e);
                    
                    // Validate all fields
                    const isValid = projectsValidation.validateAll(data);
                    if (!isValid) {
                        return; // Prevent submission if validation fails
                    }

                    if (projectsEditMode.isEditing) {
                        // Update existing item
                        projectsEditMode.saveEdit(data as Projects);
                    } else {
                        // Add new item
                        setArrData("projects", data as Projects);
                    }
                    
                    e.currentTarget.reset();
                    projectsValidation.clearAllErrors();
                }}>
                    <div className="mt-2 flex gap-4">
                        <div className="form-control w-full max-w-xs">
                            <label className="label" htmlFor="project-name">
                                <span className="label-text">Project Name <span className="text-error">*</span></span>
                            </label>
                            <input 
                                id="project-name"
                                name="name" 
                                type="text" 
                                placeholder="Name" 
                                className={`input input-bordered input-modern w-full ${projectsValidation.errors.name ? 'input-error' : ''}`}
                                aria-required="true"
                                aria-invalid={projectsValidation.errors.name ? "true" : "false"}
                                aria-describedby={projectsValidation.errors.name ? "project-name-error" : undefined}
                                onChange={(e) => projectsValidation.validate("name", e.currentTarget.value)}
                            />
                            {projectsValidation.errors.name && (
                                <label className="label">
                                    <span id="project-name-error" className="label-text-alt text-error" role="alert">{projectsValidation.errors.name}</span>
                                </label>
                            )}
                        </div>
                        <div className="form-control w-full max-w-xs">
                            <label className="label" htmlFor="project-url">
                                <span className="label-text">Project URL <span className="text-error">*</span></span>
                            </label>
                            <input 
                                id="project-url"
                                name="url" 
                                type="text" 
                                placeholder="URL" 
                                className={`input input-bordered w-full ${projectsValidation.errors.url ? 'input-error' : ''}`}
                                aria-required="true"
                                aria-invalid={projectsValidation.errors.url ? "true" : "false"}
                                aria-describedby={projectsValidation.errors.url ? "project-url-error" : undefined}
                                onChange={(e) => projectsValidation.validate("url", e.currentTarget.value)}
                            />
                            {projectsValidation.errors.url && (
                                <label className="label">
                                    <span id="project-url-error" className="label-text-alt text-error" role="alert">{projectsValidation.errors.url}</span>
                                </label>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button type="submit" className="btn btn-sm btn-primary shadow-soft hover:shadow-medium transition-all duration-200">
                            {projectsEditMode.isEditing ? 'Update Project' : 'Add Project'}
                        </button>
                        {projectsEditMode.isEditing && (
                            <button 
                                type="button" 
                                className="btn btn-sm btn-ghost"
                                onClick={() => {
                                    projectsEditMode.cancelEdit();
                                    projectsFormRef.current?.reset();
                                    projectsValidation.clearAllErrors();
                                }}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </section>

            <div className="divider-modern"></div>

            <section className="card-modern">
                <h1 className="text-3xl font-bold font-display gradient-text mb-6">Certifications</h1>

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
                        <label className="label" htmlFor="certifications-input">
                            <span className="label-text">Certifications <span className="text-error">*</span></span>
                        </label>
                        <textarea
                            id="certifications-input"
                            name="certifications"
                            className={`textarea textarea-bordered input-modern w-full ${certificationsValidation.errors.certifications ? 'textarea-error' : ''}`}
                            placeholder="Separate your certifications with a comma ( , )"
                            aria-required="true"
                            aria-invalid={certificationsValidation.errors.certifications ? "true" : "false"}
                            aria-describedby={certificationsValidation.errors.certifications ? "certifications-error" : undefined}
                            onChange={(e) => certificationsValidation.validate("certifications", e.currentTarget.value)}
                        />
                        {certificationsValidation.errors.certifications && (
                            <label className="label">
                                <span id="certifications-error" className="label-text-alt text-error" role="alert">{certificationsValidation.errors.certifications}</span>
                            </label>
                        )}
                    </div>
                    <button className="btn btn-sm btn-primary mt-4 shadow-soft hover:shadow-medium transition-all duration-200">
                        Add Certifications
                    </button>
                </form>
            </section>

            <div className="divider-modern"></div>

            <section className="card-modern">
                <h1 className="text-3xl font-bold font-display gradient-text mb-6">Languages</h1>

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
                        <label className="label" htmlFor="languages-input">
                            <span className="label-text">Languages <span className="text-error">*</span></span>
                        </label>
                        <textarea
                            id="languages-input"
                            name="languages"
                            className={`textarea textarea-bordered input-modern w-full ${languagesValidation.errors.languages ? 'textarea-error' : ''}`}
                            placeholder="Separate your languages with a comma ( , )"
                            aria-required="true"
                            aria-invalid={languagesValidation.errors.languages ? "true" : "false"}
                            aria-describedby={languagesValidation.errors.languages ? "languages-error" : undefined}
                            onChange={(e) => languagesValidation.validate("languages", e.currentTarget.value)}
                        />
                        {languagesValidation.errors.languages && (
                            <label className="label">
                                <span id="languages-error" className="label-text-alt text-error" role="alert">{languagesValidation.errors.languages}</span>
                            </label>
                        )}
                    </div>
                    <button className="btn btn-sm btn-primary mt-4 shadow-soft hover:shadow-medium transition-all duration-200">
                        Add Languages
                    </button>
                </form>
            </section>

            <div className="divider-modern"></div>

            <section className="card-modern mb-8">
                <h1 className="text-3xl font-bold font-display gradient-text mb-4">Data Management</h1>
                <p className="text-sm text-base-content/70 mt-2 mb-4">Manage your CV data: export for backup, import from file, or start fresh.</p>
                
                <div className="flex flex-wrap gap-4 mt-4">
                    <button 
                        className="btn btn-sm btn-primary shadow-soft hover:shadow-medium transition-all duration-200"
                        onClick={handleExportData}
                        aria-label="Export CV data to JSON file"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export Data
                    </button>

                    <button 
                        className="btn btn-sm btn-secondary shadow-soft hover:shadow-medium transition-all duration-200"
                        onClick={handleImportClick}
                        aria-label="Import CV data from JSON file"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Import Data
                    </button>

                    <button 
                        className="btn btn-sm btn-error shadow-soft hover:shadow-medium transition-all duration-200"
                        onClick={() => setShowClearDialog(true)}
                        aria-label="Clear all CV data"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Clear All Data
                    </button>
                </div>

                {/* Hidden file input for import */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json,application/json"
                    style={{ display: 'none' }}
                    onChange={handleImportFile}
                    aria-label="Select JSON file to import"
                />
            </section>

            {/* Notification Container */}
            <NotificationContainer 
                notifications={notifications}
                onDismiss={dismissNotification}
            />

            {/* Clear All Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showClearDialog}
                title="Clear All Data"
                message="Are you sure you want to clear all your CV data? This action cannot be undone and all your information will be permanently deleted."
                confirmText="Clear All"
                cancelText="Cancel"
                type="error"
                onConfirm={handleClearAll}
                onCancel={() => setShowClearDialog(false)}
            />
            </div>
        </div>
    );

    // Handler functions
    function handleExportData() {
        try {
            const jsonData = exportData();
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const date = new Date().toISOString().split('T')[0];
            link.href = url;
            link.download = `cv-data-${date}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            showNotification('success', 'CV data exported successfully!');
        } catch (error) {
            console.error('Export error:', error);
            showNotification('error', 'Failed to export CV data. Please try again.');
        }
    }

    function handleImportClick() {
        fileInputRef.current?.click();
    }

    function handleImportFile(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.includes('json') && !file.name.endsWith('.json')) {
            showNotification('error', 'Invalid file type. Please select a JSON file.');
            event.target.value = ''; // Reset input
            return;
        }

        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const jsonString = e.target?.result as string;
                
                // Validate JSON format
                if (!jsonString || jsonString.trim() === '') {
                    throw new Error('File is empty');
                }

                // Import the data (this will throw if invalid)
                importData(jsonString);
                
                showNotification('success', 'CV data imported successfully!');
                
                // Reset all form validations
                basicInfoValidation.clearAllErrors();
                contactValidation.clearAllErrors();
                experienceValidation.clearAllErrors();
                educationValidation.clearAllErrors();
                projectsValidation.clearAllErrors();
                skillsValidation.clearAllErrors();
                certificationsValidation.clearAllErrors();
                languagesValidation.clearAllErrors();
                
            } catch (error) {
                console.error('Import error:', error);
                showNotification('error', 'Failed to import CV data. Please check the file format and try again.');
            } finally {
                // Reset file input
                event.target.value = '';
            }
        };

        reader.onerror = () => {
            showNotification('error', 'Failed to read file. Please try again.');
            event.target.value = '';
        };

        reader.readAsText(file);
    }

    function handleClearAll() {
        try {
            clearAll();
            setShowClearDialog(false);
            
            // Reset all forms
            experienceFormRef.current?.reset();
            educationFormRef.current?.reset();
            projectsFormRef.current?.reset();
            
            // Clear all validations
            basicInfoValidation.clearAllErrors();
            contactValidation.clearAllErrors();
            experienceValidation.clearAllErrors();
            educationValidation.clearAllErrors();
            projectsValidation.clearAllErrors();
            skillsValidation.clearAllErrors();
            certificationsValidation.clearAllErrors();
            languagesValidation.clearAllErrors();
            
            // Reset local state
            setCurrently(false);
            setImageFile(null);
            
            showNotification('success', 'All CV data has been cleared.');
        } catch (error) {
            console.error('Clear error:', error);
            showNotification('error', 'Failed to clear CV data. Please try again.');
        }
    }
}
