// // JobsOpportunities.jsx
// import { useEffect, useState, useCallback } from "react";
// import { FaArrowLeft, FaMapMarkerAlt } from "react-icons/fa";
// import { Link } from "react-router-dom";
// import ViewJobDetailsModel from "../modal/ViewJobDetailsModel";
// import ApplyJobModal from "../modal/ApplyJobModal";
// import CustomDropdown from "../components/CustomDropdown";
// import { getJobsData, getJobsDataFilters } from "../Hooks/useSeller";
// import SpinnerProvider from "../components/SpinnerProvider";

// const DEFAULT_JOB_IMAGE =
//   "https://img.myloview.com/posters/businessman-avatar-image-with-beard-hairstyle-male-profile-vector-illustration-700-201088702.jpg";

// const JobsOpportunities = () => {
//   const [filtersOptions, setFiltersOptions] = useState(null);

//   const [activeFilters, setActiveFilters] = useState({
//     category: "All Categories",
//     type: "All Types",
//     location: "All Locations",
//     location_type: "All",
//     sort_by: "Newest First",
//     keyword_search: "",
//   });

//   const [jobs, setJobs] = useState([]);
//   const [nextPageToken, setNextPageToken] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [error, setError] = useState(null);

//   const [selectedJob, setSelectedJob] = useState(null);
//   const [applyJob, setApplyJob] = useState(null);

//   useEffect(() => {
//     (async () => {
//       try {
//         const data = await getJobsDataFilters();
//         setFiltersOptions(data || {});
//         setActiveFilters((prev) => ({
//           ...prev,
//           category: "All Categories",
//           type: data?.type ? "All Types" : prev.type,
//           location: "All Locations",
//           location_type: data?.location_type ? "All" : prev.location_type,
//           sort_by: data?.sort_by ? (data.sort_by.newest_first ?? "Newest First") : prev.sort_by,
//         }));
//       } catch (err) {
//         console.error("Failed to load filters:", err);
//       }
//     })();
//   }, []);

//   const findKeyByLabel = (obj = {}, label) => {
//     if (!obj || !label) return "";
//     const entry = Object.entries(obj).find(([, v]) => String(v) === String(label));
//     return entry ? entry[0] : "";
//   };

//   const buildRequestBody = (token = null) => {
//     const categoryArr = activeFilters.category && !activeFilters.category.startsWith("All")
//       ? [activeFilters.category] : [];

//     const locationArr = activeFilters.location && !activeFilters.location.startsWith("All")
//       ? [activeFilters.location] : [];

//     const typeKey = filtersOptions?.type && activeFilters.type && !activeFilters.type.startsWith("All")
//       ? findKeyByLabel(filtersOptions.type, activeFilters.type) : "";
//     const typeArr = typeKey ? [typeKey] : [];

//     const locationTypeKey = filtersOptions?.location_type && activeFilters.location_type && !activeFilters.location_type.startsWith("All")
//       ? findKeyByLabel(filtersOptions.location_type, activeFilters.location_type) : "";
//     const locationTypeArr = locationTypeKey ? [locationTypeKey] : [];

//     const sortByKey = filtersOptions?.sort_by && activeFilters.sort_by
//       ? findKeyByLabel(filtersOptions.sort_by, activeFilters.sort_by) : "newest_first";

//     const body = {
//       keyword_search: activeFilters.keyword_search || "",
//       category: categoryArr,
//       type: typeArr,
//       location: locationArr,
//       location_type: locationTypeArr,
//       sort_by: sortByKey || "newest_first",
//       ...(token ? { next_page_token: token } : {}),
//     };

//     return body;
//   };

//   const fetchJobs = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const body = buildRequestBody(null);
//       const { jobs: fetchedJobs, next_page_token } = await getJobsData(body);
//       setJobs(fetchedJobs || []);
//       setNextPageToken(next_page_token || null);
//     } catch (err) {
//       console.error("Error fetching jobs:", err);
//       setError(err.message || "Failed to fetch jobs");
//     } finally {
//       setLoading(false);
//     }
//   }, [activeFilters, filtersOptions]);

//   const fetchMore = async () => {
//     if (!nextPageToken) return;
//     try {
//       setLoadingMore(true);
//       const body = buildRequestBody(nextPageToken);
//       const { jobs: fetchedJobs, next_page_token } = await getJobsData(body);
//       setJobs((prev) => {
//         const existingIds = new Set(prev.map((j) => j.job_id));
//         const newItems = (fetchedJobs || []).filter((j) => !existingIds.has(j.job_id));
//         return [...prev, ...newItems];
//       });
//       setNextPageToken(next_page_token || null);
//     } catch (err) {
//       console.error("Failed to load more jobs:", err);
//     } finally {
//       setLoadingMore(false);
//     }
//   };

//   useEffect(() => {
//     setJobs([]);
//     setNextPageToken(null);
//     fetchJobs();
//   }, [activeFilters, fetchJobs]);

//   const handleJobApplied = (jobId) => {
//     setJobs((prev) => prev.map((j) => (j.job_id === jobId ? { ...j, applied: true } : j)));
//     setApplyJob(null);
//     setSelectedJob((prev) => (prev?.job_id === jobId ? { ...prev, applied: true } : prev));
//   };

//   return (
//     <div className="bg-white min-h-screen w-full">
//       <div className="md:max-w-[80%] mx-auto">
//         <div className="flex items-center px-6 py-4 md:px-0">
//           <Link to="/home" className="text-black font-medium text-xs hover:bg-gray-200 rounded-md px-4 py-2 flex items-center">
//             <FaArrowLeft className="mr-2" /> Back to Home
//           </Link>
//           <h1 className="flex-1 text-center text-xl font-bold">Creative Jobs & Opportunities</h1>
//           <button className="px-4 py-2 text-xs font-semibold bg-teal-500 text-white rounded-md">
//             Google Jobs Integrated
//           </button>
//         </div>

//         {/* Search + Filters */}
//         <div className="px-6 py-4 space-y-3 border-b md:px-0">
//           <div className="flex flex-wrap gap-3">
//             <input
//               type="text"
//               placeholder="Search jobs, companies, or keywords..."
//               className="form-input px-4 py-2 rounded-md text-sm flex-1"
//               value={activeFilters.keyword_search}
//               onChange={(e) =>
//                 setActiveFilters((prev) => ({ ...prev, keyword_search: e.target.value }))
//               }
//             />

//             <div className="w-56">
//               <CustomDropdown
//                 options={filtersOptions?.location ? ["All Locations", ...filtersOptions.location] : ["All Locations"]}
//                 value={activeFilters.location}
//                 setValue={(val) => setActiveFilters((p) => ({ ...p, location: val }))}
//               />
//             </div>
//           </div>

//           <div className="flex flex-wrap items-center gap-3">
//             <div className="w-48">
//               <CustomDropdown
//                 options={filtersOptions?.category ? ["All Categories", ...filtersOptions.category] : ["All Categories"]}
//                 value={activeFilters.category}
//                 setValue={(val) => setActiveFilters((p) => ({ ...p, category: val }))}
//               />
//             </div>

//             <div className="w-40">
//               <CustomDropdown
//                 options={filtersOptions?.type ? ["All Types", ...Object.values(filtersOptions.type)] : ["All Types"]}
//                 value={activeFilters.type}
//                 setValue={(val) => setActiveFilters((p) => ({ ...p, type: val }))}
//               />
//             </div>

//             <div className="w-44">
//               <CustomDropdown
//                 options={filtersOptions?.location_type ? ["All", ...Object.values(filtersOptions.location_type)] : ["All", "OnSite", "Remote"]}
//                 value={activeFilters.location_type}
//                 setValue={(val) => setActiveFilters((p) => ({ ...p, location_type: val }))}
//               />
//             </div>

//             <div className="w-48">
//               <CustomDropdown
//                 options={filtersOptions?.sort_by ? Object.values(filtersOptions.sort_by) : ["Newest First", "Oldest First"]}
//                 value={activeFilters.sort_by}
//                 setValue={(val) => setActiveFilters((p) => ({ ...p, sort_by: val }))}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Jobs Listing */}
//         <div className="px-6 py-6 md:px-0 rounded-md mt-2">
//           <div className="flex justify-between text-sm items-center mb-4">
//             <p className="text-gray-600">Showing {jobs.length} jobs</p>
//             {loading && <p className="text-gray-500 text-sm"><SpinnerProvider /></p>}
//           </div>

//           {error && <p className="text-red-500 mb-2">{error}</p>}
//           {jobs.length === 0 && !loading && <p className="text-gray-600 text-sm">No jobs found.</p>}

//           {jobs.map((job, idx) => (
//             <div key={job.job_id || job.id || idx} className="border-2 rounded-md p-4 mb-4 hover:shadow-md hover:border-teal-500 transition flex items-start gap-4">

//               <div className="flex-1">
//                 <div className="flex justify-between items-start">
//                   <div className="w-full">
//                     <div className="flex gap-4 items-center">
//                       <img
//                         src={job.thumbnail || job.image || DEFAULT_JOB_IMAGE}
//                         alt={job.title}
//                         className="w-20 h-20 rounded-md object-contain flex-shrink-0 border-2"
//                         onError={(e) => { if (e.currentTarget.src !== DEFAULT_JOB_IMAGE) e.currentTarget.src = DEFAULT_JOB_IMAGE; }}
//                       />

//                       <div className="flex flex-col">
//                         <h2 className="text-lg font-bold">{job.title}</h2>
//                         <p className="text-xs text-gray-600 flex items-center">
//                           {job.company_name} · <FaMapMarkerAlt className="mx-1" /> {job.location}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="flex gap-2 mt-4">
//                       {job.detected_extensions?.posted_at && <span className="bg-gray-100 px-2 py-1 text-xs rounded">{job.detected_extensions.posted_at}</span>}
//                       {job.detected_extensions?.schedule_type && <span className="bg-gray-100 px-2 py-1 text-xs rounded">{job.detected_extensions.schedule_type}</span>}
//                     </div>

//                     <p className="text-sm text-gray-700 mt-2 max-w-[90%] font-thin">{job.description?.slice(0, 200)}{job.description && job.description.length > 200 ? "..." : ""}</p>

//                     <div className="mt-4 flex flex-row justify-between gap-2">
//                       <div className="text-xs text-gray-500 flex items-center gap-3">
//                         {job.via && <span className="border rounded-md px-2 py-1 border-gray-400 hover:bg-gray-100">Via: {job.via}</span>}
//                         {job.share_link && <a href={job.share_link} target="_blank" rel="noopener noreferrer" className="border rounded-md px-2 py-1 border-gray-400 hover:bg-gray-100"> Share</a>}
//                       </div>

//                       <div className="flex flex-row gap-2 justify-end">
//                         <button onClick={() => setSelectedJob(job)} className="px-4 py-2 text-xs border rounded-md font-semibold hover:bg-gray-100">View Details</button>

//                         <button
//                           onClick={() => setApplyJob(job)}
//                           className="px-4 py-2 text-xs bg-teal-500 text-white rounded-md text-center font-semibold"
//                         >
//                           {job.applied ? "Applied" : "Apply Now"}
//                         </button>
//                       </div>
//                     </div>

//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}

//           {nextPageToken && (
//             <div className="flex justify-center mt-4">
//               <button onClick={fetchMore} disabled={loadingMore} className="px-4 py-2 bg-gray-200 rounded-md text-xs font-semibold">
//                 {loadingMore ? "Loading..." : "Load more"}
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Modals */}
//         {applyJob && (
//           <ApplyJobModal
//             job={applyJob}
//             open={!!applyJob}
//             onClose={() => setApplyJob(null)}
//             onApplied={(jobId) => handleJobApplied(jobId)}
//           />
//         )}

//         {selectedJob && (
//           <ViewJobDetailsModel
//             job={selectedJob}
//             open={!!selectedJob}
//             onClose={() => setSelectedJob(null)}
//             onOpenApply={(jobObj) => setApplyJob(jobObj)}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default JobsOpportunities;


// import { useEffect, useState, useCallback } from "react";
// import { FaArrowLeft, FaMapMarkerAlt } from "react-icons/fa";
// import { Link } from "react-router-dom";
// import ViewJobDetailsModel from "../modal/ViewJobDetailsModel";
// import ApplyJobModal from "../modal/ApplyJobModal";
// import CustomDropdown from "../components/CustomDropdown";
// import { getJobsData, getJobsDataFilters } from "../Hooks/useSeller";
// import SpinnerProvider from "../components/SpinnerProvider";
// import { useTranslation } from "../contexts/LanguageProvider";

// const DEFAULT_JOB_IMAGE =
//   "https://img.myloview.com/posters/businessman-avatar-image-with-beard-hairstyle-male-profile-vector-illustration-700-201088702.jpg";

// const JobsOpportunities = () => {
//   const { t } = useTranslation();

//   // translation-aware defaults (so dropdowns use translated "All ..." labels)
//   const ALL_CATEGORIES = t("filters.all_categories") || "All Categories";
//   const ALL_TYPES = t("filters.all_types") || "All Types";
//   const ALL_LOCATIONS = t("filters.all_locations") || "All Locations";
//   const ALL_LOCATION_TYPES = t("filters.all_location_types") || "All";

//   const [filtersOptions, setFiltersOptions] = useState(null);

//   const [activeFilters, setActiveFilters] = useState({
//     category: ALL_CATEGORIES,
//     type: ALL_TYPES,
//     location: ALL_LOCATIONS,
//     location_type: ALL_LOCATION_TYPES,
//     sort_by: t("filters.options.sort_by.newest_first") || t("jobs.filters_bar.sort_by_label") || "Newest First",
//     keyword_search: "",
//   });

//   const [jobs, setJobs] = useState([]);
//   const [nextPageToken, setNextPageToken] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [error, setError] = useState(null);

//   const [selectedJob, setSelectedJob] = useState(null);
//   const [applyJob, setApplyJob] = useState(null);

//   // load filters from backend; after load, set translated defaults if provided by API (we translate API labels when possible)
//   useEffect(() => {
//     (async () => {
//       try {
//         const data = await getJobsDataFilters();
//         setFiltersOptions(data || {});

//         // set initial activeFilters from translations + api availability
//         setActiveFilters((prev) => ({
//           ...prev,
//           category: ALL_CATEGORIES,
//           type: data?.type ? ALL_TYPES : prev.type,
//           location: ALL_LOCATIONS,
//           location_type: data?.location_type ? ALL_LOCATION_TYPES : prev.location_type,
//           // try to use API-provided sort_by new label or fallback to translation
//           sort_by: data?.sort_by
//             ? (Object.values(data.sort_by)[0] || (t("filters.options.sort_by.newest_first") || "Newest First"))
//             : prev.sort_by,
//         }));
//       } catch (err) {
//         console.error("Failed to load filters:", err);
//       }
//     })();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [t]);

//   // helper: find api key by the label shown in dropdown
//   const findKeyByLabel = (obj = {}, label) => {
//     if (!obj || !label) return "";
//     const entry = Object.entries(obj).find(([, v]) => String(v) === String(label));
//     return entry ? entry[0] : "";
//   };

//   const buildRequestBody = (token = null) => {
//     const categoryArr =
//       activeFilters.category && !activeFilters.category.startsWith(ALL_CATEGORIES)
//         ? [activeFilters.category]
//         : [];

//     const locationArr =
//       activeFilters.location && !activeFilters.location.startsWith(ALL_LOCATIONS)
//         ? [activeFilters.location]
//         : [];

//     const typeKey =
//       filtersOptions?.type &&
//       activeFilters.type &&
//       !activeFilters.type.startsWith(ALL_TYPES)
//         ? findKeyByLabel(filtersOptions.type, activeFilters.type)
//         : "";
//     const typeArr = typeKey ? [typeKey] : [];

//     const locationTypeKey =
//       filtersOptions?.location_type &&
//       activeFilters.location_type &&
//       !activeFilters.location_type.startsWith(ALL_LOCATION_TYPES)
//         ? findKeyByLabel(filtersOptions.location_type, activeFilters.location_type)
//         : "";
//     const locationTypeArr = locationTypeKey ? [locationTypeKey] : [];

//     const sortByKey =
//       filtersOptions?.sort_by && activeFilters.sort_by
//         ? findKeyByLabel(filtersOptions.sort_by, activeFilters.sort_by)
//         : "newest_first";

//     const body = {
//       keyword_search: activeFilters.keyword_search || "",
//       category: categoryArr,
//       type: typeArr,
//       location: locationArr,
//       location_type: locationTypeArr,
//       sort_by: sortByKey || "newest_first",
//       ...(token ? { next_page_token: token } : {}),
//     };

//     return body;
//   };

//   const fetchJobs = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const body = buildRequestBody(null);
//       const { jobs: fetchedJobs, next_page_token } = await getJobsData(body);
//       setJobs(fetchedJobs || []);
//       setNextPageToken(next_page_token || null);
//     } catch (err) {
//       console.error("Error fetching jobs:", err);
//       setError(err.message || t("jobs.messages.network_error") || "Failed to fetch jobs");
//     } finally {
//       setLoading(false);
//     }
//   }, [activeFilters, filtersOptions, t]);

//   const fetchMore = async () => {
//     if (!nextPageToken) return;
//     try {
//       setLoadingMore(true);
//       const body = buildRequestBody(nextPageToken);
//       const { jobs: fetchedJobs, next_page_token } = await getJobsData(body);
//       setJobs((prev) => {
//         const existingIds = new Set(prev.map((j) => j.job_id));
//         const newItems = (fetchedJobs || []).filter((j) => !existingIds.has(j.job_id));
//         return [...prev, ...newItems];
//       });
//       setNextPageToken(next_page_token || null);
//     } catch (err) {
//       console.error("Failed to load more jobs:", err);
//     } finally {
//       setLoadingMore(false);
//     }
//   };

//   useEffect(() => {
//     setJobs([]);
//     setNextPageToken(null);
//     fetchJobs();
//   }, [activeFilters, fetchJobs]);

//   const handleJobApplied = (jobId) => {
//     setJobs((prev) => prev.map((j) => (j.job_id === jobId ? { ...j, applied: true } : j)));
//     setApplyJob(null);
//     setSelectedJob((prev) => (prev?.job_id === jobId ? { ...prev, applied: true } : prev));
//   };

//   // Helper: translate a fallback option when API doesn't provide options.
//   // Accepts translation path (like 'filters.options.type.full_time') or raw value.
//   const tryTranslate = (pathOrValue, fallback) => {
//     const maybe = t(pathOrValue);
//     if (maybe && maybe !== pathOrValue) return maybe;
//     return fallback ?? pathOrValue;
//   };

//   // Build dropdown lists for UI (use API options if present, else translated static lists)
//   const categoryOptions = filtersOptions?.category
//     ? [ALL_CATEGORIES, ...filtersOptions.category]
//     : [ALL_CATEGORIES]; // you can add static translated items if desired

//   const typeOptions = filtersOptions?.type
//     ? [ALL_TYPES, ...Object.values(filtersOptions.type)]
//     : [ALL_TYPES,
//        tryTranslate("filters.options.type.full_time", "Full Time"),
//        tryTranslate("filters.options.type.part_time", "Part Time"),
//        tryTranslate("filters.options.type.contract", "Contract")
//       ];

//   const locationOptions = filtersOptions?.location
//     ? [ALL_LOCATIONS, ...filtersOptions.location]
//     : [ALL_LOCATIONS]; // add more static entries if desired

//   const locationTypeOptions = filtersOptions?.location_type
//     ? [ALL_LOCATION_TYPES, ...Object.values(filtersOptions.location_type)]
//     : [ALL_LOCATION_TYPES,
//        tryTranslate("filters.options.location_type.onsite", "On-site"),
//        tryTranslate("filters.options.location_type.remote", "Remote")
//       ];

//   const sortOptions = filtersOptions?.sort_by
//     ? Object.values(filtersOptions.sort_by)
//     : [ t("filters.options.sort_by.newest_first") || "Newest First", t("filters.options.sort_by.oldest_first") || "Oldest First" ];

//   return (
//     <div className="bg-white min-h-screen w-full">
//       <div className="md:max-w-[80%] mx-auto">
//   <div className="flex flex-col md:flex-row items-center md:justify-between px-6 py-4 md:px-0 gap-3">
//     {/* Back button */}
//     <Link
//       to="/home"
//       className="text-black font-medium text-xs hover:bg-gray-200 rounded-md px-4 py-2 flex items-center md:justify-start"
//     >
//       <FaArrowLeft className="mr-2" /> {t("buttons.back_to_home") || "Back to Home"}
//     </Link>

//     {/* Title */}
//     <h1 className="text-center text-lg md:text-xl font-bold order-first md:order-none flex-1">
//       {t("jobs.page_title")}
//     </h1>

//     {/* Action button */}
//     <button className="px-4 md:px-6 py-2 text-xs font-semibold bg-teal-500 text-white rounded-md  md:w-auto">
//       {t("jobs.google_integration")}
//     </button>
//   </div>


//         {/* Search + Filters */}
//         <div className="px-6 py-4 space-y-3 border-b md:px-0">
//           <div className="flex flex-wrap gap-3">
//             <input
//               type="text"
//               placeholder={t("jobs.search_placeholder")}
//               className="form-input px-4 py-2 rounded-md text-sm flex-1"
//               value={activeFilters.keyword_search}
//               onChange={(e) => setActiveFilters((prev) => ({ ...prev, keyword_search: e.target.value }))}
//             />

//             <div className="w-56">
//               <CustomDropdown
//                 options={locationOptions}
//                 value={activeFilters.location}
//                 setValue={(val) => setActiveFilters((p) => ({ ...p, location: val }))}
//               />
//             </div>
//           </div>

//           <div className="flex flex-wrap items-center gap-3">
//             <div className="w-48">
//               <CustomDropdown
//                 options={categoryOptions}
//                 value={activeFilters.category}
//                 setValue={(val) => setActiveFilters((p) => ({ ...p, category: val }))}
//               />
//             </div>

//             <div className="w-40">
//               <CustomDropdown
//                 options={typeOptions}
//                 value={activeFilters.type}
//                 setValue={(val) => setActiveFilters((p) => ({ ...p, type: val }))}
//               />
//             </div>

//             <div className="w-44">
//               <CustomDropdown
//                 options={locationTypeOptions}
//                 value={activeFilters.location_type}
//                 setValue={(val) => setActiveFilters((p) => ({ ...p, location_type: val }))}
//               />
//             </div>

//             <div className="w-48">
//               <CustomDropdown
//                 options={sortOptions}
//                 value={activeFilters.sort_by}
//                 setValue={(val) => setActiveFilters((p) => ({ ...p, sort_by: val }))}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Jobs Listing */}
//         <div className="px-6 py-6 md:px-0 rounded-md mt-2">
//           <div className="flex justify-between text-sm items-center mb-4">
//             <p className="text-gray-600">{t("jobs.showing_jobs", { count: jobs.length })}</p>
//             {loading && <p className="text-gray-500 text-sm"><SpinnerProvider /></p>}
//           </div>

//           {error && <p className="text-red-500 mb-2">{error}</p>}
//           {jobs.length === 0 && !loading && <p className="text-gray-600 text-sm">{t("jobs.no_jobs")}</p>}

//           {jobs.map((job, idx) => (
//             <div key={job.job_id || job.id || idx} className="border-2 rounded-md p-4 mb-4 hover:shadow-md hover:border-teal-500 transition flex items-start gap-4">
//               <div className="flex-1">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <div className="flex gap-4 items-center">
//                       <img
//                         src={job.thumbnail || job.image || DEFAULT_JOB_IMAGE}
//                         alt={job.title}
//                         className="w-20 h-20 rounded-md object-contain flex-shrink-0 border-2"
//                         onError={(e) => { if (e.currentTarget.src !== DEFAULT_JOB_IMAGE) e.currentTarget.src = DEFAULT_JOB_IMAGE; }}
//                       />

//                       <div className="flex flex-col">
//                         <h2 className="text-lg font-bold">{job.title}</h2>
//                         <p className="text-xs text-gray-600 flex items-center">
//                           {job.company_name} · <FaMapMarkerAlt className="mx-1" /> {job.location}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="flex gap-2 mt-4">
//                       {job.detected_extensions?.posted_at && <span className="bg-gray-100 px-2 py-1 text-xs rounded">{job.detected_extensions.posted_at}</span>}
//                       {job.detected_extensions?.schedule_type && <span className="bg-gray-100 px-2 py-1 text-xs rounded">{job.detected_extensions.schedule_type}</span>}
//                     </div>

//                     <p className="text-sm text-gray-700 mt-2 max-w-[90%] font-thin">{job.description?.slice(0, 200)}{job.description && job.description.length > 200 ? "..." : ""}</p>

//                     <div className="mt-4 flex flex-row justify-between gap-2">
//                       <div className="text-xs text-gray-500 flex items-center gap-3">
//                         {job.via && <span className="border rounded-md px-2 py-1 border-gray-400 hover:bg-gray-100">{t("jobs.job_card.via")}: {job.via}</span>}
//                         {job.share_link && <a href={job.share_link} target="_blank" rel="noopener noreferrer" className="border rounded-md px-2 py-1 border-gray-400 hover:bg-gray-100"> {t("jobs.job_card.share")}</a>}
//                       </div>

//                       <div className="flex flex-row gap-2 justify-end">
//                         <button onClick={() => setSelectedJob(job)} className="px-4 py-2 text-xs border rounded-md font-semibold hover:bg-gray-100">{t("jobs.job_card.view_details")}</button>

//                         <button
//                           onClick={() => setApplyJob(job)}
//                           className="px-4 py-2 text-xs bg-teal-500 text-white rounded-md text-center font-semibold"
//                         >
//                           {job.applied ? t("jobs.job_card.applied") : t("jobs.job_card.apply_now")}
//                         </button>
//                       </div>
//                     </div>

//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}

//           {nextPageToken && (
//             <div className="flex justify-center mt-4">
//               <button onClick={fetchMore} disabled={loadingMore} className="px-4 py-2 bg-gray-200 rounded-md text-xs font-semibold">
//                 {loadingMore ? t("jobs.loading_more") : t("jobs.load_more")}
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Modals */}
//         {applyJob && (
//           <ApplyJobModal
//             job={applyJob}
//             open={!!applyJob}
//             onClose={() => setApplyJob(null)}
//             onApplied={(jobId) => handleJobApplied(jobId)}
//           />
//         )}

//         {selectedJob && (
//           <ViewJobDetailsModel
//             job={selectedJob}
//             open={!!selectedJob}
//             onClose={() => setSelectedJob(null)}
//             onOpenApply={(jobObj) => setApplyJob(jobObj)}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default JobsOpportunities;


import { useEffect, useState, useCallback } from "react";
import { FaArrowLeft, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import ViewJobDetailsModel from "../modal/ViewJobDetailsModel";
import ApplyJobModal from "../modal/ApplyJobModal";
import CustomDropdown from "../components/CustomDropdown";
import { getJobsData, getJobsDataFilters } from "../Hooks/useSeller";
import SpinnerProvider from "../components/SpinnerProvider";
import { useTranslation } from "../contexts/LanguageProvider";

const DEFAULT_JOB_IMAGE =
  "https://img.myloview.com/posters/businessman-avatar-image-with-beard-hairstyle-male-profile-vector-illustration-700-201088702.jpg";

const JobsOpportunities = () => {
  const { t } = useTranslation();

  // translation-aware defaults (so dropdowns use translated "All ..." labels)
  const ALL_CATEGORIES = t("filters.all_categories") || "All Categories";
  const ALL_TYPES = t("filters.all_types") || "All Types";
  const ALL_LOCATIONS = t("filters.all_locations") || "All Locations";
  const ALL_LOCATION_TYPES = t("filters.all_location_types") || "All";

  const [filtersOptions, setFiltersOptions] = useState(null);

  const [activeFilters, setActiveFilters] = useState({
    category: ALL_CATEGORIES,
    type: ALL_TYPES,
    location: ALL_LOCATIONS,
    location_type: ALL_LOCATION_TYPES,
    sort_by:
      t("filters.options.sort_by.newest_first") ||
      t("jobs.filters_bar.sort_by_label") ||
      "Newest First",
    keyword_search: "",
  });

  const [jobs, setJobs] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const [selectedJob, setSelectedJob] = useState(null);
  const [applyJob, setApplyJob] = useState(null);

  // load filters from backend; after load, set translated defaults if provided by API (we translate API labels when possible)
  useEffect(() => {
    (async () => {
      try {
        const data = await getJobsDataFilters();
        setFiltersOptions(data || {});

        // set initial activeFilters from translations + api availability
        setActiveFilters((prev) => ({
          ...prev,
          category: ALL_CATEGORIES,
          type: data?.type ? ALL_TYPES : prev.type,
          location: ALL_LOCATIONS,
          location_type: data?.location_type ? ALL_LOCATION_TYPES : prev.location_type,
          sort_by: data?.sort_by
            ? (Object.values(data.sort_by)[0] ||
              (t("filters.options.sort_by.newest_first") || "Newest First"))
            : prev.sort_by,
        }));
      } catch (err) {
        console.error("Failed to load filters:", err);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  // helper: find api key by the label shown in dropdown
  const findKeyByLabel = (obj = {}, label) => {
    if (!obj || !label) return "";
    const entry = Object.entries(obj).find(([, v]) => String(v) === String(label));
    return entry ? entry[0] : "";
  };

  const buildRequestBody = (token = null) => {
    const categoryArr =
      activeFilters.category && !activeFilters.category.startsWith(ALL_CATEGORIES)
        ? [activeFilters.category]
        : [];

    const locationArr =
      activeFilters.location && !activeFilters.location.startsWith(ALL_LOCATIONS)
        ? [activeFilters.location]
        : [];

    const typeKey =
      filtersOptions?.type &&
        activeFilters.type &&
        !activeFilters.type.startsWith(ALL_TYPES)
        ? findKeyByLabel(filtersOptions.type, activeFilters.type)
        : "";
    const typeArr = typeKey ? [typeKey] : [];

    const locationTypeKey =
      filtersOptions?.location_type &&
        activeFilters.location_type &&
        !activeFilters.location_type.startsWith(ALL_LOCATION_TYPES)
        ? findKeyByLabel(filtersOptions.location_type, activeFilters.location_type)
        : "";
    const locationTypeArr = locationTypeKey ? [locationTypeKey] : [];

    const sortByKey =
      filtersOptions?.sort_by && activeFilters.sort_by
        ? findKeyByLabel(filtersOptions.sort_by, activeFilters.sort_by)
        : "newest_first";

    const body = {
      keyword_search: activeFilters.keyword_search || "",
      category: categoryArr,
      type: typeArr,
      location: locationArr,
      location_type: locationTypeArr,
      sort_by: sortByKey || "newest_first",
      ...(token ? { next_page_token: token } : {}),
    };

    return body;
  };

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const body = buildRequestBody(null);
      const { jobs: fetchedJobs, next_page_token } = await getJobsData(body);
      setJobs(fetchedJobs || []);
      setNextPageToken(next_page_token || null);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError(err.message || t("jobs.messages.network_error") || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  }, [activeFilters, filtersOptions, t]);

  const fetchMore = async () => {
    if (!nextPageToken) return;
    try {
      setLoadingMore(true);
      const body = buildRequestBody(nextPageToken);
      const { jobs: fetchedJobs, next_page_token } = await getJobsData(body);
      setJobs((prev) => {
        const existingIds = new Set(prev.map((j) => j.job_id));
        const newItems = (fetchedJobs || []).filter((j) => !existingIds.has(j.job_id));
        return [...prev, ...newItems];
      });
      setNextPageToken(next_page_token || null);
    } catch (err) {
      console.error("Failed to load more jobs:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setJobs([]);
    setNextPageToken(null);
    fetchJobs();
  }, [activeFilters, fetchJobs]);

  const handleJobApplied = (jobId) => {
    setJobs((prev) => prev.map((j) => (j.job_id === jobId ? { ...j, applied: true } : j)));
    setApplyJob(null);
    setSelectedJob((prev) => (prev?.job_id === jobId ? { ...prev, applied: true } : prev));
  };

  // Helper: translate a fallback option when API doesn't provide options.
  const tryTranslate = (pathOrValue, fallback) => {
    const maybe = t(pathOrValue);
    if (maybe && maybe !== pathOrValue) return maybe;
    return fallback ?? pathOrValue;
  };

  // Build dropdown lists for UI (use API options if present, else translated static lists)
  const categoryOptions = filtersOptions?.category
    ? [ALL_CATEGORIES, ...filtersOptions.category]
    : [ALL_CATEGORIES];

  const typeOptions = filtersOptions?.type
    ? [ALL_TYPES, ...Object.values(filtersOptions.type)]
    : [
      ALL_TYPES,
      tryTranslate("filters.options.type.full_time", "Full Time"),
      tryTranslate("filters.options.type.part_time", "Part Time"),
      tryTranslate("filters.options.type.contract", "Contract"),
    ];

  const locationOptions = filtersOptions?.location ? [ALL_LOCATIONS, ...filtersOptions.location] : [ALL_LOCATIONS];

  const locationTypeOptions = filtersOptions?.location_type
    ? [ALL_LOCATION_TYPES, ...Object.values(filtersOptions.location_type)]
    : [
      ALL_LOCATION_TYPES,
      tryTranslate("filters.options.location_type.onsite", "On-site"),
      tryTranslate("filters.options.location_type.remote", "Remote"),
    ];

  const sortOptions = filtersOptions?.sort_by
    ? Object.values(filtersOptions.sort_by)
    : [
      t("filters.options.sort_by.newest_first") || "Newest First",
      t("filters.options.sort_by.oldest_first") || "Oldest First",
    ];

  return (
    <div className="bg-white min-h-screen w-full">
      <div className="md:max-w-[80%] mx-auto">
        {/* <div className="flex flex-col md:flex-row items-center md:justify-between px-6 py-4 md:px-0 gap-3">
      
          <Link
            to="/home"
            className="text-black font-medium text-xs hover:bg-gray-200 rounded-md px-4 py-2 flex items-center md:justify-start"
          >
            <FaArrowLeft className="mr-2" /> {t("buttons.back_to_home") || "Back to Home"}
          </Link>

        
          <h1 className="text-center text-md lg:text-xl font-bold order-first md:order-none flex-1">
            {t("jobs.page_title")}
          </h1>

          <button className="px-4 md:px-6 py-2 text-xs font-semibold bg-teal-500 text-white rounded-md md:w-auto">
            {t("jobs.google_integration")}
          </button>
        </div> */}
        <div className="flex flex-row items-center justify-between px-4 py-4 gap-3 md:gap-4">
          {/* Back to Home Link */}
          <Link
            to="/home"
            className="text-black font-medium text-xs sm:text-sm md:text-base hover:bg-gray-200 rounded-md px-3 sm:px-4 py-2 flex items-center"
          >
            <FaArrowLeft className="mr-2 text-xs sm:text-sm md:text-base" /> {t("buttons.back_to_home") || "Back to Home"}
          </Link>

          {/* Title */}
          <h1 className="text-center align-center text-sm sm:text-lg md:text-xl font-bold flex-1">
            {t("jobs.page_title")}
          </h1>

          {/* Button */}
          <button className="px-2 sm:px-4 hidden lg:block md:px-4 py-2 text-xs sm:text-sm md:text-base bg-teal-500 text-white rounded-md">
            {t("jobs.google_integration")}
          </button>
        </div>

        {/* Search + Filters */}
        <div className="px-6 py-4 space-y-3 border-b md:px-0">
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder={t("jobs.search_placeholder")}
              className="form-input px-4 py-2 rounded-md text-sm flex-1"
              value={activeFilters.keyword_search}
              onChange={(e) => setActiveFilters((prev) => ({ ...prev, keyword_search: e.target.value }))}
            />

            <div className="w-56">
              <CustomDropdown options={locationOptions} value={activeFilters.location} setValue={(val) => setActiveFilters((p) => ({ ...p, location: val }))} />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="w-48">
              <CustomDropdown options={categoryOptions} value={activeFilters.category} setValue={(val) => setActiveFilters((p) => ({ ...p, category: val }))} />
            </div>

            <div className="w-40">
              <CustomDropdown options={typeOptions} value={activeFilters.type} setValue={(val) => setActiveFilters((p) => ({ ...p, type: val }))} />
            </div>

            <div className="w-44">
              <CustomDropdown options={locationTypeOptions} value={activeFilters.location_type} setValue={(val) => setActiveFilters((p) => ({ ...p, location_type: val }))} />
            </div>

            <div className="w-48">
              <CustomDropdown options={sortOptions} value={activeFilters.sort_by} setValue={(val) => setActiveFilters((p) => ({ ...p, sort_by: val }))} />
            </div>
          </div>
        </div>

        {/* Jobs Listing */}
        <div className="px-6 py-6 md:px-0 rounded-md mt-2">
          <div className="flex justify-between text-sm items-center mb-4">
            <p className="text-gray-600">{t("jobs.showing_jobs", { count: jobs.length })}</p>
            {loading && <p className="text-gray-500 text-sm"><SpinnerProvider /></p>}
          </div>

          {error && <p className="text-red-500 mb-2">{error}</p>}
          {jobs.length === 0 && !loading && <p className="text-gray-600 text-sm">{t("jobs.no_jobs")}</p>}

          {jobs.map((job, idx) => (
            <div key={job.job_id || job.id || idx} className="border-2 rounded-md p-4 mb-4 hover:shadow-md hover:border-teal-500 transition flex items-start gap-4">
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex gap-4 items-center">
                      <img
                        src={job.thumbnail || job.image || DEFAULT_JOB_IMAGE}
                        alt={job.title}
                        className="w-20 h-20 rounded-md object-contain flex-shrink-0 border-2"
                        onError={(e) => { if (e.currentTarget.src !== DEFAULT_JOB_IMAGE) e.currentTarget.src = DEFAULT_JOB_IMAGE; }}
                      />

                      <div className="flex flex-col">
                        <h2 className="lg:text-lg text-sm font-bold">{job.title}</h2>
                        <p className="text-xs text-gray-600 flex items-center">
                          {job.company_name} · <FaMapMarkerAlt className="mx-1" /> {job.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      {job.detected_extensions?.posted_at && <span className="bg-gray-100 px-2 py-1 text-xs rounded">{job.detected_extensions.posted_at}</span>}
                      {job.detected_extensions?.schedule_type && <span className="bg-gray-100 px-2 py-1 text-xs rounded">{job.detected_extensions.schedule_type}</span>}
                    </div>

                    <p className="text-[12px] lg:text-sm text-gray-700 mt-2 max-w-[90%] font-thin">{job.description?.slice(0, 200)}{job.description && job.description.length > 200 ? "..." : ""}</p>

                    {/* Actions area */}
                    <div className="mt-4">
                      {/* Mobile only: 2-column grid to create left/right stacks
                          md+ (tablet & desktop): original horizontal layout preserved */}
                      <div className="grid grid-cols-2 gap-3 md:flex md:items-center md:justify-between md:gap-2">
                        {/* LEFT stack (mobile only, vertical) */}
                        <div className="flex flex-col items-start gap-2 md:flex-row md:items-center">
                          {job.via && (
                            <button className="text-xs border rounded-md px-3 py-2 hover:bg-gray-100">
                              {t("jobs.job_card.via")}: {job.via}
                            </button>
                          )}
                          {job.share_link && (
                            <a
                              href={job.share_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs border rounded-md px-3 py-2 hover:bg-gray-100 inline-block text-center"
                            >
                              {t("jobs.job_card.share")}
                            </a>
                          )}
                        </div>

                        {/* RIGHT stack (mobile only, vertical) */}
                        <div className="flex flex-col items-end gap-2 md:flex-row md:items-center">
                          <button
                            onClick={() => setSelectedJob(job)}
                            className="px-4 py-2 text-xs border rounded-md font-semibold hover:bg-gray-100"
                          >
                            {t("jobs.job_card.view_details")}
                          </button>

                          <button
                            onClick={() => setApplyJob(job)}
                            className="px-4 py-2 text-xs bg-teal-500 text-white rounded-md text-center font-semibold"
                          >
                            {job.applied ? t("jobs.job_card.applied") : t("jobs.job_card.apply_now")}
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          ))}

          {nextPageToken && (
            <div className="flex justify-center mt-4">
              <button onClick={fetchMore} disabled={loadingMore} className="px-4 py-2 bg-gray-200 rounded-md text-xs font-semibold">
                {loadingMore ? t("jobs.loading_more") : t("jobs.load_more")}
              </button>
            </div>
          )}
        </div>

        {/* Modals */}
        {applyJob && (
          <ApplyJobModal
            job={applyJob}
            open={!!applyJob}
            onClose={() => setApplyJob(null)}
            onApplied={(jobId) => handleJobApplied(jobId)}
          />
        )}

        {selectedJob && (
          <ViewJobDetailsModel
            job={selectedJob}
            open={!!selectedJob}
            onClose={() => setSelectedJob(null)}
            onOpenApply={(jobObj) => setApplyJob(jobObj)}
          />
        )}
      </div>
    </div>
  );
};

export default JobsOpportunities;
