// JobsOpportunities.jsx
import { useEffect, useState, useCallback } from "react";
import { FaArrowLeft, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import ViewJobDetailsModel from "../modal/ViewJobDetailsModel";
import ApplyJobModal from "../modal/ApplyJobModal";
import CustomDropdown from "../components/CustomDropdown";
import { getJobsData, getJobsDataFilters } from "../Hooks/useSeller";
import SpinnerProvider from "../components/SpinnerProvider";

const DEFAULT_JOB_IMAGE =
  "https://img.myloview.com/posters/businessman-avatar-image-with-beard-hairstyle-male-profile-vector-illustration-700-201088702.jpg";

const JobsOpportunities = () => {
  const [filtersOptions, setFiltersOptions] = useState(null);

  const [activeFilters, setActiveFilters] = useState({
    category: "All Categories",
    type: "All Types",
    location: "All Locations",
    location_type: "All",
    sort_by: "Newest First",
    keyword_search: "",
  });

  const [jobs, setJobs] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const [selectedJob, setSelectedJob] = useState(null);
  const [applyJob, setApplyJob] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getJobsDataFilters();
        setFiltersOptions(data || {});
        setActiveFilters((prev) => ({
          ...prev,
          category: "All Categories",
          type: data?.type ? "All Types" : prev.type,
          location: "All Locations",
          location_type: data?.location_type ? "All" : prev.location_type,
          sort_by: data?.sort_by ? (data.sort_by.newest_first ?? "Newest First") : prev.sort_by,
        }));
      } catch (err) {
        console.error("Failed to load filters:", err);
      }
    })();
  }, []);

  const findKeyByLabel = (obj = {}, label) => {
    if (!obj || !label) return "";
    const entry = Object.entries(obj).find(([, v]) => String(v) === String(label));
    return entry ? entry[0] : "";
  };

  const buildRequestBody = (token = null) => {
    const categoryArr = activeFilters.category && !activeFilters.category.startsWith("All")
      ? [activeFilters.category] : [];

    const locationArr = activeFilters.location && !activeFilters.location.startsWith("All")
      ? [activeFilters.location] : [];

    const typeKey = filtersOptions?.type && activeFilters.type && !activeFilters.type.startsWith("All")
      ? findKeyByLabel(filtersOptions.type, activeFilters.type) : "";
    const typeArr = typeKey ? [typeKey] : [];

    const locationTypeKey = filtersOptions?.location_type && activeFilters.location_type && !activeFilters.location_type.startsWith("All")
      ? findKeyByLabel(filtersOptions.location_type, activeFilters.location_type) : "";
    const locationTypeArr = locationTypeKey ? [locationTypeKey] : [];

    const sortByKey = filtersOptions?.sort_by && activeFilters.sort_by
      ? findKeyByLabel(filtersOptions.sort_by, activeFilters.sort_by) : "newest_first";

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
      setError(err.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  }, [activeFilters, filtersOptions]);

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

  return (
    <div className="bg-white min-h-screen w-full">
      <div className="md:max-w-[80%] mx-auto">
        <div className="flex items-center px-6 py-4 md:px-0">
          <Link to="/" className="text-black font-medium text-xs hover:bg-gray-200 rounded-md px-4 py-2 flex items-center">
            <FaArrowLeft className="mr-2" /> Back to Home
          </Link>
          <h1 className="flex-1 text-center text-xl font-bold">Creative Jobs & Opportunities</h1>
          <button className="px-4 py-2 text-xs font-semibold bg-teal-500 text-white rounded-md">
            Google Jobs Integrated
          </button>
        </div>

        {/* Search + Filters */}
        <div className="px-6 py-4 space-y-3 border-b md:px-0">
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Search jobs, companies, or keywords..."
              className="form-input px-4 py-2 rounded-md text-sm flex-1"
              value={activeFilters.keyword_search}
              onChange={(e) =>
                setActiveFilters((prev) => ({ ...prev, keyword_search: e.target.value }))
              }
            />

            <div className="w-56">
              <CustomDropdown
                options={filtersOptions?.location ? ["All Locations", ...filtersOptions.location] : ["All Locations"]}
                value={activeFilters.location}
                setValue={(val) => setActiveFilters((p) => ({ ...p, location: val }))}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="w-48">
              <CustomDropdown
                options={filtersOptions?.category ? ["All Categories", ...filtersOptions.category] : ["All Categories"]}
                value={activeFilters.category}
                setValue={(val) => setActiveFilters((p) => ({ ...p, category: val }))}
              />
            </div>

            <div className="w-40">
              <CustomDropdown
                options={filtersOptions?.type ? ["All Types", ...Object.values(filtersOptions.type)] : ["All Types"]}
                value={activeFilters.type}
                setValue={(val) => setActiveFilters((p) => ({ ...p, type: val }))}
              />
            </div>

            <div className="w-44">
              <CustomDropdown
                options={filtersOptions?.location_type ? ["All", ...Object.values(filtersOptions.location_type)] : ["All", "OnSite", "Remote"]}
                value={activeFilters.location_type}
                setValue={(val) => setActiveFilters((p) => ({ ...p, location_type: val }))}
              />
            </div>

            <div className="w-48">
              <CustomDropdown
                options={filtersOptions?.sort_by ? Object.values(filtersOptions.sort_by) : ["Newest First", "Oldest First"]}
                value={activeFilters.sort_by}
                setValue={(val) => setActiveFilters((p) => ({ ...p, sort_by: val }))}
              />
            </div>
          </div>
        </div>

        {/* Jobs Listing */}
        <div className="px-6 py-6 md:px-0 rounded-md mt-2">
          <div className="flex justify-between text-sm items-center mb-4">
            <p className="text-gray-600">Showing {jobs.length} jobs</p>
            {loading && <p className="text-gray-500 text-sm"><SpinnerProvider /></p>}
          </div>

          {error && <p className="text-red-500 mb-2">{error}</p>}
          {jobs.length === 0 && !loading && <p className="text-gray-600 text-sm">No jobs found.</p>}

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
                        <h2 className="text-lg font-bold">{job.title}</h2>
                        <p className="text-xs text-gray-600 flex items-center">
                          {job.company_name} · <FaMapMarkerAlt className="mx-1" /> {job.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      {job.detected_extensions?.posted_at && <span className="bg-gray-100 px-2 py-1 text-xs rounded">{job.detected_extensions.posted_at}</span>}
                      {job.detected_extensions?.schedule_type && <span className="bg-gray-100 px-2 py-1 text-xs rounded">{job.detected_extensions.schedule_type}</span>}
                    </div>

                    <p className="text-sm text-gray-700 mt-2 max-w-[90%] font-thin">{job.description?.slice(0, 200)}{job.description && job.description.length > 200 ? "..." : ""}</p>

                    <div className="mt-4 flex flex-row justify-between gap-2">
                      <div className="text-xs text-gray-500 flex items-center gap-3">
                        {job.via && <span className="border rounded-md px-2 py-1 border-gray-400 hover:bg-gray-100">Via: {job.via}</span>}
                        {job.share_link && <a href={job.share_link} target="_blank" rel="noopener noreferrer" className="border rounded-md px-2 py-1 border-gray-400 hover:bg-gray-100"> Share</a>}
                      </div>

                      <div className="flex flex-row gap-2 justify-end">
                        <button onClick={() => setSelectedJob(job)} className="px-4 py-2 text-xs border rounded-md font-semibold hover:bg-gray-100">View Details</button>

                        <button
                          onClick={() => setApplyJob(job)}
                          className="px-4 py-2 text-xs bg-teal-500 text-white rounded-md text-center font-semibold"
                        >
                          {job.applied ? "Applied" : "Apply Now"}
                        </button>
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
                {loadingMore ? "Loading..." : "Load more"}
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
