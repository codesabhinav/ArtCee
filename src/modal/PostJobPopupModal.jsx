import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "../contexts/LanguageProvider";
import CustomDropdown from "../components/CustomDropdown";
import clsx from "clsx";
import toast from "react-hot-toast";
import { X } from "lucide-react";
// import { createJob, updateJob } from "../Hooks/useSeller";

import MultiSelectDropdown from "../components/MultiSelectDropdown";

export default function PostJobPopupModal({ isOpen, setIsOpen, onSuccess, editingJob }) {
    const { t } = useTranslation();

    // Basic fields
    const [title, setTitle] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [scheduleType, setScheduleType] = useState("Full-time");
    const [salary, setSalary] = useState("");
    const [via, setVia] = useState("");
    const [applyOptions, setApplyOptions] = useState([{ title: "", link: "" }]);
    const [qualifications, setQualifications] = useState("");
    const [benefits, setBenefits] = useState("");
    const [responsibilities, setResponsibilities] = useState("");
    const [remoteType, setRemoteType] = useState("Hybrid");
    const [postedAt, setPostedAt] = useState("");

    // NEW fields
    const [category, setCategory] = useState(null); // single select category
    const [subcategories, setSubcategories] = useState([]); // multi
    const [submissionDueDate, setSubmissionDueDate] = useState("");
    const [ageRange, setAgeRange] = useState([]); // multi
    const [industryType, setIndustryType] = useState([]); // multi
    const [uniqueSkills, setUniqueSkills] = useState([]); // multi or typed
    const [projectType, setProjectType] = useState([]); // multi
    const [industryAndUnions, setIndustryAndUnions] = useState([]); // multi
    const [culturalIdentifiers, setCulturalIdentifiers] = useState([]); // multi
    const [genderIdentifiers, setGenderIdentifiers] = useState([]); // multi
    const [selectSkills, setSelectSkills] = useState([]); // multi
    const [degreeFocus, setDegreeFocus] = useState([]); // multi
    const [postAnonymously, setPostAnonymously] = useState(false);
    const [postPrivately, setPostPrivately] = useState(false);
    const [hireMultiple, setHireMultiple] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => (document.body.style.overflow = "");
    }, [isOpen]);

    // sample options -- in real app, fetch these from API
    const categoryOptions = [
        { id: 1, name: "Film & TV" },
        { id: 2, name: "Animation" },
        { id: 3, name: "Design" },
        { id: 4, name: "Music" },
    ];

    const subcategoryMap = {
        "Film & TV": [
            { id: "ftv-1", name: "Cinematography" },
            { id: "ftv-2", name: "Editing" },
            { id: "ftv-3", name: "Sound" },
        ],
        Animation: [
            { id: "anim-1", name: "2D" },
            { id: "anim-2", name: "3D" },
            { id: "anim-3", name: "Motion Graphics" },
        ],
        Design: [
            { id: "d-1", name: "UI/UX" },
            { id: "d-2", name: "Graphic" },
        ],
        Music: [
            { id: "m-1", name: "Composer" },
            { id: "m-2", name: "Producer" },
        ],
    };

    const ageRangeOptions = [
        { id: "any", name: "Any" },
        { id: "18-24", name: "18 - 24" },
        { id: "25-34", name: "25 - 34" },
        { id: "35-44", name: "35 - 44" },
        { id: "45+", name: "45+" },
    ];

    const industryOptions = [
        { id: "ind-1", name: "Advertising" },
        { id: "ind-2", name: "Technology" },
        { id: "ind-3", name: "Education" },
        { id: "ind-4", name: "Healthcare" },
    ];

    const skillsOptions = [
        { id: "s-1", name: "Flutter" },
        { id: "s-2", name: "React" },
        { id: "s-3", name: "Cinematography" },
        { id: "s-4", name: "Sound Design" },
    ];

    const projectTypeOptions = [
        { id: "pt-1", name: "Short Film" },
        { id: "pt-2", name: "Commercial" },
        { id: "pt-3", name: "Music Video" },
    ];

    const unionsOptions = [
        { id: "u-1", name: "SAG-AFTRA" },
        { id: "u-2", name: "IATSE" },
        { id: "u-3", name: "Equity" },
    ];

    const culturalOptions = [
        { id: "c-1", name: "Hispanic/Latino" },
        { id: "c-2", name: "Black/African" },
        { id: "c-3", name: "Asian" },
        { id: "c-4", name: "White" },
    ];

    const genderOptions = [
        { id: "g-1", name: "Female" },
        { id: "g-2", name: "Male" },
        { id: "g-3", name: "Non-binary" },
        { id: "g-4", name: "Prefer not to say" },
    ];

    const degreeOptions = [
        { id: "d-1", name: "Computer Science" },
        { id: "d-2", name: "Film Production" },
        { id: "d-3", name: "Graphic Design" },
    ];

    useEffect(() => {
        if (!isOpen) return;

        if (editingJob) {
            setTitle(editingJob.title || "");
            setCompanyName(editingJob.company?.company_name || editingJob.company_name || "");
            setLocation(editingJob.location || editingJob.company?.location || "");
            setDescription(editingJob.description || "");
            setScheduleType(editingJob.schedule_type || "Full-time");
            setSalary(editingJob.salary ?? "");
            setVia(editingJob.via || "");
            setRemoteType(editingJob.remote_type || editingJob.schedule_type || "Hybrid");
            setPostedAt(editingJob.posted_at || "");

            // new fields try to map from editingJob if present
            if (editingJob.category) {
                const cat = categoryOptions.find((c) => c.name === editingJob.category || c.id === editingJob.category);
                if (cat) setCategory(cat);
            }
            if (editingJob.subcategories) {
                const items = editingJob.subcategories.map((s) => ({ id: s.id ?? s, name: s.name ?? s }));
                setSubcategories(items);
            }

            setSubmissionDueDate(editingJob.submission_due_date || "");

            if (editingJob.age_range) setAgeRange(editingJob.age_range.map((a) => ({ id: a, name: a })));
            if (editingJob.industry_type) setIndustryType(editingJob.industry_type.map((i) => ({ id: i, name: i })));
            if (editingJob.unique_skills) setUniqueSkills(editingJob.unique_skills.map((s) => ({ id: s, name: s })));
            if (editingJob.project_type) setProjectType(editingJob.project_type.map((p) => ({ id: p, name: p })));
            if (editingJob.industry_and_unions) setIndustryAndUnions(editingJob.industry_and_unions.map((i) => ({ id: i, name: i })));
            if (editingJob.cultural_identifiers) setCulturalIdentifiers(editingJob.cultural_identifiers.map((c) => ({ id: c, name: c })));
            if (editingJob.gender_identifiers) setGenderIdentifiers(editingJob.gender_identifiers.map((g) => ({ id: g, name: g })));
            if (editingJob.select_skills) setSelectSkills(editingJob.select_skills.map((s) => ({ id: s, name: s })));
            if (editingJob.degree_focus) setDegreeFocus(editingJob.degree_focus.map((d) => ({ id: d, name: d })));

            setApplyOptions(
                Array.isArray(editingJob.apply_options) && editingJob.apply_options.length
                    ? editingJob.apply_options.map((opt) => ({ title: opt.title || "", link: opt.link || "" }))
                    : [{ title: "", link: "" }]
            );

            setQualifications((editingJob.job_highlights?.find((h) => h.title?.toLowerCase() === "qualifications")?.items ?? editingJob.qualifications ?? ""));
            setBenefits((editingJob.job_highlights?.find((h) => h.title?.toLowerCase() === "benefits")?.items ?? editingJob.benefits ?? ""));
            setResponsibilities((editingJob.job_highlights?.find((h) => h.title?.toLowerCase() === "responsibilities")?.items ?? editingJob.responsibilities ?? ""));

            setPostAnonymously(Boolean(editingJob.post_anonymously));
            setPostPrivately(Boolean(editingJob.post_privately));
            setHireMultiple(Boolean(editingJob.hire_multiple));

            setError(null);
        } else {
            // reset
            setTitle("");
            setCompanyName("");
            setLocation("");
            setDescription("");
            setScheduleType("Full-time");
            setSalary("");
            setVia("");
            setRemoteType("Hybrid");
            setPostedAt("");
            setCategory(null);
            setSubcategories([]);
            setSubmissionDueDate("");
            setAgeRange([]);
            setIndustryType([]);
            setUniqueSkills([]);
            setProjectType([]);
            setIndustryAndUnions([]);
            setCulturalIdentifiers([]);
            setGenderIdentifiers([]);
            setSelectSkills([]);
            setDegreeFocus([]);
            setApplyOptions([{ title: "", link: "" }]);
            setQualifications("");
            setBenefits("");
            setResponsibilities("");
            setPostAnonymously(false);
            setPostPrivately(false);
            setHireMultiple(false);
            setError(null);
        }
    }, [isOpen, editingJob]);

    if (!isOpen) return null;

    const scheduleOptions = ["Full-time", "Part-time", "Contract", "Temporary", "Internship"];
    const remoteOptions = ["Remote", "On-site", "Hybrid"];

    const updateApplyOption = (idx, key, value) => {
        const copy = [...applyOptions];
        copy[idx] = { ...copy[idx], [key]: value };
        setApplyOptions(copy);
    };
    const addApplyOption = () => setApplyOptions([...applyOptions, { title: "", link: "" }]);
    const removeApplyOption = (idx) => setApplyOptions(applyOptions.filter((_, i) => i !== idx));

    function transformHighlightsToPayload() {
        const highlights = [];
        if (qualifications) {
            highlights.push({ title: "Qualifications", items: Array.isArray(qualifications) ? qualifications : qualifications });
        }
        if (benefits) {
            highlights.push({ title: "Benefits", items: Array.isArray(benefits) ? benefits : benefits });
        }
        if (responsibilities) {
            highlights.push({ title: "Responsibilities", items: Array.isArray(responsibilities) ? responsibilities : responsibilities });
        }
        return highlights;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        if (!title?.trim()) {
            setError("Job title is required");
            return;
        }
        if (!companyName?.trim()) {
            setError("Company name is required");
            return;
        }
        if (!description?.trim()) {
            setError("Description is required");
            return;
        }
        const hasLink = applyOptions.some((a) => a.link && a.link.trim());
        if (!hasLink) {
            setError("Provide at least one apply link");
            return;
        }

        setLoading(true);
        try {
            const payload = new FormData();
            payload.append("title", title);
            payload.append("company_name", companyName);
            payload.append("location", location);
            payload.append("description", description);
            payload.append("schedule_type", scheduleType);
            payload.append("via", via);
            payload.append("salary", salary);
            payload.append("remote_type", remoteType);
            if (postedAt) payload.append("posted_at", postedAt);
            if (submissionDueDate) payload.append("submission_due_date", submissionDueDate);

            // multi-select arrays -> send as JSON strings
            if (category) payload.append("category", category.id ?? category.name ?? category);
            if (subcategories && subcategories.length) payload.append("subcategories", JSON.stringify(subcategories.map((s) => s.id ?? s.name ?? s)));
            if (ageRange && ageRange.length) payload.append("age_range", JSON.stringify(ageRange.map((a) => a.id ?? a.name ?? a)));
            if (industryType && industryType.length) payload.append("industry_type", JSON.stringify(industryType.map((i) => i.id ?? i.name ?? i)));
            if (uniqueSkills && uniqueSkills.length) payload.append("unique_skills", JSON.stringify(uniqueSkills.map((s) => s.id ?? s.name ?? s)));
            if (projectType && projectType.length) payload.append("project_type", JSON.stringify(projectType.map((p) => p.id ?? p.name ?? p)));
            if (industryAndUnions && industryAndUnions.length) payload.append("industry_and_unions", JSON.stringify(industryAndUnions.map((i) => i.id ?? i.name ?? i)));
            if (culturalIdentifiers && culturalIdentifiers.length) payload.append("cultural_identifiers", JSON.stringify(culturalIdentifiers.map((c) => c.id ?? c.name ?? c)));
            if (genderIdentifiers && genderIdentifiers.length) payload.append("gender_identifiers", JSON.stringify(genderIdentifiers.map((g) => g.id ?? g.name ?? g)));
            if (selectSkills && selectSkills.length) payload.append("select_skills", JSON.stringify(selectSkills.map((s) => s.id ?? s.name ?? s)));
            if (degreeFocus && degreeFocus.length) payload.append("degree_focus", JSON.stringify(degreeFocus.map((d) => d.id ?? d.name ?? d)));

            payload.append("apply_options", JSON.stringify(applyOptions.filter((a) => a.link && a.link.trim())));

            const highlights = transformHighlightsToPayload();
            if (highlights.length) payload.append("job_highlights", JSON.stringify(highlights));

            // booleans
            payload.append("post_anonymously", postAnonymously ? "1" : "0");
            payload.append("post_privately", postPrivately ? "1" : "0");
            payload.append("hire_multiple", hireMultiple ? "1" : "0");

            let res;
            if (editingJob && editingJob.id) {
                // res = await updateJob(editingJob.id, payload);
            } else {
                // res = await createJob(payload);
            }

            if (typeof onSuccess === "function") onSuccess(res);
            toast.success(t("job_form.success_saved") || "Job saved");
            setIsOpen(false);
        } catch (err) {
            console.error(err);
            setError(err?.message || t("job_form.errors.save_failed") || "Failed to save job");
        } finally {
            setLoading(false);
        }
    }

    const currentSubOptions = category ? (subcategoryMap[category.name] ?? []) : [];
    function FieldRow({ children }) {
        const childArray = Array.isArray(children) ? children : [children];
        const rows = [];
        for (let i = 0; i < childArray.length; i += 2) {
            if (i + 1 < childArray.length) rows.push([childArray[i], childArray[i + 1]]);
            else rows.push([childArray[i]]);
        }

        return (
            <div className="space-y-4">
                {rows.map((pair, idx) => (
                    <div key={idx} className="grid grid-cols-2 gap-4">
                        {pair.length === 2 ? (
                            <>
                                <div>{pair[0]}</div>
                                <div>{pair[1]}</div>
                            </>
                        ) : (
                            <div className="col-span-2">{pair[0]}</div>
                        )}
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6 relative overflow-y-auto max-h-[90vh] scrollbar-hide">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 hover:bg-gray-200 px-1 py-1 rounded"
                    aria-label="Close"
                >
                    <XMarkIcon className="h-4 w-4" />
                </button>

                <h2 className="text-lg font-semibold mb-4">{editingJob ? "Edit Job" : "Post a Job"}</h2>

                <div className="bg-blue-50 text-gray-700 border border-blue-200 p-4 rounded-md mb-4">
                    <p className="mb-1 font-semibold text-sm">Post your latest job, project, audition, event, or even a fundraising campaign so your community can easily find it and support what you’re working on</p>
                </div>

                {error && <div className="text-sm text-red-600 mb-3">{error}</div>}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <FieldRow>
                        <div>
                            <label className="text-xs font-medium">Job Title</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior Flutter Developer" className="w-full border rounded-md p-2 mt-1 text-xs form-input" required disabled={loading} />
                        </div>

                        <div>
                            <label className="text-xs font-medium">Company</label>
                            <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company name" className="w-full border rounded-md p-2 mt-1 text-xs form-input" required disabled={loading} />
                        </div>
                    </FieldRow>

                    <FieldRow>
                        <div>
                            <label className="text-xs font-medium">Location</label>
                            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, State or Remote" className="w-full border rounded-md p-2 mt-1 text-xs form-input" disabled={loading} />
                        </div>

                        <div>
                            <label className="text-xs font-medium">Schedule</label>
                            <CustomDropdown options={scheduleOptions} value={scheduleType} setValue={(label) => setScheduleType(label)} />
                        </div>
                    </FieldRow>

                    <div>
                        <label className="text-xs font-medium">Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Full job description, responsibilities, expectations..." className="w-full border rounded-md p-2 mt-1 text-xs form-input" rows="5" required disabled={loading} />
                    </div>

                    <FieldRow>
                        <div>
                            <CustomDropdown
                                label="Category"
                                options={categoryOptions.map((c) => c.name)}
                                value={category?.name ?? "Select Category"}
                                setValue={(label) => {
                                    const c = categoryOptions.find((x) => x.name === label);
                                    setCategory(c || null);
                                    setSubcategories([]);
                                }}
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium">Subcategories</label>
                            <MultiSelectDropdown options={currentSubOptions} value={subcategories} setValue={setSubcategories} placeholder="Select subcategories" disabled={!category} />
                        </div>

                        <div>
                            <label className="text-xs font-medium">Submission Due Date</label>
                            <input type="date" value={submissionDueDate} onChange={(e) => setSubmissionDueDate(e.target.value)} className="w-full border rounded-md p-2 mt-1 text-xs form-input" />
                        </div>
                    </FieldRow>

                    <FieldRow>
                        <div>
                            <label className="text-xs font-medium">Age Range</label>
                            <MultiSelectDropdown options={ageRangeOptions} value={ageRange} setValue={setAgeRange} placeholder="Select age ranges" />
                        </div>

                        <div>
                            <label className="text-xs font-medium">Industry Type</label>
                            <MultiSelectDropdown options={industryOptions} value={industryType} setValue={setIndustryType} placeholder="Select industries" />
                        </div>

                        <div>
                            <label className="text-xs font-medium">Unique Skills</label>
                            <MultiSelectDropdown options={skillsOptions} value={uniqueSkills} setValue={setUniqueSkills} placeholder="Pick or type skills" />
                        </div>
                    </FieldRow>

                    <FieldRow>
                        <div>
                            <label className="text-xs font-medium">Project Type</label>
                            <MultiSelectDropdown options={projectTypeOptions} value={projectType} setValue={setProjectType} placeholder="Select project types" />
                        </div>

                        <div>
                            <label className="text-xs font-medium">Industry & Trade Unions</label>
                            <MultiSelectDropdown options={unionsOptions} value={industryAndUnions} setValue={setIndustryAndUnions} placeholder="Select unions" />
                        </div>

                        <div>
                            <label className="text-xs font-medium">Cultural / Racial / Ethnicity Identifiers</label>
                            <MultiSelectDropdown options={culturalOptions} value={culturalIdentifiers} setValue={setCulturalIdentifiers} placeholder="Select identifiers" />
                        </div>
                    </FieldRow>

                    <FieldRow>
                        <div>
                            <label className="text-xs font-medium">Gender & Other Self Identifiers</label>
                            <MultiSelectDropdown options={genderOptions} value={genderIdentifiers} setValue={setGenderIdentifiers} placeholder="Select identifiers" />
                        </div>

                        <div>
                            <label className="text-xs font-medium">Select Skills</label>
                            <MultiSelectDropdown options={skillsOptions} value={selectSkills} setValue={setSelectSkills} placeholder="Select skills" />
                        </div>

                        <div>
                            <label className="text-xs font-medium">Select degree focus</label>
                            <MultiSelectDropdown options={degreeOptions} value={degreeFocus} setValue={setDegreeFocus} placeholder="Select degrees" />
                        </div>
                    </FieldRow>

                    <FieldRow>
                        <div>
                            <label className="text-xs font-medium">Salary / Rate</label>
                            <input type="text" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="e.g. $40/hr or ₹50,000/mo" className="w-full border rounded-md p-2 mt-1 text-xs form-input" disabled={loading} />
                        </div>

                        <div>
                            <label className="text-xs font-medium">Source / Via</label>
                            <input type="text" value={via} onChange={(e) => setVia(e.target.value)} placeholder="e.g. Indeed, Company site" className="w-full border rounded-md p-2 mt-1 text-xs form-input" disabled={loading} />
                        </div>
                    </FieldRow>

                    <div>
                        <label className="text-xs font-medium">Remote type</label>
                        <CustomDropdown options={remoteOptions} value={remoteType} setValue={(label) => setRemoteType(label)} />
                    </div>

                    {/* Apply options */}
                    <div>
                        <label className="text-xs font-medium">Apply links</label>
                        <p className="text-[11px] text-gray-500 mb-2">Add one or more links where candidates can apply</p>
                        <div className="space-y-2">
                            {applyOptions.map((opt, idx) => (
                                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                                    <input className="col-span-4 border rounded-md p-2 text-xs form-input" value={opt.title} onChange={(e) => updateApplyOption(idx, "title", e.target.value)} placeholder="Label (e.g. Indeed)" disabled={loading} />
                                    <input className="col-span-7 border rounded-md p-2 text-xs form-input" value={opt.link} onChange={(e) => updateApplyOption(idx, "link", e.target.value)} placeholder="https://apply.link" disabled={loading} />
                                    <button type="button" onClick={() => removeApplyOption(idx)} className="col-span-1 text-xs hover:bg-gray-200 h-6 w-6 rounded text-center items-center flex justify-center" disabled={loading || applyOptions.length === 1}>
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                            <button type="button" onClick={addApplyOption} className="text-xs text-teal-600 mt-1">+ Add another link</button>
                        </div>
                    </div>

                    {/* Highlights area */}
                    <FieldRow>
                        <div>
                            <label className="text-xs font-medium">Qualifications</label>
                            <textarea value={qualifications} onChange={(e) => setQualifications(e.target.value)} placeholder="Comma or newline separated items" className="w-full border rounded-md p-2 mt-1 text-xs form-input" rows={3} disabled={loading} />
                        </div>

                        <div>
                            <label className="text-xs font-medium">Benefits</label>
                            <textarea value={benefits} onChange={(e) => setBenefits(e.target.value)} placeholder="Health, 401k, etc." className="w-full border rounded-md p-2 mt-1 text-xs form-input" rows={3} disabled={loading} />
                        </div>

                        <div>
                            <label className="text-xs font-medium">Responsibilities</label>
                            <textarea value={responsibilities} onChange={(e) => setResponsibilities(e.target.value)} placeholder="Key responsibilities (bullet lines)" className="w-full border rounded-md p-2 mt-1 text-xs form-input" rows={3} disabled={loading} />
                        </div>
                    </FieldRow>

                    {/* checkboxes */}
                    <FieldRow>
                        <label className="flex items-center gap-2 text-xs">
                            <input type="checkbox" checked={postAnonymously} onChange={(e) => setPostAnonymously(e.target.checked)} />
                            <span>Post anonymously to prevent freelancers from seeing your name or company</span>
                        </label>

                        <label className="flex items-center gap-2 text-xs">
                            <input type="checkbox" checked={postPrivately} onChange={(e) => setPostPrivately(e.target.checked)} />
                            <span>Post this job privately?</span>
                        </label>

                        <label className="flex items-center gap-2 text-xs">
                            <input type="checkbox" checked={hireMultiple} onChange={(e) => setHireMultiple(e.target.checked)} />
                            <span>Hire multiple people for this role?</span>
                        </label>
                    </FieldRow>

                    <div className="flex justify-center gap-3 pt-2">
                        <button type="button" onClick={() => setIsOpen(false)} className={clsx("flex-1 px-4 py-2 font-semibold border rounded-md text-xs hover:bg-gray-50", { "opacity-50 pointer-events-none": loading })}>Cancel</button>
                        <button type="submit" className={clsx("flex-1 px-4 py-2 font-semibold bg-teal-500 text-white rounded-md text-xs hover:bg-teal-600", { "opacity-60 pointer-events-none": loading })}>{loading ? (editingJob ? "Saving..." : "Publishing...") : (editingJob ? "Save" : "Post Job")}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
