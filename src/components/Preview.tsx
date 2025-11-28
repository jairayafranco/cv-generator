import { TbWorldWww } from "react-icons/tb"
import { BsLinkedin, BsGithub, BsFillStarFill } from "react-icons/bs"
import { RiTwitterXFill } from "react-icons/ri"
import { BiSolidBookBookmark } from "react-icons/bi"
import { AiFillCheckCircle, AiFillPhone } from "react-icons/ai"
import { FcOpenedFolder } from "react-icons/fc"
import { PiCertificateFill } from "react-icons/pi"
import { HiMiniLanguage } from "react-icons/hi2"
import { MdEmail } from "react-icons/md"
import { useCvStore } from "../store/useCvStore"
import FloatingButton from "./FloatingButton"
import EditableItem from "./EditableItem"
import ConfirmDialog from "./ConfirmDialog"
import { useEditModeContext } from "../contexts/EditModeContext"
import { useState, useRef } from "react"
import { urlBuilder } from "../utils/urlBuilder"
import { useNotification } from "../hooks/useNotification"
import { NotificationContainer } from "./NotificationContainer"

export default function Preview() {
    const { img, name, role, bio, contact, experience, education, skills, projects, certifications, languages, deleteArrItem } = useCvStore();
    const targetRef = useRef<HTMLDivElement>(null);
    const { startEditExperience, startEditEducation, startEditProjects } = useEditModeContext();
    const { notifications, showNotification, dismissNotification } = useNotification();
    
    // State for delete confirmation dialog
    const [deleteDialog, setDeleteDialog] = useState<{
        isOpen: boolean;
        type: 'experience' | 'education' | 'project' | 'skill' | 'certification' | 'language' | null;
        id: string;
        name: string;
    }>({
        isOpen: false,
        type: null,
        id: '',
        name: ''
    });

    // Scroll to editor when edit is clicked
    const scrollToEditor = () => {
        const editorElement = document.querySelector('.flex-1.p-4.mb-5.overflow-auto');
        if (editorElement) {
            editorElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Handle edit actions
    const handleEditExperience = (id: string) => {
        const item = experience.find(exp => exp.id === id);
        if (item) {
            startEditExperience(id, item);
            scrollToEditor();
        }
    };

    const handleEditEducation = (id: string) => {
        const item = education.find(edu => edu.id === id);
        if (item) {
            startEditEducation(id, item);
            scrollToEditor();
        }
    };

    const handleEditProject = (id: string) => {
        const item = projects.find(proj => proj.id === id);
        if (item) {
            startEditProjects(id, item);
            scrollToEditor();
        }
    };

    // Handle delete actions
    const handleDeleteClick = (
        type: 'experience' | 'education' | 'project' | 'skill' | 'certification' | 'language',
        id: string,
        itemName: string
    ) => {
        setDeleteDialog({
            isOpen: true,
            type,
            id,
            name: itemName
        });
    };

    const handleDeleteConfirm = () => {
        if (deleteDialog.type && deleteDialog.id) {
            deleteArrItem(deleteDialog.type === 'project' ? 'projects' : deleteDialog.type === 'skill' ? 'skills' : deleteDialog.type === 'certification' ? 'certifications' : deleteDialog.type === 'language' ? 'languages' : deleteDialog.type, deleteDialog.id);
        }
        setDeleteDialog({ isOpen: false, type: null, id: '', name: '' });
    };

    const handleDeleteCancel = () => {
        setDeleteDialog({ isOpen: false, type: null, id: '', name: '' });
    };

    // Handle PDF export with error handling using html2pdf.js
    const handlePDFExport = async () => {
        try {
            if (!targetRef.current) {
                throw new Error('Preview element not found');
            }

            // Hide floating button temporarily during export
            const floatingButton = document.querySelector('.fixed.right-6.bottom-6');
            if (floatingButton) {
                (floatingButton as HTMLElement).style.display = 'none';
            }

            // Dynamic import of html2pdf.js
            const html2pdfModule = await import('html2pdf.js');
            const html2pdf = html2pdfModule.default || html2pdfModule;

            // Small delay to ensure button is hidden
            await new Promise(resolve => setTimeout(resolve, 100));

            const element = targetRef.current;
            const filename = `${name || 'cv'}-${new Date().toISOString().split('T')[0]}.pdf`;

            const opt = {
                margin: [10, 10, 10, 10] as [number, number, number, number],
                filename: filename,
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: { 
                    scale: 2,
                    useCORS: true,
                    letterRendering: true,
                    logging: false
                },
                jsPDF: { 
                    unit: 'mm' as const, 
                    format: 'a4' as const, 
                    orientation: 'portrait' as const
                },
                pagebreak: { mode: ['avoid-all', 'css', 'legacy'] as ('avoid-all' | 'css' | 'legacy')[] }
            };

            await html2pdf().set(opt).from(element).save();
            
            // Show button again
            if (floatingButton) {
                (floatingButton as HTMLElement).style.display = 'block';
            }

            showNotification('success', 'CV exported to PDF successfully!');
        } catch (error) {
            console.error('PDF export error:', error);
            
            // Ensure button is shown again even on error
            const floatingButton = document.querySelector('.fixed.right-6.bottom-6');
            if (floatingButton) {
                (floatingButton as HTMLElement).style.display = 'block';
            }
            
            showNotification('error', 'Failed to export CV to PDF. Please try again.');
        }
    };

    return (
        <>
            <FloatingButton onClick={handlePDFExport} />
            <div className="flex-1 py-8 px-6 bg-gradient-to-br from-base-100 via-base-200/50 to-base-100 h-screen overflow-auto md:flex md:justify-center" ref={targetRef} data-theme="light">
                <div className="w-[700px] md:px-8 md:max-w-[900px] max-w-[100vw]">
                <section className="flex items-center gap-8 mb-8 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-base-200">
                    <div className="avatar">
                        <div className="w-40 rounded-full ring-4 ring-primary-200 shadow-medium">
                            <img src={img || "https://i.pravatar.cc/150?u=johndoe"} alt="avatar" className="object-cover" />
                        </div>
                    </div>

                    <div className="flex-1">
                        <h1 className="text-5xl font-bold font-display capitalize mb-2 bg-gradient-to-r from-primary-600 to-secondary bg-clip-text text-transparent">{name || "John Doe"}</h1>
                        <h2 className="text-2xl font-semibold capitalize text-base-content/80 mb-3">{role || "Fullstack Developer"}</h2>
                        <div className="text-base text-base-content/70 leading-relaxed mt-2 mb-4">
                            {
                                bio.length > 0
                                    ? bio.split("\n").map((p, idx) => <p key={idx} className="mb-2">{p.charAt(0).toUpperCase() + p.slice(1)}</p>)
                                    : <p className="italic text-base-content/50">Your Bio</p>
                            }
                        </div>

                        <div className="flex flex-wrap gap-2 mt-3">
                            {contact.website && (
                                <a href={urlBuilder.website(contact.website)} target="_blank" rel="noopener noreferrer" className="flex gap-1 badge badge-primary shadow-soft hover:shadow-medium transition-all duration-200 hover:scale-105">
                                    <TbWorldWww />
                                    {contact.website}
                                </a>
                            )}
                            {contact.linkedin && (
                                <a href={urlBuilder.linkedin(contact.linkedin)} target="_blank" rel="noopener noreferrer" className="flex gap-1 badge badge-primary shadow-soft hover:shadow-medium transition-all duration-200 hover:scale-105">
                                    <BsLinkedin />
                                    {contact.linkedin}
                                </a>
                            )}
                            {contact.github && (
                                <a href={urlBuilder.github(contact.github)} target="_blank" rel="noopener noreferrer" className="flex gap-1 badge badge-primary shadow-soft hover:shadow-medium transition-all duration-200 hover:scale-105">
                                    <BsGithub />
                                    {contact.github}
                                </a>
                            )}
                            {contact.twitter && (
                                <a href={urlBuilder.twitter(contact.twitter)} target="_blank" rel="noopener noreferrer" className="flex gap-1 badge badge-primary shadow-soft hover:shadow-medium transition-all duration-200 hover:scale-105">
                                    <RiTwitterXFill />
                                    {contact.twitter}
                                </a>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {contact.email && (
                                <a href={urlBuilder.email(contact.email)} className="flex gap-1 badge badge-primary shadow-soft hover:shadow-medium transition-all duration-200 hover:scale-105">
                                    <MdEmail />
                                    {contact.email}
                                </a>
                            )}
                            {contact.phone && (
                                <a href={urlBuilder.phone(contact.phone)} className="flex gap-1 badge badge-primary shadow-soft hover:shadow-medium transition-all duration-200 hover:scale-105">
                                    <AiFillPhone />
                                    {contact.phone}
                                </a>
                            )}
                        </div>
                    </div>
                </section>

                <section className="mt-8 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-base-200">
                    <h2 className="text-3xl font-bold font-display flex gap-2 items-center mb-6 gradient-text">
                        Experience
                        <BsFillStarFill color="#F59E0B" />
                    </h2>

                    {experience.length === 0 ? (
                        <p className="text-base-content/50 mt-4 italic">No experience added yet. Add your work experience in the editor.</p>
                    ) : (
                        <ul className="steps steps-vertical">
                            {experience.map((exp) => (
                                <li key={exp.id} className="step step-primary py-4" data-content="">
                                    <EditableItem
                                        type="experience"
                                        data={exp}
                                        id={exp.id}
                                        onEdit={handleEditExperience}
                                        onDelete={(id) => handleDeleteClick('experience', id, `${exp.title} at ${exp.company}`)}
                                    >
                                        <div className="flex flex-col w-full text-left capitalize p-4 rounded-lg bg-base-100/50 hover:bg-base-100 transition-colors duration-200">
                                            <h3 className="text-xl font-bold text-primary-700 mb-1">{exp.title} at {exp.company}</h3>
                                            <span className="text-base-content/60 text-sm font-medium mb-1">{exp.startDate} - {exp.endDate}</span>
                                            <p className="text-base-content/50 text-sm mb-2">{exp.location}</p>
                                            <p className="text-base text-base-content/80 leading-relaxed">{exp.description}</p>
                                        </div>
                                    </EditableItem>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                <section className="mt-8 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-base-200">
                    <h2 className="text-3xl font-bold font-display flex gap-2 items-center mb-6 gradient-text">
                        Education
                        <BiSolidBookBookmark color="#3ABAB4" />
                    </h2>

                    {education.length === 0 ? (
                        <p className="text-base-content/50 mt-4 italic">No education added yet. Add your education in the editor.</p>
                    ) : (
                        <ul className="steps steps-vertical">
                            {education.map((edu) => (
                                <li key={edu.id} className="step step-primary py-4" data-content="">
                                    <EditableItem
                                        type="education"
                                        data={edu}
                                        id={edu.id}
                                        onEdit={handleEditEducation}
                                        onDelete={(id) => handleDeleteClick('education', id, `${edu.title} at ${edu.school}`)}
                                    >
                                        <div className="flex flex-col w-full text-left p-4 rounded-lg bg-base-100/50 hover:bg-base-100 transition-colors duration-200">
                                            <h3 className="text-xl font-bold text-primary-700 mb-1">{edu.title}</h3>
                                            <span className="text-base-content/60 text-sm font-medium mb-1">{edu.startDate} - {edu.endDate}</span>
                                            <p className="text-base-content/50 text-sm">{edu.school} - {edu.location}</p>
                                        </div>
                                    </EditableItem>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                <section className="mt-8 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-base-200">
                    <h2 className="text-3xl font-bold font-display flex gap-2 items-center mb-6 gradient-text">
                        Skills
                        <AiFillCheckCircle color="#10B981" />
                    </h2>

                    {skills.length === 0 ? (
                        <p className="text-base-content/50 mt-4 italic">No skills added yet. Add your skills in the editor.</p>
                    ) : (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {skills.map((skill, idx) => (
                                <EditableItem
                                    key={idx}
                                    type="skill"
                                    data={skill}
                                    id={idx.toString()}
                                    onEdit={() => {}}
                                    onDelete={(id) => handleDeleteClick('skill', id, skill)}
                                >
                                    <span className="inline-block px-4 py-2 rounded-full bg-primary-100 text-primary-700 font-medium text-sm capitalize shadow-soft hover:shadow-medium transition-all duration-200 hover:scale-105">{skill}</span>
                                </EditableItem>
                            ))}
                        </div>
                    )}
                </section>

                <section className="mt-8 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-base-200">
                    <h2 className="text-3xl font-bold font-display flex gap-2 items-center mb-6 gradient-text">
                        Projects
                        <FcOpenedFolder />
                    </h2>

                    {projects.length === 0 ? (
                        <p className="text-base-content/50 mt-4 italic">No projects added yet. Add your projects in the editor.</p>
                    ) : (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {projects.map((project) => (
                                <EditableItem
                                    key={project.id}
                                    type="project"
                                    data={project}
                                    id={project.id}
                                    onEdit={handleEditProject}
                                    onDelete={(id) => handleDeleteClick('project', id, project.name)}
                                >
                                    <a href={urlBuilder.website(project.url)} target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 rounded-lg bg-secondary/10 text-secondary font-medium text-sm capitalize shadow-soft hover:shadow-medium transition-all duration-200 hover:scale-105 hover:bg-secondary/20">{project.name}</a>
                                </EditableItem>
                            ))}
                        </div>
                    )}
                </section>

                <section className="mt-8 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-base-200">
                    <h2 className="text-3xl font-bold font-display flex gap-2 items-center mb-6 gradient-text">
                        Certifications
                        <PiCertificateFill color="#F54E0B" />
                    </h2>

                    {certifications.length === 0 ? (
                        <p className="text-base-content/50 mt-4 italic">No certifications added yet. Add your certifications in the editor.</p>
                    ) : (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {certifications.map((cert, idx) => (
                                <EditableItem
                                    key={idx}
                                    type="certification"
                                    data={cert}
                                    id={idx.toString()}
                                    onEdit={() => {}}
                                    onDelete={(id) => handleDeleteClick('certification', id, cert)}
                                >
                                    <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent font-medium text-sm capitalize shadow-soft hover:shadow-medium transition-all duration-200 hover:scale-105">{cert}</span>
                                </EditableItem>
                            ))}
                        </div>
                    )}
                </section>

                <section className="mt-8 pb-1 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-base-200">
                    <h2 className="text-3xl font-bold font-display flex gap-2 items-center mb-6 gradient-text">
                        Languages
                        <HiMiniLanguage color="#f2b43f" />
                    </h2>

                    {languages.length === 0 ? (
                        <p className="text-base-content/50 mt-4 italic">No languages added yet. Add your languages in the editor.</p>
                    ) : (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {languages.map((lang, idx) => (
                                <EditableItem
                                    key={idx}
                                    type="language"
                                    data={lang}
                                    id={idx.toString()}
                                    onEdit={() => {}}
                                    onDelete={(id) => handleDeleteClick('language', id, lang)}
                                >
                                    <span className="inline-block px-4 py-2 rounded-full bg-warning/10 text-warning font-medium text-sm capitalize shadow-soft hover:shadow-medium transition-all duration-200 hover:scale-105">{lang}</span>
                                </EditableItem>
                            ))}
                        </div>
                    )}
                </section>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={deleteDialog.isOpen}
                title="Delete Item"
                message={`Are you sure you want to delete "${deleteDialog.name}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                type="error"
            />

            {/* Notification Container */}
            <NotificationContainer 
                notifications={notifications}
                onDismiss={dismissNotification}
            />
        </>
    );
}
