import { useEffect, useState, useCallback } from "react";
import { FaArrowLeft, FaMapMarkerAlt } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ViewJobDetailsModel from "../modal/ViewJobDetailsModel";
import ApplyJobModal from "../modal/ApplyJobModal";
import CustomDropdown from "../components/CustomDropdown";
import { getJobsDataFilters, saveToJob, getCustomJobsData } from "../Hooks/useSeller";
// import { getJobsData } from "../Hooks/useSeller"; // commented – custom jobs only for now
import SpinnerProvider from "../components/SpinnerProvider";
import { useTranslation } from "../contexts/LanguageProvider";
import toast from "react-hot-toast";

const DEFAULT_JOB_IMAGE =
  "https://img.myloview.com/posters/businessman-avatar-image-with-beard-hairstyle-male-profile-vector-illustration-700-201088702.jpg";

const JobsOpportunities = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

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
  const [savedJobs, setSavedJobs] = useState(new Set());

  useEffect(() => {
    (async () => {
      try {
        const data = await getJobsDataFilters();
        setFiltersOptions(data || {});

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
  }, [t]);

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

  const normalizeCustomJob = (cj) => {
    return {
      job_id: cj.id ?? cj.job_id,
      id: cj.id ?? cj.job_id,
      title: cj.title || "",
      description: cj.description || "",
      company_name: cj.company?.company_name || cj.company_name || "",
      location: Array.isArray(cj.location) ? cj.location.join(", ").trim() : cj.location || "",
      via: cj.via || "",
      posted_at: cj.posted_at || cj.detected_extensions?.posted_at || null,
      schedule_type: cj.schedule_type || cj.detected_extensions?.schedule_type || null,
      thumbnail: cj.thumbnail || cj.image || null,
      apply_options: cj.applyOptions || cj.apply_options || [],
      job_highlights: cj.job_highlights || [],
      _raw: cj,
    };
  };

  const fetchCustomThenJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let combined = [];
      try {
        const customRes = await getCustomJobsData();
        const customJobsArr = customRes?.job || customRes?.jobs || customRes?.data?.job || [];

        const normalizedCustom = (customJobsArr || []).map(normalizeCustomJob);
        combined = normalizedCustom;
        setJobs(normalizedCustom);
        setNextPageToken(null); // custom jobs only – no external pagination
      } catch (customErr) {
        console.warn("Failed to load custom jobs:", customErr);
      }

      // Display only custom jobs for now – comment out external job API calls
      // const body = buildRequestBody(null);
      // const { jobs: fetchedJobs = [], next_page_token } = await getJobsData(body);

      // const normalizedFetched = (fetchedJobs || []).map((j) => ({
      //   ...j,
      //   job_id: j.job_id ?? j.id ?? j.jobId,
      // }));

      // const existingIds = new Set(combined.map((j) => j.job_id));
      // const newItems = normalizedFetched.filter((j) => !existingIds.has(j.job_id));

      // const merged = [...combined, ...newItems];
      // setJobs(merged);
      // setNextPageToken(next_page_token || null);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError(err.message || t("jobs.messages.network_error") || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  }, [activeFilters, filtersOptions, t]);

  const fetchMore = async () => {
    // Custom jobs only – no external pagination for now
    if (!nextPageToken) return;
    // try {
    //   setLoadingMore(true);
    //   const body = buildRequestBody(nextPageToken);
    //   const { jobs: fetchedJobs = [], next_page_token } = await getJobsData(body);

    //   const existingIds = new Set(jobs.map((j) => j.job_id));
    //   const normalizedFetched = (fetchedJobs || []).map((j) => ({
    //     ...j,
    //     job_id: j.job_id ?? j.id ?? j.jobId,
    //   }));
    //   const newItems = normalizedFetched.filter((j) => !existingIds.has(j.job_id));

    //   setJobs((prev) => [...prev, ...newItems]);
    //   setNextPageToken(next_page_token || null);
    // } catch (err) {
    //   console.error("Failed to load more jobs:", err);
    // } finally {
    //   setLoadingMore(false);
    // }
  };

  useEffect(() => {
    setJobs([]);
    setNextPageToken(null);
    fetchCustomThenJobs();
  }, [activeFilters, fetchCustomThenJobs]);

  const handleJobApplied = (jobId) => {
    setJobs((prev) => prev.map((j) => (j.job_id === jobId ? { ...j, applied: true } : j)));
    setApplyJob(null);
    setSelectedJob((prev) => (prev?.job_id === jobId ? { ...prev, applied: true } : prev));
  };

  const tryTranslate = (pathOrValue, fallback) => {
    const maybe = t(pathOrValue);
    if (maybe && maybe !== pathOrValue) return maybe;
    return fallback ?? pathOrValue;
  };

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

  const handleSaveJob = async (job) => {
    try {
      const payload = {
        job_id: String(job.job_id),
        title: job.title,
        company_name: job.company_name,
        location: job.location,
        via: job.via,
        posted_at: job.detected_extensions?.posted_at || job.posted_at,
        schedule_type: job.detected_extensions?.schedule_type || job.schedule_type,
        qualifications: job.qualifications || "No degree mentioned",
        dental_coverage: job.dental_coverage || false,
        health_insurance: job.health_insurance || false,
        description: job.description,
        job_highlights: job.job_highlights || [],
        apply_options: job.apply_options || job.applyOptions || [],
      };

      await saveToJob(payload);
      toast.success("Job saved successfully!");
      setSavedJobs((prev) => new Set([...prev, job.job_id]));
    } catch (err) {
      toast.error("Failed to save job:", err);
    }
  };

  useEffect(() => {
    const urlFilters = readFiltersFromUrl();
    if (Object.keys(urlFilters).length) {
      setActiveFilters((prev) => ({
        ...prev,
        ...urlFilters,
      }));
    }
  }, [filtersOptions]);

  useEffect(() => {
    writeFiltersToUrl(activeFilters);
  }, [activeFilters]); 


  const writeFiltersToUrl = (filters) => {
    const params = new URLSearchParams();

    if (filters.category && !filters.category.startsWith(ALL_CATEGORIES)) {
      params.set("category", encodeURIComponent(filters.category));
    }
    if (filters.type && !filters.type.startsWith(ALL_TYPES)) {
      const key = findKeyByLabel(filtersOptions?.type, filters.type);
      params.set("type", key || encodeURIComponent(filters.type));
    }
    if (filters.location && !filters.location.startsWith(ALL_LOCATIONS)) {
      params.set("location", encodeURIComponent(filters.location));
    }
    if (filters.location_type && !filters.location_type.startsWith(ALL_LOCATION_TYPES)) {
      const key = findKeyByLabel(filtersOptions?.location_type, filters.location_type);
      params.set("location_type", key || encodeURIComponent(filters.location_type));
    }
    if (filters.sort_by) {
      const key = findKeyByLabel(filtersOptions?.sort_by, filters.sort_by);
      if (key) params.set("sort_by", key);
      else params.set("sort_by", encodeURIComponent(filters.sort_by));
    }
    if (filters.keyword_search) {
      params.set("q", encodeURIComponent(filters.keyword_search));
    }

    const base = location.pathname || "/jobs";
    const newUrl = `${base}?${params.toString()}`;
    navigate(newUrl, { replace: true });
  };

  const readFiltersFromUrl = () => {
    const params = new URLSearchParams(location.search);
    const fromUrl = {};

    const rawCategory = params.get("category");
    if (rawCategory) fromUrl.category = decodeURIComponent(rawCategory);

    const rawType = params.get("type");
    if (rawType) {
      const maybeLabel = filtersOptions?.type?.[rawType] ?? Object.values(filtersOptions?.type || {}).find(v => v === decodeURIComponent(rawType));
      fromUrl.type = maybeLabel || decodeURIComponent(rawType);
    }

    const rawLocation = params.get("location");
    if (rawLocation) fromUrl.location = decodeURIComponent(rawLocation);

    const rawLocationType = params.get("location_type");
    if (rawLocationType) {
      const maybeLabel = filtersOptions?.location_type?.[rawLocationType] ?? Object.values(filtersOptions?.location_type || {}).find(v => v === decodeURIComponent(rawLocationType));
      fromUrl.location_type = maybeLabel || decodeURIComponent(rawLocationType);
    }

    const rawSort = params.get("sort_by");
    if (rawSort) {
      const maybeLabel = filtersOptions?.sort_by?.[rawSort] ?? Object.values(filtersOptions?.sort_by || {}).find(v => v === decodeURIComponent(rawSort));
      fromUrl.sort_by = maybeLabel || decodeURIComponent(rawSort);
    }

    const rawQ = params.get("q");
    if (rawQ) fromUrl.keyword_search = decodeURIComponent(rawQ);

    return fromUrl;
  };

  return (
    <div className="bg-white min-h-screen w-full">
      <div className="md:max-w-[80%] mx-auto">

        <div className="flex flex-row items-center justify-between px-4 py-4 gap-3 md:gap-4 md:px-0">
          <Link
            to="/home"
            className="text-black font-medium text-xs hover:bg-gray-200 rounded-md px-3 sm:px-4 py-2 flex items-center"
          >
            <FaArrowLeft className="mr-2 text-xs" /> {t("buttons.back_to_home") || "Back to Home"}
          </Link>

          <h1 className="text-center align-center text-sm sm:text-lg md:text-xl font-bold flex-1">
            {t("jobs.page_title")}
          </h1>
        </div>

        <div className="px-6 py-4 space-y-3 border-b md:px-0">
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder={t("jobs.search_placeholder")}
              className="form-input px-4 py-2 rounded-md text-xs flex-1"
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

        <div className="px-6 py-6 md:px-0 rounded-md mt-2">
          <div className="flex justify-between text-sm items-center mb-4">
            <p className="text-gray-600">{t("jobs.showing_jobs", { count: jobs.length })}</p>
            {loading && <div className="text-gray-500 text-sm"><SpinnerProvider /></div>}
          </div>

          {error && <p className="text-red-500 mb-2">{error}</p>}
          {jobs.length === 0 && !loading && <p className="text-gray-600 text-sm">{t("jobs.no_jobs")}</p>}

          {jobs.map((job, idx) => (
            <div key={job.job_id || job.id || idx} className="border-2 rounded-md p-4 mb-4 hover:shadow-md hover:border-teal-500 transition flex items-start gap-4">
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div className="w-full">
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

                    <p className="text-[12px] lg:text-sm text-gray-700 mt-2 max-w-[100%] font-thin">{job.description?.slice(0, 200)}{job.description && job.description.length > 200 ? "..." : ""}</p>

                    <div className="mt-4 w-full">
                      <div className="w-full flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-row flex-wrap items-center gap-2">
                          {job.via && (
                            <button className="text-xs border rounded-md px-3 py-2 hover:bg-gray-100">
                              {t("jobs.job_card.via")}: {job.via}
                            </button>
                          )}

                          <button
                            onClick={() => handleSaveJob(job)}
                            disabled={savedJobs.has(job.job_id)}
                            className={`text-xs border rounded-md px-3 py-2 ${savedJobs.has(job.job_id)
                              ? "bg-gray-200 text-black cursor-not-allowed"
                              : "hover:bg-gray-100"
                              }`}
                          >
                            {savedJobs.has(job.job_id) ? "Saved" : "Save"}
                          </button>
                        </div>

                        <div className="flex flex-row flex-wrap items-center gap-2 md:justify-end">
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
