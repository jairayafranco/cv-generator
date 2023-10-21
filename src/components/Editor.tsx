import { useCvStore } from "../store/useCvStore";
import type { Contact, Education, Experience, Projects } from "../types/CvStore";
import { useState } from "react";
import { getFormData, socialNetworks, splitByComma } from "../utils";

export default function Editor() {
    const { setBasic, setContact, setArrData } = useCvStore();
    const [currently, setCurrently] = useState(false);

    return (
        <div className="flex-1 p-4 mb-5 overflow-auto">

            <section className="mt-4">
                <h1 className="text-3xl font-bold">Basic Info</h1>

                <input
                    type="file"
                    className="file-input file-input-bordered file-input-primary file-input-sm w-full max-w-sm mt-4"
                    onChange={(e) => {
                        const file = e.currentTarget.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            setBasic("img", reader.result as string);
                        };
                        reader.readAsDataURL(file);
                    }}
                />
                <div className="flex gap-4 mt-2">
                    <input
                        type="text"
                        placeholder="Your name"
                        className="input input-bordered w-full max-w-sm"
                        onInput={(e) => setBasic("name", e.currentTarget.value)}
                    />
                    <input
                        type="text"
                        placeholder="Your role"
                        className="input input-bordered w-full max-w-sm"
                        onInput={(e) => setBasic("role", e.currentTarget.value)}
                    />
                </div>
                <textarea
                    className="textarea textarea-bordered mt-4 w-full"
                    placeholder="Your bio"
                    onInput={(e) => setBasic("bio", e.currentTarget.value)}
                />
            </section>

            <div className="divider"></div>

            <section>
                <h1 className="text-3xl font-bold mt-4">Social Networks</h1>
                <div className="grid grid-cols-3 gap-4 mt-4">
                    {socialNetworks.map((socialNetwork) => (
                        <input
                            key={socialNetwork.name}
                            type="text"
                            placeholder={socialNetwork.label}
                            className="input input-bordered w-full max-w-xs"
                            onInput={(e) => setContact(socialNetwork.name as keyof Contact, e.currentTarget.value)}
                        />
                    ))}
                </div>
            </section>

            <div className="divider"></div>

            <section className="mt-4">
                <h1 className="text-3xl font-bold">Experience</h1>

                <form onSubmit={(e) => {
                    const data = getFormData(e);

                    if (data.currently) {
                        data.endDate = "Currently";
                    }

                    setArrData("experience", data as Experience);
                    e.currentTarget.reset();
                }}>
                    <div className="flex gap-4 mt-4">
                        <input
                            name="title"
                            type="text"
                            placeholder="Your title"
                            className="input input-bordered w-full max-w-xs"
                        />
                        <input
                            name="company"
                            type="text"
                            placeholder="Company"
                            className="input input-bordered w-full max-w-xs"
                        />
                        <input
                            name="location"
                            type="text"
                            placeholder="Location"
                            className="input input-bordered w-full max-w-xs"
                        />
                    </div>

                    <div className="flex gap-4 items-center">
                        <div className="flex flex-col">
                            <label className="label">Start Date</label>
                            <input
                                name="startDate"
                                type="date"
                                placeholder="Start Date"
                                className="input input-bordered w-full max-w-xs"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="label">End Date</label>
                            <input
                                name="endDate"
                                disabled={currently}
                                type="date"
                                placeholder="End Date"
                                className="input input-bordered w-full max-w-xs"
                            />
                        </div>

                        <div className="flex gap-1 mt-8">
                            <input
                                type="checkbox"
                                name="currently"
                                checked={currently}
                                onChange={() => setCurrently(!currently)}
                            />
                            <label className="label">Currently</label>
                        </div>
                    </div>

                    <textarea
                        name="description"
                        className="textarea textarea-bordered mt-4 w-full"
                        placeholder="Description"
                    />

                    <button className="btn btn-sm btn-primary mt-4">
                        Add Experience
                    </button>
                </form>
            </section>

            <div className="divider"></div>

            <section className="mt-4">
                <h1 className="text-3xl font-bold">Education</h1>

                <form onSubmit={(e) => {
                    const data = getFormData(e);
                    setArrData("education", data as Education);
                    e.currentTarget.reset();
                }}>

                    <div className="mt-2 flex gap-4">
                        <input name="title" type="text" placeholder="Your title" className="input input-bordered w-full max-w-xs" />
                        <input name="school" type="text" placeholder="School Name" className="input input-bordered w-full max-w-xs" />
                        <input name="location" type="text" placeholder="Location" className="input input-bordered w-full max-w-xs" />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex flex-col">
                            <label className="label">Start Date</label>
                            <input name="startDate" type="date" placeholder="Start Date" className="input input-bordered w-full max-w-xs" />
                        </div>

                        <div className="flex flex-col">
                            <label className="label">End Date</label>
                            <input name="endDate" type="date" placeholder="End Date" className="input input-bordered w-full max-w-xs" />
                        </div>
                    </div>

                    <button className="btn btn-sm btn-primary mt-4">
                        Add Experience
                    </button>
                </form>
            </section>

            <div className="divider"></div>

            <section className="mt-4">
                <h1 className="text-3xl font-bold">Skills</h1>

                <form onSubmit={(e) => {
                    const data = getFormData(e);
                    const skills = splitByComma(data.skills as string);
                    setArrData("skills", skills);
                    e.currentTarget.reset();
                }}>
                    <textarea
                        name="skills"
                        className="textarea textarea-bordered mt-4 w-full"
                        placeholder="Separate your skills with a comma ( , )"
                    />
                    <button className="btn btn-sm btn-primary mt-4">
                        Add Skills
                    </button>
                </form>
            </section>

            <div className="divider"></div>

            <section className="mt-4">
                <h1 className="text-3xl font-bold">Projects</h1>

                <form onSubmit={(e) => {
                    const data = getFormData(e);
                    setArrData("projects", data as Projects);
                    e.currentTarget.reset();
                }}>
                    <div className="mt-2 flex gap-4">
                        <input name="name" type="text" placeholder="Name" className="input input-bordered w-full max-w-xs" />
                        <input name="url" type="text" placeholder="URL" className="input input-bordered w-full max-w-xs" />
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
                    const data = getFormData(e);
                    const certs = splitByComma(data.certifications as string);
                    setArrData("certifications", certs);
                    e.currentTarget.reset();
                }}>
                    <textarea
                        name="certifications"
                        className="textarea textarea-bordered mt-4 w-full"
                        placeholder="Separate your certifications with a comma ( , )"
                    />
                    <button className="btn btn-sm btn-primary mt-4">
                        Add Certifications
                    </button>
                </form>
            </section>

            <div className="divider"></div>

            <section className="mt-4">
                <h1 className="text-3xl font-bold">Languages</h1>

                <form onSubmit={(e) => {
                    const data = getFormData(e);
                    const langs = splitByComma(data.languages as string);
                    setArrData("languages", langs);
                    e.currentTarget.reset();
                }}>
                    <textarea
                        name="languages"
                        className="textarea textarea-bordered mt-4 w-full"
                        placeholder="Separate your languages with a comma ( , )"
                    />
                    <button className="btn btn-sm btn-primary mt-4">
                        Add Languages
                    </button>
                </form>
            </section>
        </div>
    );
}
