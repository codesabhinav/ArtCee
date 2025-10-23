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
import { useTranslation } from "../contexts/LanguageProvider";
import ViewBusinessProfilePopupModel from "../modal/VIewBusinessProfilePopupModel";

const BusinessDirectory = () => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
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
  const [selectedUuid, setSelectedUuid] = useState(null);
  const [showingCount, setShowingCount] = useState(0);

  const [sortOptions, setSortOptions] = useState([
    t("filters.sort.highest_rated"),
    t("filters.sort.newest"),
    t("filters.sort.lowest_price"),
  ]);
  const [sort, setSort] = useState(t("filters.sort.highest_rated"));

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
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
          if (key === "type") return t("filters.labels.type");
          if (key === "locations") return t("filters.labels.location");
          return key.charAt(0).toUpperCase() + key.slice(1);
        };

        if (meta?.type) {
          const opts = Object.values(meta.type);
          cfg.push({
            label: humanLabel("type"),
            options: [t("filters.all_types"), ...opts],
            key: "type",
          });
          Object.entries(meta.type).forEach(([k, v]) => (labelToKey[v] = k));
        }

        if (meta?.locations) {
          const opts = Object.values(meta.locations);
          cfg.push({
            label: humanLabel("locations"),
            options: [t("filters.all_locations"), ...opts],
            key: "locations",
          });
          Object.entries(meta.locations).forEach(([k, v]) => (labelToKey[v] = k));
        }

        if (meta?.order_by_rate) {
          const map = {};
          const sortLabels = [];
          Object.entries(meta.order_by_rate).forEach(([k, v]) => {
            map[v] = k;
            sortLabels.push(v);
          });
          labelToKey["__order_by_map__"] = map;
          if (sortLabels.length > 0) {
            setSortOptions(sortLabels);
            setSort(sortLabels[0]);
          }
        }

        setFiltersConfigDynamic(cfg);
        setFilterLabelToKeyMap(labelToKey);

        const defaults = {};
        cfg.forEach((f) => {
          defaults[f.key] = f.options[0];
        });
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

    filtersConfigDynamic.forEach((filterObj) => {
      const chosenLabel = selectedFilters[filterObj.key];
      if (!chosenLabel) return;
      if (typeof chosenLabel === "string" && chosenLabel.startsWith(t("filters.all_prefix") || "All")) return;
      const apiKeyFromLabel = filterLabelToKeyMap[chosenLabel];
      if (!apiKeyFromLabel) {
        return;
      }
      params[filterObj.key] = apiKeyFromLabel;
    });

    if (sort && filterLabelToKeyMap["__order_by_map__"]) {
      const orderMap = filterLabelToKeyMap["__order_by_map__"];
      const mapped = orderMap[sort];
      if (mapped) params.order_by_rate = mapped;
    }

    if (page && Number(page) > 0) {
      params.page = Number(page);
    }

    return params;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = buildApiParams();
        const res = await getBusinessData(params);

        const list = Array.isArray(res?.data) ? res.data : [];
        setBusinesses(list);
        setShowingCount(Array.isArray(res?.data) ? res.data.length : 0);

        if (res?.meta) {
          setLastPage(res.meta.last_page ?? 1);
          setPerPage(res.meta.per_page ?? perPage);
          setTotalItems(res.meta.total ?? 0);
          setPage(res.meta.current_page ?? page);
          setShowingCount(res.meta.to ? res.meta.to - (res.meta.from ? res.meta.from - 1 : 0) : list.length);
        }

        setError(null);
      } catch (err) {
        console.error("Failed to fetch businesses:", err);
        setError(err.message || t("business.fetch_error"));
        setBusinesses([]);
        setShowingCount(0);
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
          const res = await getBusinessData({ search: debouncedSearch, page });
          const list = Array.isArray(res?.data) ? res.data : [];
          setBusinesses(list);
          setShowingCount(Array.isArray(res?.data) ? res.data.length : 0);

          if (res?.meta) {
            setLastPage(res.meta.last_page ?? 1);
            setPerPage(res.meta.per_page ?? perPage);
            setTotalItems(res.meta.total ?? 0);
            setPage(res.meta.current_page ?? page);
            setShowingCount(res.meta.to ? res.meta.to - (res.meta.from ? res.meta.from - 1 : 0) : list.length);
          }

          setError(null);
        } catch (err) {
          setError(err.message || t("business.fetch_error"));
          setBusinesses([]);
          setShowingCount(0);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [debouncedSearch, sort, selectedFilters, filtersConfigDynamic, page]);

  const clearFilter = (key) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [key]: defaultSelectedFilters[key] ?? (prev[key] && prev[key].startsWith(t("filters.all_prefix") || "All") ? prev[key] : ""),
    }));
    setPage(1);
  };

  const clearAllFilters = () => {
    setSelectedFilters(defaultSelectedFilters);
    setPage(1);
  };

  const handleSetFilterValue = (filterKey, value) => {
    setFiltersConfigDynamic((prev) =>
      prev.map((f) => {
        if (f.key !== filterKey) return f;
        if (!f.options.includes(value)) {
          return { ...f, options: [...f.options, value] };
        }
        return f;
      })
    );

    setSelectedFilters((prev) => ({ ...prev, [filterKey]: value }));
    setPage(1);
  };

  const SkillChips = ({ skills = [] }) => {
    if (!Array.isArray(skills) || skills.length === 0) return null;
    const visible = skills.slice(0, 3);
    const extra = skills.length - visible.length;

    return (
      <div className="mt-3 flex flex-wrap gap-2">
        {visible.map((s) => (
          <span key={s.id} className="text-xs px-2 py-1 font-medium rounded-md bg-gray-200">{s.name}</span>
        ))}
        {extra > 0 && (
          <span className="text-xs px-2 py-1 font-medium rounded-md bg-gray-200">{`+${extra} ${t("creative.more")}`}</span>
        )}
      </div>
    );
  };

  const gotoPage = (p) => {
    if (!p) return;
    const num = Number(p);
    if (Number.isNaN(num)) return;
    if (num < 1) return;
    if (lastPage && num > lastPage) return;
    setPage(num);
  };

  const renderPagination = () => {
    if (!totalItems || totalItems <= perPage) return null;

    const maxButtons = 7;
    const pages = [];
    const start = Math.max(1, page - Math.floor(maxButtons / 2));
    let end = start + maxButtons - 1;
    if (end > lastPage) end = lastPage;
    const realStart = Math.max(1, end - maxButtons + 1);
    for (let i = realStart; i <= end; i++) pages.push(i);

    return (
      <div className="flex items-center justify-center space-x-2 mt-6">
        <button
          className="px-3 py-1 border rounded-md text-xs hover:bg-gray-100"
          onClick={() => gotoPage(page - 1)}
          disabled={page <= 1}
        >
          Prev
        </button>

        {realStart > 1 && (
          <>
            <button className="px-3 py-1 border rounded-md text-xs" onClick={() => gotoPage(1)}>1</button>
            {realStart > 2 && <span className="px-2">...</span>}
          </>
        )}

        {pages.map((p) => (
          <button
            key={p}
            className={`px-3 py-1 border rounded-md text-xs ${p === page ? "bg-teal-500 text-white" : ""}`}
            onClick={() => gotoPage(p)}
          >
            {p}
          </button>
        ))}

        {end < lastPage && (
          <>
            {end < lastPage - 1 && <span className="px-2">...</span>}
            <button className="px-3 py-1 border rounded-md text-xs" onClick={() => gotoPage(lastPage)}>{lastPage}</button>
          </>
        )}

        <button
          className="px-3 py-1 border rounded-md text-xs hover:bg-gray-100"
          onClick={() => gotoPage(page + 1)}
          disabled={page >= lastPage}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white min-h-screen w-full">

      <div className="md:max-w-[80%] mx-auto">
        <div className="flex flex-row items-center justify-between px-4 py-4 gap-3 md:gap-4 md:px-0">
          <Link
            to="/home"
            className="text-black font-medium text-xs hover:bg-gray-200 rounded-md px-3 sm:px-4 py-2 flex items-center"
          >
            <FaArrowLeft className="mr-2 text-xs" /> {t("business.back_to_home") || "Back to Home"}
          </Link>

          <h1 className="text-center align-center text-sm sm:text-lg md:text-xl font-bold flex-1">
            {t("business.directory_title")}
          </h1>

          <button className="px-2 sm:px-4 hidden lg:block md:px-4 py-2 text-xs bg-teal-500 text-white rounded-md">
            {t("business.industry_partners")}
          </button>
        </div>
        <div className="md:px-0 px-4 py-4 space-y-4 border-b">
          <input
            type="text"
            placeholder={t("filters.search_placeholder")}
            className="form-input w-full text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:space-x-3 gap-3">
            {filtersConfigDynamic.length > 0 ? (
              filtersConfigDynamic.map((f) => (
                <CustomDropdown
                  key={f.key}
                  options={f.options}
                  value={selectedFilters[f.key] ?? f.options[0]}
                  setValue={(val) => handleSetFilterValue(f.key, val)}
                />
              ))
            ) : (
              <>
                <CustomDropdown
                  options={[t("filters.all_types"), "CPA", "Law Firm", "Consulting"]}
                  value={selectedFilters["type"] ?? t("filters.all_types")}
                  setValue={(val) => handleSetFilterValue("type", val)}
                />
                <CustomDropdown
                  options={[t("filters.all_locations"), "New York, NY", "Los Angeles, CA", "Miami, FL"]}
                  value={selectedFilters["locations"] ?? t("filters.all_locations")}
                  setValue={(val) => handleSetFilterValue("locations", val)}
                />
              </>
            )}

            <CustomDropdown
              options={sortOptions}
              value={sort}
              setValue={(val) => {
                setSort(val);
                setPage(1);
              }}
            />
          </div>
        </div>

        <div className="px-4 md:px-0 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <p className="text-sm text-gray-500">
              {t("business.showing")} {showingCount}{" "}
              {showingCount === 1 ? t("business.business") : t("business.businesses")}
            </p>
            <span className="bg-orange-400 font-bold text-white text-xs px-3 py-2 rounded-md text-center sm:text-left">
              {t("business.verified_partners")}
            </span>
          </div>

          {loading && <div className="text-gray-500"><SpinnerProvider /></div>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && businesses.length === 0 && !error && (
            <p className="text-gray-500">{t("business.no_results")}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
            {businesses.map((biz) => {
              const user = biz.user || {};
              const profile = user.profile || {};

              return (
                <div
                  key={biz.id}
                  className="bg-white border rounded-xl shadow-sm p-5 flex items-start gap-4"
                >
                  <img
                    src={
                      profile?.profile_picture ||
                      "https://img.freepik.com/premium-photo/memoji-emoji-handsome-smiling-man-white-background_826801-6987.jpg?semt=ais_hybrid&w=740&q=80"
                    }
                    alt={user?.full_name || t("business.business")}
                    className="w-40 h-40 rounded-lg object-cover shrink-0"
                  />

                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <h2 className="font-bold text-base md:text-lg">{user?.full_name}</h2>
                      {/* <span className="text-xs md:text-sm text-gray-500 flex items-center gap-1">
                        {user.rating ?? "-"} <FaStar className="text-orange-600" />
                      </span> */}
                    </div>

                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-md inline-block mt-1">
                      {biz?.type || t("business.business")}
                    </span>

                    <p className="text-xs text-gray-600 mt-2">{biz.personal_intro}</p>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-500">
                      <p className="flex items-start">
                        <FaMapMarkerAlt className="mr-2 flex-shrink-0" />
                        <span className="whitespace-normal break-words max-w-full">
                          {user?.location?.city?.name || "-"}
                          {user?.location?.state?.name ? `, ${user.location.state.name}` : ""}
                          {user?.location?.country?.name ? `, ${user.location.country.name}` : ""}
                        </span>
                      </p>


                      <p className="flex items-start md:col-start-2 md:row-start-1">
                        <FaPhoneAlt className="mr-2 flex-shrink-0" />
                        <span className="whitespace-normal break-words max-w-full">
                          {profile?.phone || "-"}
                        </span>
                      </p>


                      <p className="flex items-start md:col-span-2">
                        <FaEnvelope className="mr-2 flex-shrink-0" />
                        <span className="whitespace-normal break-all max-w-full">
                          {user?.email || "-"}
                        </span>
                      </p>
                    </div>


                    <p className="mt-3 text-gray-800 font-medium text-sm">
                      {t("price.hourly")}: {biz.hourly_rate != null ? `$${biz.hourly_rate}` : "-"} | {t("price.daily")}: {biz.daily_rate != null ? `$${biz.daily_rate}` : "-"} | {t("price.project")}: {biz.project_rate != null ? `$${biz.project_rate}` : "-"}
                    </p>

                    <SkillChips skills={biz?.skills} />

                    {/* <div className="mt-3 flex gap-2 flex-wrap">
                      {(user?.social_links || []).map((link) => (
                        <a
                          key={link.id || link.url}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-gray-100 px-2 py-1 rounded-md text-blue-600"
                        >
                          {link.platform}
                        </a>
                      ))}
                    </div> */}

                    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:space-x-3 justify-between">
                      {/* <a
                        href={
                          (user?.social_links || []).find((l) => l.platform === "website")?.url || "#"
                        }
                        className="px-3 py-2 border rounded-md text-xs flex items-center justify-center gap-2 hover:bg-gray-100"
                      >
                        <FaGlobe /> <span>{t("business.website")}</span>
                      </a> */}
                      <button
                        onClick={() => {
                          setSelectedUuid(user?.uuid);
                          setOpen(true);
                        }}
                        className="sm:ml-auto px-3 py-2 bg-teal-500 text-white font-semibold text-xs rounded-md hover:bg-teal-600">
                        {t("business.view_details")}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6">
            {renderPagination()}
          </div>
        </div>

      </div>
      <ViewBusinessProfilePopupModel isOpen={open} onClose={() => {
        setOpen(false);
        setSelectedUuid(null);
      }}
        uuid={selectedUuid} />
    </div>
  );
};

export default BusinessDirectory;
