import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState, useRef } from "react";
import CustomDropdown from "../components/CustomDropdown";
import clsx from "clsx";
import toast from "react-hot-toast";
import { X } from "lucide-react";

import MultiSelectDropdown from "../components/MultiSelectDropdown";
import { getCategory, getSubCategory, postJob } from "../Hooks/useSeller";

export default function PostJobPopupModal({ isOpen, setIsOpen, editingJob, onSaved }) {

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

    const [category, setCategory] = useState(null);
    const [subcategories, setSubcategories] = useState([]);
    const [submissionDueDate, setSubmissionDueDate] = useState("");
    const [ageRange, setAgeRange] = useState([]);
    const [industryType, setIndustryType] = useState([]);
    const [uniqueSkills, setUniqueSkills] = useState([]);
    const [projectType, setProjectType] = useState([]);
    const [industryAndUnions, setIndustryAndUnions] = useState([]);
    const [culturalIdentifiers, setCulturalIdentifiers] = useState([]);
    const [genderIdentifiers, setGenderIdentifiers] = useState([]);
    const [selectSkills, setSelectSkills] = useState([]);
    const [degreeFocus, setDegreeFocus] = useState([]);
    const [postAnonymously, setPostAnonymously] = useState(false);
    const [postPrivately, setPostPrivately] = useState(false);
    const [hireMultiple, setHireMultiple] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [skillsList, setSkillsList] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [subcategoriesByCategory, setSubcategoriesByCategory] = useState({});
    const [skillsLoading, setSkillsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => (document.body.style.overflow = "");
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        let alive = true;

        setSkillsLoading(true);

        const normalizeCategoryResponse = (raw) => {
            if (!raw) return [];
            if (Array.isArray(raw)) {
                return raw.map((c) => ({ id: String(c.id ?? c.value ?? c.key ?? ""), name: c.name ?? c.title ?? c.label ?? String(c) }));
            }
            return Object.entries(raw).map(([k, v]) => ({ id: String(k), name: String(v) }));
        };

        const normalizeSubcategoryResponse = (raw) => {
            if (!raw) return [];
            if (Array.isArray(raw)) {
                return raw.map((s) => ({
                    id: String(s.id ?? s.value ?? s.key ?? ""),
                    name: s.name ?? s.title ?? s.label ?? String(s),
                    slug: s.slug ?? null,
                }));
            }
            return Object.entries(raw).map(([k, v]) => ({
                id: String(k),
                name: String(v),
                slug: null,
            }));
        };

        (async () => {
            try {
                const catsRaw = await getCategory();
                if (!alive) return;

                const categories = normalizeCategoryResponse(catsRaw);
                setCategoryOptions(categories);

                const subcatsPromises = categories.map((cat) =>
                    getSubCategory(cat.id)
                        .then((scRaw) => ({ cat, subcats: normalizeSubcategoryResponse(scRaw) }))
                        .catch((err) => {
                            console.warn(`Failed to load subcategories for category ${cat.id}`, err);
                            return { cat, subcats: [] };
                        })
                );

                const subcatsResults = await Promise.all(subcatsPromises);
                if (!alive) return;

                const byCat = {};
                const flattened = [];

                subcatsResults.forEach(({ cat, subcats }) => {
                    const catName = cat?.name ?? "Uncategorized";
                    byCat[catName] = subcats.map((s) => ({
                        id: s.id,
                        name: s.name,
                        slug: s.slug ?? null,
                    }));

                    subcats.forEach((s) => {
                        flattened.push({
                            id: s.id,
                            name: s.name,
                            slug: s.slug ?? null,
                            category: { id: cat.id, name: cat.name },
                        });
                    });
                });

                setSubcategoriesByCategory(byCat);
                setSkillsList(flattened);
            } catch (err) {
                console.warn("Failed to fetch categories/subcategories:", err);
                if (!alive) return;
                setSkillsList([]);
                setCategoryOptions([]);
                setSubcategoriesByCategory({});
            } finally {
                if (!alive) return;
                setSkillsLoading(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, [isOpen]);

    const ageRangeOptions = [
        { id: "Adult(30-50's)", name: "Adult(30-50's)" },
        { id: "Teenager", name: "Teenager" },
        { id: "Adult(50-65ish)", name: "Adult(30-65ish)" },
        { id: "Adult(Over 65ish)", name: "Adult(Over 65ish)" },
        { id: "Baby(under 2)", name: "Baby(under 2)" },
        { id: "Child(5-10)", name: "Child(5-10)" },
        { id: "Child/ Pre-teen(10-13)", name: "Child/ Pre-teen(10-13)" },
        { id: "Not Important", name: "Not Important" },
        { id: "Toddler(2-5)", name: "Toddler(2-5)" },
        { id: "Young Adult(through 20's)", name: "Young Adult(through 20's)" },
        { id: "21+", name: "21+" },
    ];

    const industryOptions = [
        { id: "Animation", name: "Animation" },
        { id: "Commercial", name: "Commercial" },
        { id: "Concerts", name: "Concerts" },
        { id: "Corporate Events", name: "Corporate Events" },
        { id: "Cultural Events", name: "Cultural Events" },
        { id: "Digital Arts", name: "Digital Arts" },
        { id: "Educational Theater", name: "Educational Theater" },
        { id: "Fashion+Costume Design", name: "Fashion+Costume Design" },
        { id: "Film", name: "Film" },
        { id: "Fine Art", name: "Fine Art" },
        { id: "Hair+Make-Up", name: "Hair+Make-Up" },
        { id: "Independent Projects", name: "Independent Projects" },
        { id: "Industry Services", name: "Industry Services" },
        { id: "Live Stage Events", name: "Live Stage Events" },
        { id: "Magazine / Print", name: "Magazine / Print" },
        { id: "Music Video", name: "Music Video" },
        { id: "Musicals", name: "Musicals" },
        { id: "Post-Production", name: "Post-Production" },
        { id: "Production Studio", name: "Production Studio" },
        { id: "Special Effects", name: "Special Effects" },
        { id: "Television", name: "Television" },
        { id: "Theatre", name: "Theatre" },
        { id: "Industry and Trade Unions", name: "Industry and Trade Unions" },
        { id: "Education", name: "Education" },
        { id: "Healthcare", name: "Healthcare" }
    ];

    const skillsOptions = [
        { id: "Tightrope Walker", name: "Tightrope Walker" },
        { id: "Stunt Man", name: "Stunt Man" },
        { id: "Juggler", name: "Juggler" },
        { id: "Ventriloquist", name: "Ventriloquist" },
        { id: "Acrobat", name: "Acrobat" },
        { id: "Athlete", name: "Athlete" },
        { id: "Soccer", name: "Soccer" },
        { id: "Basketball", name: "Basketball" },
        { id: "Baseball", name: "Baseball" },
        { id: "Football", name: "Football" },
        { id: "Gymnast", name: "Gymnast" },
        { id: "Stage Combat", name: "Stage Combat" },
        { id: "Fencing", name: "Fencing" },
        { id: "Martial Arts", name: "Martial Arts" },
        { id: "Magician", name: "Magician" },
        { id: "Aerialist", name: "Aerialist" },
        { id: "Boxer", name: "Boxer" },
        { id: "Animal Trainer", name: "Animal Trainer" },
        { id: "Trapeze Artist", name: "Trapeze Artist" },
        { id: "Impersonator", name: "Impersonator" },
    ];

    const projectTypeOptions = [
        { id: "Job - paid", name: "Job - paid" },
        { id: "Job - unpaid", name: "Job - unpaid" },
        { id: "Audition", name: "Audition" },
        { id: "Casting Call", name: "Casting Call" },
        { id: "Collaborative Project", name: "Collaborative Project" },
        { id: "Commercial / Corporate", name: "Commercial / Corporate" },
        { id: "Independent Production", name: "Independent Production" },
        { id: "Donors and Gifts", name: "Donors and Gifts" },
        { id: "Internship", name: "Internship" },
        { id: "Live Event or Showcase", name: "Live Event or Showcase" },
        { id: "Non-Union", name: "Non-Union" },
        { id: "Union", name: "Union" },
        { id: "Crowdfunding Project", name: "Crowdfunding Project" },
        { id: "Student Project", name: "Student Project" },
    ];

    const unionsOptions = [
        { id: "AEA", name: "AEA" },
        { id: "AFM", name: "AFM" },
        { id: "AGMA", name: "AGMA" },
        { id: "AMPTP", name: "AMPTP" },
        { id: "ASCAP", name: "ASCAP" },
        { id: "ATA", name: "ATA" },
        { id: "DGA", name: "DGA" },
        { id: "IATSE", name: "IATSE" },
        { id: "Other - Not Listed", name: "Other - Not Listed" },
        { id: "PGA", name: "PGA" },
        { id: "SAG-AFTRA", name: "SAG-AFTRA" },
        { id: "UMAW", name: "UMAW" },
        { id: "WGA", name: "WGA" },
        { id: "Other", name: "Other" }
    ];

    const genderOptions = [
        { id: "LGBTQ+", name: "LGBTQ+" },
        { id: "Disabled", name: "Disabled" },
        { id: "Autism Spectrum Disorder", name: "Autism Spectrum Disorder" },
        { id: "Deaf", name: "Deaf" },
        { id: "Blind", name: "Blind" },
        { id: "Gender - Female", name: "Gender - Female" },
        { id: "Gender - Fluid", name: "Gender - Fluid" },
        { id: "Gender - Male", name: "Gender - Male" },
        { id: "Gender - Neutral", name: "Gender - Neutral" },
        { id: "Please add more options", name: "Please add more options" },
        { id: "Prefer not to answer", name: "Prefer not to answer" },
        { id: "Pronouns - He/His", name: "Pronouns - He/His" },
        { id: "Pronouns - She/Her", name: "Pronouns - She/Her" },
        { id: "Pronouns - They/Them", name: "Pronouns - They/Them" },
        { id: "Transgender", name: "Transgender" },
        { id: "Veteran", name: "Veteran" },
        { id: "Other", name: "Other" }
    ];

    const degreeOptions = [
        // --- Art, Design & Media ---
        { id: "Art, Design & Media", name: "Art, Design & Media" },
        { id: "Acting, Theatre & Dance", name: "Acting, Theatre & Dance" },
        { id: "Architecture", name: "Architecture" },
        { id: "Art History", name: "Art History" },
        { id: "Communication Design", name: "Communication Design" },
        { id: "Design", name: "Design" },
        { id: "Fashion", name: "Fashion" },
        { id: "Film & TV", name: "Film & TV" },
        { id: "Fine Arts", name: "Fine Arts" },
        { id: "Game Design", name: "Game Design" },
        { id: "Graphic Design", name: "Graphic Design" },
        { id: "Industrial Design", name: "Industrial Design" },
        { id: "Interior Design", name: "Interior Design" },
        { id: "Journalism", name: "Journalism" },
        { id: "Music", name: "Music" },
        { id: "Photography", name: "Photography" },
        { id: "Product Design", name: "Product Design" },
        { id: "Visual Arts", name: "Visual Arts" },

        // --- Business & Management ---
        { id: "Business & Management", name: "Business & Management" },
        { id: "Accounting", name: "Accounting" },
        { id: "Business Administration", name: "Business Administration" },
        { id: "Business Analytics & Business Intelligence", name: "Business Analytics & Business Intelligence" },
        { id: "Corporate Communication & PR", name: "Corporate Communication & PR" },
        { id: "Corporate Social Responsibility", name: "Corporate Social Responsibility" },
        { id: "Entrepreneurship", name: "Entrepreneurship" },
        { id: "Executive MBA", name: "Executive MBA" },
        { id: "Finance", name: "Finance" },
        { id: "Hospitality, Leisure & Tourism", name: "Hospitality, Leisure & Tourism" },
        { id: "Human Resource Management", name: "Human Resource Management" },
        { id: "Innovation Management", name: "Innovation Management" },
        { id: "International Business", name: "International Business" },
        { id: "Marketing", name: "Marketing" },
        { id: "Master in Management (MIM)", name: "Master in Management (MIM)" },
        { id: "Master of Business Administration (MBA)", name: "Master of Business Administration (MBA)" },
        { id: "Organisation & Leadership", name: "Organisation & Leadership" },
        { id: "Project Management", name: "Project Management" },
        { id: "Public Administration", name: "Public Administration" },
        { id: "Real Estate", name: "Real Estate" },
        { id: "Risk Management", name: "Risk Management" },
        { id: "Strategic Management", name: "Strategic Management" },
        { id: "Supply Chain Management & Logistics", name: "Supply Chain Management & Logistics" },
        { id: "Technology Management", name: "Technology Management" },

        // --- Computer Science & IT ---
        { id: "Computer Science & IT", name: "Computer Science & IT" },
        { id: "Artificial Intelligence", name: "Artificial Intelligence" },
        { id: "Business Information Systems", name: "Business Information Systems" },
        { id: "Computer Science", name: "Computer Science" },
        { id: "Data Science & Big Data", name: "Data Science & Big Data" },
        { id: "Game Development", name: "Game Development" },
        { id: "Health Informatics", name: "Health Informatics" },
        { id: "Human Computer Interaction", name: "Human Computer Interaction" },
        { id: "Informatics", name: "Informatics" },
        { id: "Software Engineering", name: "Software Engineering" },

        // --- Engineering & Technology ---
        { id: "Engineering & Technology", name: "Engineering & Technology" },
        { id: "Automotive Engineering", name: "Automotive Engineering" },
        { id: "Aviation & Aeronautical Engineering", name: "Aviation & Aeronautical Engineering" },
        { id: "Bioengineering & Biotechnology", name: "Bioengineering & Biotechnology" },
        { id: "Biomedical Engineering", name: "Biomedical Engineering" },
        { id: "Chemical Engineering", name: "Chemical Engineering" },
        { id: "Civil Engineering & Construction", name: "Civil Engineering & Construction" },
        { id: "Electrical Engineering", name: "Electrical Engineering" },
        { id: "Electronics & Embedded Technology", name: "Electronics & Embedded Technology" },
        { id: "Energy & Power Engineering", name: "Energy & Power Engineering" },
        { id: "Environmental Engineering", name: "Environmental Engineering" },
        { id: "Industrial & Systems Engineering", name: "Industrial & Systems Engineering" },
        { id: "Manufacturing Engineering", name: "Manufacturing Engineering" },
        { id: "Marine Engineering", name: "Marine Engineering" },
        { id: "Materials Science & Engineering", name: "Materials Science & Engineering" },
        { id: "Mechanical Engineering", name: "Mechanical Engineering" },
        { id: "Mechatronics", name: "Mechatronics" },
        { id: "Mining, Oil & Gas", name: "Mining, Oil & Gas" },
        { id: "Robotics", name: "Robotics" },
        { id: "Sustainable Energy", name: "Sustainable Energy" },
        { id: "Telecommunication", name: "Telecommunication" },

        // --- Environment & Agriculture ---
        { id: "Environment & Agriculture", name: "Environment & Agriculture" },
        { id: "Agriculture", name: "Agriculture" },
        { id: "Climate & Meteorology", name: "Climate & Meteorology" },
        { id: "Ecology", name: "Ecology" },
        { id: "Environmental Management", name: "Environmental Management" },
        { id: "Environmental Sciences", name: "Environmental Sciences" },
        { id: "Forestry", name: "Forestry" },
        { id: "Geology", name: "Geology" },
        { id: "Natural Resource Management", name: "Natural Resource Management" },
        { id: "Plant & Crop Sciences", name: "Plant & Crop Sciences" },
        { id: "Sustainable Development", name: "Sustainable Development" },

        // --- Humanities ---
        { id: "Humanities", name: "Humanities" },
        { id: "Ancient History", name: "Ancient History" },
        { id: "Archaeology", name: "Archaeology" },
        { id: "Creative Writing", name: "Creative Writing" },
        { id: "History", name: "History" },
        { id: "Languages", name: "Languages" },
        { id: "Liberal Arts", name: "Liberal Arts" },
        { id: "Linguistics", name: "Linguistics" },
        { id: "Literature", name: "Literature" },
        { id: "Modern History", name: "Modern History" },
        { id: "Philosophy & Ethics", name: "Philosophy & Ethics" },
        { id: "Religion & Theology", name: "Religion & Theology" },

        // --- Law ---
        { id: "Law", name: "Law" },
        { id: "Bachelor of Laws (LLB)", name: "Bachelor of Laws (LLB)" },
        { id: "Civil Law & Private Law", name: "Civil Law & Private Law" },
        { id: "Commercial Law & Business Law", name: "Commercial Law & Business Law" },
        { id: "Criminal Law", name: "Criminal Law" },
        { id: "European Law", name: "European Law" },
        { id: "Intellectual Property Law", name: "Intellectual Property Law" },
        { id: "International Law", name: "International Law" },
        { id: "Legal Studies", name: "Legal Studies" },
        { id: "Master of Laws (LLM)", name: "Master of Laws (LLM)" },
        { id: "Patent Law", name: "Patent Law" },
        { id: "Public Law", name: "Public Law" },

        // --- Medicine & Health ---
        { id: "Medicine & Health", name: "Medicine & Health" },
        { id: "Biomedicine", name: "Biomedicine" },
        { id: "Dentistry", name: "Dentistry" },
        { id: "Health Management", name: "Health Management" },
        { id: "Human Medicine", name: "Human Medicine" },
        { id: "Midwifery", name: "Midwifery" },
        { id: "Nursing", name: "Nursing" },
        { id: "Nutrition & Dietetics", name: "Nutrition & Dietetics" },
        { id: "Pharmacy", name: "Pharmacy" },
        { id: "Physiotherapy", name: "Physiotherapy" },
        { id: "Public Health", name: "Public Health" },
        { id: "Sports", name: "Sports" },
        { id: "Toxicology", name: "Toxicology" },
        { id: "Veterinary Medicine", name: "Veterinary Medicine" },

        // --- Natural Sciences & Mathematics ---
        { id: "Natural Sciences & Mathematics", name: "Natural Sciences & Mathematics" },
        { id: "Applied Mathematics", name: "Applied Mathematics" },
        { id: "Astronomy", name: "Astronomy" },
        { id: "Biology", name: "Biology" },
        { id: "Chemistry", name: "Chemistry" },
        { id: "Financial Mathematics", name: "Financial Mathematics" },
        { id: "Mathematics", name: "Mathematics" },
        { id: "Molecular Sciences", name: "Molecular Sciences" },
        { id: "Natural Sciences", name: "Natural Sciences" },
        { id: "Physics", name: "Physics" },
        { id: "Statistics", name: "Statistics" },

        // --- Social Sciences ---
        { id: "Social Sciences", name: "Social Sciences" },
        { id: "Anthropology", name: "Anthropology" },
        { id: "Criminology", name: "Criminology" },
        { id: "Econometrics", name: "Econometrics" },
        { id: "Economics", name: "Economics" },
        { id: "Education & Teaching", name: "Education & Teaching" },
        { id: "Ethnology", name: "Ethnology" },
        { id: "European Studies", name: "European Studies" },
        { id: "Gender Studies", name: "Gender Studies" },
        { id: "Geography", name: "Geography" },
        { id: "International Development", name: "International Development" },
        { id: "International Relations", name: "International Relations" },
        { id: "Politics & Political Science", name: "Politics & Political Science" },
        { id: "Psychology", name: "Psychology" },
        { id: "Public Policy", name: "Public Policy" },
        { id: "Social Work", name: "Social Work" },
        { id: "Sociology", name: "Sociology" }
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

            if (editingJob.category) {
                const cat = categoryOptions.find((c) => c.id === editingJob.category || c.name === editingJob.category);
                if (cat) setCategory(cat);
                else setCategory({ id: editingJob.category, name: editingJob.category });
            }

            if (editingJob.subcategories) {
                const items = editingJob.subcategories.map((s) => {
                    if (typeof s === "object") return { id: s.id ?? s, name: s.name ?? s };
                    return { id: s, name: s };
                });
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
    }, [isOpen, editingJob, categoryOptions]);

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

    const idsFromSelected = (arr) => (Array.isArray(arr) ? arr.map((x) => (x?.id ?? x?.name ?? x)) : []);
    const namesFromSelected = (arr) => (Array.isArray(arr) ? arr.map((x) => (x?.name ?? x)) : []);

    function guessRateType(rateStr) {
        if (!rateStr) return undefined;
        const s = String(rateStr).toLowerCase();
        if (s.includes("hr") || s.includes("/hr") || s.includes("hour")) return "hourly";
        if (s.includes("mo") || s.includes("month") || s.includes("/mo")) return "monthly";
        if (s.includes("yr") || s.includes("year") || s.includes("/yr") || s.includes("annual")) return "yearly";
        const digits = s.replace(/[^\d]/g, "");
        if (digits && digits.length >= 5) return "yearly";
        return undefined;
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
            // Build payload to match your example payload structure
            const payload = {
                title: title,
                company_name: companyName,
                location: location,
                schedule_type: scheduleType,
                description: description,
                category: category ? [category.id ?? category.name ?? category] : undefined,
                sub_category: subcategories && subcategories.length ? subcategories.map((s) => s.id ?? s) : undefined,
                posted_at: postedAt || undefined,
                submission_due_date: submissionDueDate || undefined,
                industry_type: industryType && industryType.length ? namesFromSelected(industryType) : undefined,
                unique_skills: uniqueSkills && uniqueSkills.length ? namesFromSelected(uniqueSkills) : undefined,
                project_type: projectType && projectType.length ? namesFromSelected(projectType) : undefined,
                trade_unions: industryAndUnions && industryAndUnions.length ? namesFromSelected(industryAndUnions) : undefined,
                cultural_identifiers: Array.isArray(culturalIdentifiers) && culturalIdentifiers.length ? culturalIdentifiers : (culturalIdentifiers || undefined),
                skills: selectSkills && selectSkills.length ? namesFromSelected(selectSkills) : undefined,
                degree_focus: degreeFocus && degreeFocus.length ? namesFromSelected(degreeFocus) : undefined,
                rate: salary || undefined,
                rate_type: guessRateType(salary) || undefined,
                via: via || undefined,
                location_type: remoteType ? (remoteType.toLowerCase() === "remote" ? "remote" : remoteType.toLowerCase()) : undefined,
                apply_options: applyOptions.filter((a) => a.link && a.link.trim()).map((a) => ({ title: a.title || "", link: a.link })),
                qualifications: qualifications || undefined,
                benefit: benefits || undefined,
                responsibility: responsibilities || undefined,
                age_range: ageRange && ageRange.length ? idsFromSelected(ageRange) : undefined,
                gender: genderIdentifiers && genderIdentifiers.length ? idsFromSelected(genderIdentifiers) : undefined,
                anonymous_posting: !!postAnonymously,
                post_privately: !!postPrivately,
                hire_multiple: !!hireMultiple,
            };

            Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);

            let res;
            if (editingJob && editingJob.id) {
                throw new Error("Editing existing jobs is not wired to update API in this component. Implement updateJob(editingJob.id, payload).");
            } else {
                res = await postJob(payload);
            }
            toast.success("Job saved!");
            await onSaved?.(res);
            setIsOpen(false);

        } catch (err) {
            console.error(err);
            setError(err?.message || t("job_form.errors.save_failed") || "Failed to save job");
        } finally {
            setLoading(false);
        }
    }

    const currentSubOptions = category ? (subcategoriesByCategory[category.name] ?? []) : [];

    const handleClose = () => {
        setIsOpen?.(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6 relative overflow-y-auto max-h-[90vh] scrollbar-hide">
                <button
                    onClick={handleClose}
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

                    {/* Job Title + Company (two columns) */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium">Job Title</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior Flutter Developer" className="w-full border rounded-md p-2 mt-1 text-xs form-input" required disabled={loading} />
                        </div>

                        <div>
                            <label className="text-xs font-medium">Company</label>
                            <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company name" className="w-full border rounded-md p-2 mt-1 text-xs form-input" required disabled={loading} />
                        </div>
                    </div>

                    {/* Location + Schedule (two columns) */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium">Location</label>
                            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, State or Remote" className="w-full border rounded-md p-2 mt-1 text-xs form-input" disabled={loading} />
                        </div>

                        <div>
                            <label className="text-xs font-medium">Schedule</label>
                            <CustomDropdown options={scheduleOptions} value={scheduleType} setValue={(label) => setScheduleType(label)} />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-medium">Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Full job description, responsibilities, expectations..." className="w-full border rounded-md p-2 mt-1 text-xs form-input" rows="5" required disabled={loading} />
                    </div>

                    {/* Category + Subcategories (side-by-side) + Submission Due Date (full width) */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <CustomDropdown
                                    label="Category"
                                    options={categoryOptions.length ? categoryOptions.map((c) => c.name) : ["Select Category"]}
                                    value={category?.name ?? "Select Category"}
                                    setValue={(label) => {
                                        const c = categoryOptions.find((x) => x.name === label);
                                        setCategory(c || { id: null, name: label });
                                        setSubcategories([]);
                                    }}
                                />
                                {skillsLoading && <p className="text-[11px] text-gray-400 mt-1">Loading categories…</p>}
                            </div>

                            <div>
                                <label className="text-xs font-medium">Subcategories</label>
                                <MultiSelectDropdown options={currentSubOptions} value={subcategories} setValue={setSubcategories} placeholder={category ? "Select subcategories" : "Pick a category first"} disabled={!category || skillsLoading} />
                                {!category && <p className="text-[11px] text-gray-400 mt-1">Select a category to choose subcategories</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="text-xs font-medium">Submission Due Date</label>
                                <input type="date" value={submissionDueDate} onChange={(e) => setSubmissionDueDate(e.target.value)} className="w-full border rounded-md p-2 mt-1 text-xs form-input" />
                            </div>
                        </div>
                    </div>

                    {/* Age Range / Industry Type / Unique Skills */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-medium">Age Range</label>
                                <MultiSelectDropdown options={ageRangeOptions} value={ageRange} setValue={setAgeRange} placeholder="Select age ranges" />
                            </div>

                            <div>
                                <label className="text-xs font-medium">Industry Type</label>
                                <MultiSelectDropdown options={industryOptions} value={industryType} setValue={setIndustryType} placeholder="Select industries" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="text-xs font-medium">Unique Skills</label>
                                <MultiSelectDropdown options={skillsOptions} value={uniqueSkills} setValue={setUniqueSkills} placeholder="Pick or type skills" />
                            </div>
                        </div>
                    </div>

                    {/* Project Type / Industry & Unions / Cultural Identifiers */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-medium">Project Type</label>
                                <MultiSelectDropdown options={projectTypeOptions} value={projectType} setValue={setProjectType} placeholder="Select project types" />
                            </div>

                            <div>
                                <label className="text-xs font-medium">Industry & Trade Unions</label>
                                <MultiSelectDropdown options={unionsOptions} value={industryAndUnions} setValue={setIndustryAndUnions} placeholder="Select unions" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="text-xs font-medium">Cultural / Racial / Ethnicity Identifiers</label>
                                <input type="text" value={culturalIdentifiers} onChange={(e) => setCulturalIdentifiers(e.target.value)} placeholder="Enter identifiers" className="w-full border rounded-md p-2 mt-1 text-xs form-input" disabled={loading} />
                            </div>
                        </div>
                    </div>

                    {/* Gender / Select Skills / Degree Focus */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-medium">Gender & Other Self Identifiers</label>
                                <MultiSelectDropdown options={genderOptions} value={genderIdentifiers} setValue={setGenderIdentifiers} placeholder="Select identifiers" />
                            </div>

                            <div>
                                <label className="text-xs font-medium">Select Skills</label>
                                <MultiSelectDropdown options={skillsOptions} value={selectSkills} setValue={setSelectSkills} placeholder="Select skills" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="text-xs font-medium">Select degree focus</label>
                                <MultiSelectDropdown options={degreeOptions} value={degreeFocus} setValue={setDegreeFocus} placeholder="Select degrees" />
                            </div>
                        </div>
                    </div>

                    {/* Salary / Source */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium">Salary / Rate</label>
                            <input type="text" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="e.g. $40/hr or ₹50,000/mo" className="w-full border rounded-md p-2 mt-1 text-xs form-input" disabled={loading} />
                        </div>

                        <div>
                            <label className="text-xs font-medium">Source / Via</label>
                            <input type="text" value={via} onChange={(e) => setVia(e.target.value)} placeholder="e.g. Indeed, Company site" className="w-full border rounded-md p-2 mt-1 text-xs form-input" disabled={loading} />
                        </div>
                    </div>

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

                    {/* Highlights area (Qualifications / Benefits / Responsibilities) */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-medium">Qualifications</label>
                                <textarea value={qualifications} onChange={(e) => setQualifications(e.target.value)} placeholder="Comma or newline separated items" className="w-full border rounded-md p-2 mt-1 text-xs form-input" rows={3} disabled={loading} />
                            </div>

                            <div>
                                <label className="text-xs font-medium">Benefits</label>
                                <textarea value={benefits} onChange={(e) => setBenefits(e.target.value)} placeholder="Health, 401k, etc." className="w-full border rounded-md p-2 mt-1 text-xs form-input" rows={3} disabled={loading} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="text-xs font-medium">Responsibilities</label>
                                <textarea value={responsibilities} onChange={(e) => setResponsibilities(e.target.value)} placeholder="Key responsibilities (bullet lines)" className="w-full border rounded-md p-2 mt-1 text-xs form-input" rows={3} disabled={loading} />
                            </div>
                        </div>
                    </div>

                    {/* checkboxes (three items) */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="flex items-center gap-2 text-xs">
                                    <input type="checkbox" checked={postAnonymously} onChange={(e) => setPostAnonymously(e.target.checked)} />
                                    <span>Post anonymously to prevent freelancers from seeing your name or company</span>
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="flex items-center gap-2 text-xs">
                                    <input type="checkbox" checked={postPrivately} onChange={(e) => setPostPrivately(e.target.checked)} />
                                    <span>Post this job privately?</span>
                                </label>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-xs">
                                    <input type="checkbox" checked={hireMultiple} onChange={(e) => setHireMultiple(e.target.checked)} />
                                    <span>Hire multiple people for this role?</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center gap-3 pt-2">
                        <button type="button" onClick={() => setIsOpen(false)} className={clsx("flex-1 px-4 py-2 font-semibold border rounded-md text-xs hover:bg-gray-50", { "opacity-50 pointer-events-none": loading })}>Cancel</button>
                        <button type="submit" className={clsx("flex-1 px-4 py-2 font-semibold bg-teal-500 text-white rounded-md text-xs hover:bg-teal-600", { "opacity-60 pointer-events-none": loading })}>{loading ? (editingJob ? "Saving..." : "Publishing...") : (editingJob ? "Save" : "Post Job")}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}