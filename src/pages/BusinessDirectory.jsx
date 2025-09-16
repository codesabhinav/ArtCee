// BusinessDirectory.jsx
import { useEffect, useState, useRef } from "react";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaGlobe,
  FaStar,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { getBusinessData, getBusinessFilters } from "../Hooks/useSeller";
import CustomDropdown from "../components/CustomDropdown";
import SpinnerProvider from "../components/SpinnerProvider";

const BusinessDirectory = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceTimer = useRef(null);

  const [filtersMeta, setFiltersMeta] = useState({});
  const [filtersConfigDynamic, setFiltersConfigDynamic] = useState([]);
  const [filterLabelToKeyMap, setFilterLabelToKeyMap] = useState({});
  const [selectedFilters, setSelectedFilters] = useState({});
  const [defaultSelectedFilters, setDefaultSelectedFilters] = useState({});

  const [showingCount, setShowingCount] = useState(0);

  const [sortOptions, setSortOptions] = useState(["Highest Rated", "Newest", "Lowest Price"]);
  const [sort, setSort] = useState("Highest Rated");

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 500);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [search]);

  useEffect(() => {
    (async () => {
      try {
        const meta = await getBusinessFilters();
        setFiltersMeta(meta || {});

        const cfg = [];
        const labelToKey = {};

        const humanLabel = (key) => {
          if (key === "type") return "Type";
          if (key === "locations") return "Location";
          return key;
        };

        if (meta.type) {
          const opts = Object.values(meta.type);
          cfg.push({ label: humanLabel("type"), options: ["All Types", ...opts], key: "type" });
          Object.entries(meta.type).forEach(([k, v]) => (labelToKey[v] = k)); // label -> key
        }

        if (meta.locations) {
          const opts = Object.values(meta.locations);
          cfg.push({ label: humanLabel("locations"), options: ["All Locations", ...opts], key: "locations" });
          Object.entries(meta.locations).forEach(([k, v]) => (labelToKey[v] = k));
        }

        if (meta.order_by_rate) {
          const map = {};
          const sortLabels = [];
          Object.entries(meta.order_by_rate).forEach(([k, v]) => {
            map[v] = k;
            sortLabels.push(v);
          });
          labelToKey["__order_by_map__"] = map;
          setSortOptions(sortLabels.length > 0 ? sortLabels : sortOptions);
          setSort(sortLabels.length > 0 ? sortLabels[0] : sort);
        }

        setFiltersConfigDynamic(cfg);
        setFilterLabelToKeyMap(labelToKey);

        const defaults = {};
        cfg.forEach((f) => (defaults[f.label] = f.options[0]));
        setSelectedFilters(defaults);
        setDefaultSelectedFilters(defaults);
      } catch (err) {
        console.error("Failed to load business filters:", err);
      }
    })();
  }, []);

  const buildApiParams = () => {
    const params = {};
    if (debouncedSearch) params.search = debouncedSearch;

    Object.entries(selectedFilters).forEach(([label, chosenLabel]) => {
      if (!chosenLabel) return;
      if (chosenLabel.startsWith("All")) return;
      const filterObj = filtersConfigDynamic.find((f) => f.label === label);
      if (!filterObj) return;
      const apiKeyFromLabel = filterLabelToKeyMap[chosenLabel];
      if (!apiKeyFromLabel) return;
      params[filterObj.key] = apiKeyFromLabel;
    });

    if (sort && filterLabelToKeyMap["__order_by_map__"]) {
      const orderMap = filterLabelToKeyMap["__order_by_map__"];
      const mapped = orderMap[sort];
      if (mapped) params.order_by_rate = mapped;
    }

    return params;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = buildApiParams();
        const data = await getBusinessData(params);
        setBusinesses(Array.isArray(data) ? data : []);
        setShowingCount(Array.isArray(data) ? data.length : 0);
      } catch (err) {
        console.error("Failed to fetch businesses:", err);
        setError(err.message || "Failed to fetch businesses");
        setBusinesses([]);
      } finally {
        setLoading(false);
      }
    };

    if (filtersConfigDynamic.length > 0) {
      fetchData();
    } else {
      (async () => {
        try {
          setLoading(true);
          const data = await getBusinessData({ search: debouncedSearch });
          setBusinesses(Array.isArray(data) ? data : []);
          setShowingCount(Array.isArray(data) ? data.length : 0);
        } catch (err) {
          setError(err.message || "Failed to fetch businesses");
          setBusinesses([]);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [debouncedSearch, sort, selectedFilters, filtersConfigDynamic]);

  const clearFilter = (label) => {
    setSelectedFilters((prev) => ({ ...prev, [label]: defaultSelectedFilters[label] || (prev[label] && prev[label].startsWith("All") ? prev[label] : "") }));
  };

  const clearAllFilters = () => {
    setSelectedFilters(defaultSelectedFilters);
  };

  return (
    <div className="bg-white min-h-screen w-full">
      <div className="md:max-w-[80%] mx-auto">
        {/* Header */}
        <div className="flex md:flex-row md:items-center md:justify-between md:px-0 px-4 py-4 gap-3 md:gap-0">
          <Link
            to="/home"
            className="text-black font-medium text-xs hover:bg-gray-200 rounded-md px-4 py-2 flex items-center justify-center md:justify-start"
          >
            <FaArrowLeft className="mr-2" />Back to Home
          </Link>

          <h1 className="text-center text-lg md:text-xl font-bold">
            Business Directory
          </h1>

          <button className="px-4 md:px-6 py-2 text-xs bg-teal-500 text-white rounded-md mx-auto md:mx-0">
            Industry Partners
          </button>
        </div>

        {/* Search + Filters */}
        <div className="md:px-0 px-4 py-4 space-y-4 border-b">
          <input
            type="text"
            placeholder="Search businesses, services, or specializations..."
            className="form-input w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:space-x-3 gap-3">
            {/* Type dropdown - populated from API if available */}
            <CustomDropdown
              options={
                filtersConfigDynamic.find((f) => f.key === "type")?.options ||
                ["All Types", "CPA", "Law Firm", "Consulting"]
              }
              value={selectedFilters["Type"] || (filtersConfigDynamic.find((f) => f.key === "type")?.options?.[0] ?? "All Types")}
              setValue={(val) =>
                setSelectedFilters((prev) => ({ ...prev, Type: val }))
              }
            />

            {/* Location dropdown - populated from API if available */}
            <CustomDropdown
              options={
                filtersConfigDynamic.find((f) => f.key === "locations")?.options ||
                ["All Locations", "New York, NY", "Los Angeles, CA", "Miami, FL"]
              }
              value={selectedFilters["Location"] || (filtersConfigDynamic.find((f) => f.key === "locations")?.options?.[0] ?? "All Locations")}
              setValue={(val) =>
                setSelectedFilters((prev) => ({ ...prev, Location: val }))
              }
            />

            {/* Sort dropdown - derived from API order_by_rate */}
            <CustomDropdown
              options={sortOptions}
              value={sort}
              setValue={(val) => setSort(val)}
            />
          </div>
        </div>

        {/* Results */}
        <div className="px-4 md:px-0 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <p className="text-sm text-gray-500">
              Showing {showingCount} business
            </p>
            <span className="bg-orange-400 font-bold text-white text-xs px-3 py-1 rounded-md text-center sm:text-left">
              Verified Partners
            </span>
          </div>

          {loading && <div className="text-gray-500"><SpinnerProvider /></div>}
          {error && <p className="text-red-500">{error}</p>}

          {/* Grid container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {businesses.map((biz) => {
              const user = biz.user;
              const profile = biz.user.profile;

              return (
                <div
                  key={biz.id}
                  className="bg-white border rounded-xl shadow-sm p-5 flex items-start gap-4"
                >
                  {/* Image */}
                  <img
                    src={
                      profile?.profile_picture ||
                      "https://img.freepik.com/premium-photo/memoji-emoji-handsome-smiling-man-white-background_826801-6987.jpg?semt=ais_hybrid&w=740&q=80"
                    }
                    alt={user?.full_name}
                    className="w-20 h-20 rounded-lg object-cover shrink-0"
                  />

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <h2 className="font-bold text-base md:text-lg">{user?.full_name}</h2>
                      <span className="text-xs md:text-sm text-gray-500 flex items-center gap-1">
                        {user.rating} <FaStar className="text-orange-600" /> 
                      </span>
                    </div>

                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-md inline-block mt-1">
                      {biz?.type || "Business"}
                    </span>

                    <p className="text-xs text-gray-600 mt-2">{biz.personal_intro}</p>

                    {/* Meta */}
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-500">
                      <p className="flex items-center">
                        <FaMapMarkerAlt className="mr-2" /> {user?.location.city?.name},
                        {user?.location.state?.name}, {user?.location.country?.name}
                      </p>
                      <p className="flex items-center">
                        <FaPhoneAlt className="mr-2" /> {user.profile?.phone || "-"}
                      </p>
                      <p className="flex items-center">
                        <FaEnvelope className="mr-2" /> {user?.email}
                      </p>
                    </div>

                    {/* Price */}
                    <p className="mt-3 text-gray-800 font-medium text-sm">
                      💲 Hourly: ${biz.hourly_rate} | Daily: ${biz.daily_rate} | Project: ${biz.project_rate}
                    </p>

                    {/* Social Links */}
                    <div className="mt-3 flex gap-2 flex-wrap">
                      {user?.social_links?.map((link) => (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-gray-100 px-2 py-1 rounded-md text-blue-600"
                        >
                          {link.platform}
                        </a>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:space-x-3 justify-between">
                      <a
                        href={
                          user?.social_links?.find((l) => l.platform === "website")?.url || "#"
                        }
                        className="px-3 py-2 border rounded-md text-xs flex items-center justify-center gap-2 hover:bg-gray-100"
                      >
                        <FaGlobe /> <span>Website</span>
                      </a>
                      <button className="sm:ml-auto px-3 py-2 bg-teal-500 text-white font-semibold text-xs rounded-md hover:bg-teal-600">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default BusinessDirectory;
