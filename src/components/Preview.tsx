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
import { usePDF } from 'react-to-pdf'
import EditableItem from "./EditableItem"
import ConfirmDialog from "./ConfirmDialog"
import { useEditModeContext } from "../contexts/EditModeContext"
import { useState } from "react"
import { urlBuilder } from "../utils/urlBuilder"
import { useNotification } from "../hooks/useNotification"
import { NotificationContainer } from "./NotificationContainer"

export default function Preview() {
    const { img, name, role, bio, contact, experience, education, skills, projects, certifications, languages, deleteArrItem } = useCvStore();
    const { toPDF, targetRef } = usePDF({ filename: 'cv.pdf' });
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

    // Handle PDF export with error handling
    const handlePDFExport = async () => {
        try {
            await toPDF();
            showNotification('success', 'CV exported to PDF successfully!');
        } catch (error) {
            console.error('PDF export error:', error);
            showNotification('error', 'Failed to export CV to PDF. Please try again.');
        }
    };

    return (
        <div className="flex-1 py-5 px-4 bg-base-100 h-screen overflow-auto md:flex md:justify-center" ref={targetRef}>
            <div className="w-[700px] md:px-6 md:max-w-[900px] max-w-[100vw]">
                <FloatingButton onClick={handlePDFExport} />
                <section className="flex items-center gap-6">
                    <div className="avatar">
                        <div className="w-40 rounded-full">
                            <img src={img || "https://i.pravatar.cc/150?u=johndoe"} alt="avatar" />
                        </div>
                    </div>

                    <div>
                        <h1 className="text-5xl font-bold capitalize">{name || "John Doe"}</h1>
                        <h2 className="text-2xl font-bold capitalize">{role || "Fullstack Developer"}</h2>
                        <div className="text-lg mt-2">
                            {
                                bio.length > 0
                                    ? bio.split("\n").map((p, idx) => <p key={idx}>{p.charAt(0).toUpperCase() + p.slice(1)}</p>)
                                    : "Your Bio"
                            }
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2">
                            {contact.website && (
                                <a href={urlBuilder.website(contact.website)} target="_blank" rel="noopener noreferrer" className="flex gap-1 badge badge-primary">
                                    <TbWorldWww />
                                    {contact.website}
                                </a>
                            )}
                            {contact.linkedin && (
                                <a href={urlBuilder.linkedin(contact.linkedin)} target="_blank" rel="noopener noreferrer" className="flex gap-1 badge badge-primary">
                                    <BsLinkedin />
                                    {contact.linkedin}
                                </a>
                            )}
                            {contact.github && (
                                <a href={urlBuilder.github(contact.github)} target="_blank" rel="noopener noreferrer" className="flex gap-1 badge badge-primary">
                                    <BsGithub />
                                    {contact.github}
                                </a>
                            )}
                            {contact.twitter && (
                                <a href={urlBuilder.twitter(contact.twitter)} target="_blank" rel="noopener noreferrer" className="flex gap-1 badge badge-primary">
                                    <RiTwitterXFill />
                                    {contact.twitter}
                                </a>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {contact.email && (
                                <a href={urlBuilder.email(contact.email)} className="flex gap-1 badge badge-primary">
                                    <MdEmail />
                                    {contact.email}
                                </a>
                            )}
                            {contact.phone && (
                                <a href={urlBuilder.phone(contact.phone)} className="flex gap-1 badge badge-primary">
                                    <AiFillPhone />
                                    {contact.phone}
                                </a>
                            )}
                        </div>
                    </div>
                </section>

                <section className="mt-8">
                    <h2 className="text-3xl font-bold flex gap-2 items-center">
                        Experience
                        <BsFillStarFill color="#F59E0B" />
                    </h2>

                    {experience.length === 0 ? (
                        <p className="text-gray-500 mt-4 italic">No experience added yet. Add your work experience in the editor.</p>
                    ) : (
                        <ul className="steps steps-vertical">
                            {experience.map((exp) => (
                                <li key={exp.id} className="step step-primary py-2" data-content="">
                                    <EditableItem
                                        type="experience"
                                        data={exp}
                                        id={exp.id}
                                        onEdit={handleEditExperience}
                                        onDelete={(id) => handleDeleteClick('experience', id, `${exp.title} at ${exp.company}`)}
                                    >
                                        <div className="flex flex-col w-full text-left capitalize">
                                            <h3 className="text-xl font-bold">{exp.title} at {exp.company}</h3>
                                            <span className="text-gray-500">{exp.startDate} - {exp.endDate}</span>
                                            <p className="text-gray-400 ca">{exp.location}</p>
                                            <p className="text-lg">{exp.description}</p>
                                        </div>
                                    </EditableItem>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                <section className="mt-8">
                    <h2 className="text-3xl font-bold flex gap-2 items-center">
                        Education
                        <BiSolidBookBookmark color="#3ABAB4" />
                    </h2>

                    {education.length === 0 ? (
                        <p className="text-gray-500 mt-4 italic">No education added yet. Add your education in the editor.</p>
                    ) : (
                        <ul className="steps steps-vertical">
                            {education.map((edu) => (
                                <li key={edu.id} className="step step-primary py-2" data-content="">
                                    <EditableItem
                                        type="education"
                                        data={edu}
                                        id={edu.id}
                                        onEdit={handleEditEducation}
                                        onDelete={(id) => handleDeleteClick('education', id, `${edu.title} at ${edu.school}`)}
                                    >
                                        <div className="flex flex-col w-full text-left">
                                            <h3 className="text-xl font-bold">{edu.title}</h3>
                                            <span className="text-gray-500">{edu.startDate} - {edu.endDate}</span>
                                            <p className="text-gray-400">{edu.school} - {edu.location}</p>
                                        </div>
                                    </EditableItem>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                <section className="mt-8">
                    <h2 className="text-3xl font-bold flex gap-2 items-center">
                        Skills
                        <AiFillCheckCircle color="#10B981" />
                    </h2>

                    {skills.length === 0 ? (
                        <p className="text-gray-500 mt-4 italic">No skills added yet. Add your skills in the editor.</p>
                    ) : (
                        <ul className="list-disc ml-6 mt-2 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
                            {skills.map((skill, idx) => (
                                <EditableItem
                                    key={idx}
                                    type="skill"
                                    data={skill}
                                    id={idx.toString()}
                                    onEdit={() => {}}
                                    onDelete={(id) => handleDeleteClick('skill', id, skill)}
                                >
                                    <li className="capitalize">{skill}</li>
                                </EditableItem>
                            ))}
                        </ul>
                    )}
                </section>

                <section className="mt-8">
                    <h2 className="text-3xl font-bold flex gap-2 items-center">
                        Projects
                        <FcOpenedFolder />
                    </h2>

                    {projects.length === 0 ? (
                        <p className="text-gray-500 mt-4 italic">No projects added yet. Add your projects in the editor.</p>
                    ) : (
                        <ul className="list-disc ml-6 mt-2 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
                            {projects.map((project) => (
                                <EditableItem
                                    key={project.id}
                                    type="project"
                                    data={project}
                                    id={project.id}
                                    onEdit={handleEditProject}
                                    onDelete={(id) => handleDeleteClick('project', id, project.name)}
                                >
                                    <li>
                                        <a href={urlBuilder.website(project.url)} target="_blank" rel="noopener noreferrer" className="capitalize">{project.name}</a>
                                    </li>
                                </EditableItem>
                            ))}
                        </ul>
                    )}
                </section>

                <section className="mt-8">
                    <h2 className="text-3xl font-bold flex gap-2 items-center">
                        Certifications
                        <PiCertificateFill color="#F54E0B" />
                    </h2>

                    {certifications.length === 0 ? (
                        <p className="text-gray-500 mt-4 italic">No certifications added yet. Add your certifications in the editor.</p>
                    ) : (
                        <ul className="list-disc mt-2 mx-6 mb-10 grid gap-2 md:grid-cols-3 lg:grid-cols-4">
                            {certifications.map((cert, idx) => (
                                <EditableItem
                                    key={idx}
                                    type="certification"
                                    data={cert}
                                    id={idx.toString()}
                                    onEdit={() => {}}
                                    onDelete={(id) => handleDeleteClick('certification', id, cert)}
                                >
                                    <li className="capitalize">{cert}</li>
                                </EditableItem>
                            ))}
                        </ul>
                    )}
                </section>

                <section className="mt-8 pb-1">
                    <h2 className="text-3xl font-bold flex gap-2 items-center">
                        Languages
                        <HiMiniLanguage color="#f2b43f" />
                    </h2>

                    {languages.length === 0 ? (
                        <p className="text-gray-500 mt-4 italic">No languages added yet. Add your languages in the editor.</p>
                    ) : (
                        <ul className="list-disc mt-2 mx-6 mb-10 grid gap-2 md:grid-cols-3 lg:grid-cols-4">
                            {languages.map((lang, idx) => (
                                <EditableItem
                                    key={idx}
                                    type="language"
                                    data={lang}
                                    id={idx.toString()}
                                    onEdit={() => {}}
                                    onDelete={(id) => handleDeleteClick('language', id, lang)}
                                >
                                    <li className="capitalize">{lang}</li>
                                </EditableItem>
                            ))}
                        </ul>
                    )}
                </section>
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
        </div>
    );
}
