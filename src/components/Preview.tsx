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
import { usePDF } from 'react-to-pdf';

export default function Preview() {
    const { img, name, role, bio, contact, experience, education, skills, projects, certifications, languages } = useCvStore();
    const { toPDF, targetRef } = usePDF({ filename: 'cv.pdf' });

    return (
        <div className="flex-1 py-5 px-4 bg-base-100 h-screen overflow-auto md:flex md:justify-center" ref={targetRef}>
            <div className="w-[700px] md:px-6 md:max-w-[900px] max-w-[100vw]">
                <FloatingButton onClick={() => toPDF()} />
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
                                    ? bio.split("\n").map((p, idx) => <p key={idx}>{p.charAt(0).toUpperCase() + bio.slice(1)}</p>)
                                    : "Your Bio"
                            }
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2">
                            {contact.website && (
                                <a href="" target="_blank" className="flex gap-1 badge badge-primary">
                                    <TbWorldWww />
                                    {contact.website}
                                </a>
                            )}
                            {contact.linkedin && (
                                <a href="" target="_blank" className="flex gap-1 badge badge-primary">
                                    <BsLinkedin />
                                    {contact.linkedin}
                                </a>
                            )}
                            {contact.github && (
                                <a href="" target="_blank" className="flex gap-1 badge badge-primary">
                                    <BsGithub />
                                    {contact.github}
                                </a>
                            )}
                            {contact.twitter && (
                                <a href="" target="_blank" className="flex gap-1 badge badge-primary">
                                    <RiTwitterXFill />
                                    {contact.twitter}
                                </a>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {contact.email && (
                                <a href="" target="_blank" className="flex gap-1 badge badge-primary">
                                    <MdEmail />
                                    {contact.email}
                                </a>
                            )}
                            {contact.phone && (
                                <a href="" target="_blank" className="flex gap-1 badge badge-primary">
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

                    <ul className="steps steps-vertical">
                        {experience.map((exp, idx) => (
                            <li key={idx} className="step step-primary py-2" data-content="">
                                <div className="flex flex-col w-full text-left capitalize">
                                    <h3 className="text-xl font-bold">{exp.title} at {exp.company}</h3>
                                    <span className="text-gray-500">{exp.startDate} - {exp.endDate}</span>
                                    <p className="text-gray-400 ca">{exp.location}</p>
                                    <p className="text-lg">{exp.description}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="mt-8">
                    <h2 className="text-3xl font-bold flex gap-2 items-center">
                        Education
                        <BiSolidBookBookmark color="#3ABAB4" />
                    </h2>

                    <ul className="steps steps-vertical">
                        {education.map((edu, idx) => (
                            <li key={idx} className="step step-primary py-2" data-content="">
                                <div className="flex flex-col w-full text-left">
                                    <h3 className="text-xl font-bold">{edu.title}</h3>
                                    <span className="text-gray-500">{edu.startDate} - {edu.endDate}</span>
                                    <p className="text-gray-400">{edu.school} - {edu.location}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="mt-8">
                    <h2 className="text-3xl font-bold flex gap-2 items-center">
                        Skills
                        <AiFillCheckCircle color="#10B981" />
                    </h2>

                    <ul className="list-disc ml-6 mt-2 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
                        {skills.map((skill, idx) => (
                            <li key={idx} className="capitalize">{skill}</li>
                        ))}
                    </ul>
                </section>

                <section className="mt-8">
                    <h2 className="text-3xl font-bold flex gap-2 items-center">
                        Projects
                        <FcOpenedFolder />
                    </h2>

                    <ul className="list-disc ml-6 mt-2 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
                        {projects.map((project, idx) => (
                            <li key={idx}>
                                <a href={project.url} target="_blank" className="capitalize">{project.name}</a>
                            </li>
                        ))}

                    </ul>
                </section>

                <section className="mt-8">
                    <h2 className="text-3xl font-bold flex gap-2 items-center">
                        Certifications
                        <PiCertificateFill color="#F54E0B" />
                    </h2>

                    <ul className="list-disc mt-2 mx-6 mb-10 grid gap-2 md:grid-cols-3 lg:grid-cols-4">
                        {certifications.map((cert, idx) => (
                            <li key={idx} className="capitalize">{cert}</li>
                        ))}
                    </ul>
                </section>

                <section className="mt-8 pb-1">
                    <h2 className="text-3xl font-bold flex gap-2 items-center">
                        Languages
                        <HiMiniLanguage color="#f2b43f" />
                    </h2>

                    <ul className="list-disc mt-2 mx-6 mb-10 grid gap-2 md:grid-cols-3 lg:grid-cols-4">
                        {languages.map((lang, idx) => (
                            <li key={idx} className="capitalize">{lang}</li>
                        ))}
                    </ul>
                </section>
            </div>
        </div>
    );
}
