// // CreativeDirectory.jsx
// import { useEffect, useState, useRef } from "react";
// import { Link } from "react-router-dom";
// import {
//   FaArrowLeft,
//   FaStar,
//   FaMapMarkerAlt,
//   FaClock,
//   FaBriefcase,
//   FaGlobe,
// } from "react-icons/fa";
// import ViewProfilePopupModel from "../modal/ViewProfilePopupModel";
// import { getCreativeData, getCreativeFilters } from "../Hooks/useSeller";
// import CustomDropdown from "../components/CustomDropdown";
// import SpinnerProvider from "../components/SpinnerProvider";
// import { useTranslation } from "../contexts/LanguageProvider";

// const DEFAULT_AVATAR =
//   "https://img.freepik.com/premium-photo/memoji-emoji-handsome-smiling-man-white-background_826801-6987.jpg?semt=ais_hybrid&w=740&q=80";

// const CreativeDirectory = () => {
//   const { t } = useTranslation();

//   const [open, setOpen] = useState(false);
//   const [creatives, setCreatives] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [search, setSearch] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const debounceTimer = useRef(null);

//   const [filtersMeta, setFiltersMeta] = useState({});
//   const [filtersConfigDynamic, setFiltersConfigDynamic] = useState([]);
//   const [filterLabelToKeyMap, setFilterLabelToKeyMap] = useState({});
//   const [selectedFilters, setSelectedFilters] = useState({});
//   const [defaultSelectedFilters, setDefaultSelectedFilters] = useState({});

//   const sortOptions = [
//     t("creative.sort_highest_rated"),
//     t("creative.sort_price_low_high"),
//     t("creative.sort_price_high_low"),
//     t("creative.sort_most_experience"),
//     t("creative.sort_name_az"),
//   ];
//   const [sort, setSort] = useState(sortOptions[0]);

//   useEffect(() => {
//     if (debounceTimer.current) clearTimeout(debounceTimer.current);
//     debounceTimer.current = setTimeout(() => {
//       setDebouncedSearch(search.trim());
//     }, 500);
//     return () => {
//       if (debounceTimer.current) clearTimeout(debounceTimer.current);
//     };
//   }, [search]);

//   useEffect(() => {
//     (async () => {
//       try {
//         const meta = await getCreativeFilters();
//         setFiltersMeta(meta || {});

//         const cfg = [];
//         const labelToKey = {};

//         const humanLabel = (key) => {
//           if (key === "availability") return t("creative.filter_availability");
//           if (key === "level") return t("creative.filter_experience_level");
//           if (key === "working_style") return t("creative.filter_work_style");
//           if (key === "union_status") return t("creative.filter_union_status");
//           return key;
//         };

//         const pushFilter = (keyName, apiObj, allLabel) => {
//           if (!apiObj) return;
//           const options = Object.values(apiObj);
//           cfg.push({ label: humanLabel(keyName), options: [allLabel, ...options], key: keyName });
//           Object.entries(apiObj).forEach(([k, v]) => {
//             labelToKey[v] = k;
//           });
//         };

//         // localized "All ..." labels
//         pushFilter("availability", meta.availability, t("creative.all_status"));
//         pushFilter("level", meta.level, t("creative.all_levels"));
//         pushFilter("working_style", meta.working_style, t("creative.all_types"));
//         pushFilter("union_status", meta.union_status, t("creative.all_status"));

//         if (meta.order_by_rate) {
//           const map = {};
//           Object.entries(meta.order_by_rate).forEach(([k, v]) => (map[v] = k));
//           labelToKey["__order_by_map__"] = map;
//         }

//         setFiltersConfigDynamic(cfg);
//         setFilterLabelToKeyMap(labelToKey);

//         const defaults = {};
//         cfg.forEach((f) => (defaults[f.label] = f.options[0]));
//         setSelectedFilters(defaults);
//         setDefaultSelectedFilters(defaults);
//       } catch (err) {
//         console.error("Failed to load filters:", err);
//       }
//     })();
//     // we intentionally depend on t so labels update when language changes
//   }, [t]);

//   const buildApiParams = () => {
//     const params = {};
//     if (debouncedSearch) params.search = debouncedSearch;

//     Object.entries(selectedFilters).forEach(([label, chosenLabel]) => {
//       if (!chosenLabel) return;
//       if (chosenLabel.startsWith(t("creative.all"))) return; // treat any "All..." label as empty
//       const filterObj = filtersConfigDynamic.find((f) => f.label === label);
//       if (!filterObj) return;
//       const apiKeyFromLabel = filterLabelToKeyMap[chosenLabel];
//       if (!apiKeyFromLabel) return;
//       params[filterObj.key] = apiKeyFromLabel;
//     });

//     if (sort && filterLabelToKeyMap["__order_by_map__"]) {
//       const orderMap = filterLabelToKeyMap["__order_by_map__"];
//       const mapped = orderMap[sort];
//       if (mapped) params.order_by = mapped;
//     }

//     return params;
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const params = buildApiParams();
//         const data = await getCreativeData(params);
//         setCreatives(Array.isArray(data) ? data : []);
//       } catch (err) {
//         console.error("Failed to fetch creatives:", err);
//         setCreatives([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (filtersConfigDynamic.length > 0) {
//       fetchData();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [debouncedSearch, sort, selectedFilters, filtersConfigDynamic]);

//   const clearFilter = (label) => {
//     setSelectedFilters((prev) => ({
//       ...prev,
//       [label]: defaultSelectedFilters[label] || (prev[label] && prev[label].startsWith(t("creative.all")) ? prev[label] : ""),
//     }));
//   };

//   const clearAllFilters = () => {
//     setSelectedFilters(defaultSelectedFilters);
//   };

//   const getLocationText = (creative) => {
//     const city = creative?.user?.location?.city?.name;
//     const state = creative?.user?.location?.state?.name;
//     const country = creative?.user?.location?.country?.name;
//     const parts = [city, state, country].filter(Boolean);
//     return parts.length ? parts.join(", ") : t("creative.na");
//   };

//   const getAvailability = (creative) => {
//     const status = (creative?.status || "").toLowerCase();
//     if (status === "online") return { label: t("creative.available"), badge: "bg-green-100 text-green-700" };
//     if (status === "busy") return { label: t("creative.busy"), badge: "bg-yellow-100 text-yellow-700" };
//     if (status === "booked") return { label: t("creative.booked"), badge: "bg-orange-100 text-orange-700" };
//     return { label: t("creative.offline"), badge: "bg-gray-100 text-gray-700" };
//   };

//   const SidebarFilters = () => (
//     <div className="w-full md:w-64 shrink-0 border rounded-lg p-4 bg-white shadow-sm">
//       <h2 className="font-semibold mb-4">{t("creative.advanced_filters")}</h2>

//       <div className="mb-4">
//         <p className="font-medium text-sm">{t("creative.budget_range")}</p>
//         <input
//           type="range"
//           min={filtersMeta?.budged_range?.min ?? 0}
//           max={filtersMeta?.budged_range?.max ?? 10000}
//           className="w-full mt-3 accent-teal-500"
//         />
//         <div className="flex justify-between text-xs text-gray-500 mt-1">
//           <span>${filtersMeta?.budged_range?.min ?? 0}</span>
//           <span>${filtersMeta?.budged_range?.max ?? 10000}+ </span>
//         </div>
//       </div>

//        <div className="mb-4">
//         <p className="font-medium text-sm">{t("creative.industries")}</p>
//         <div className="mt-2 space-y-2 text-xs">
//           {filtersMeta?.industries
//             ? Object.values(filtersMeta.industries).map((ind, i) => (
//                 <label key={i} className="flex items-center space-x-2">
//                   <input type="checkbox" className="accent-teal-500" />
//                   <span>{ind}</span>
//                 </label>
//               ))
//             : ["Industries", "Services", "Skills"].map((ind, i) => (
//                 <label key={i} className="flex items-center space-x-2">
//                   <input type="checkbox" className="accent-teal-500" />
//                   <span>{ind}</span>
//                 </label>
//               ))}
//         </div>
//       </div> 



// {/* <div className="mb-4">
//   <p className="font-medium text-sm">{t("creative.industries")}</p>
//   <div className="mt-2 space-y-2 text-xs">
//     {/*
//       1) defaultIndustries: fallback from translations JSON (prefer array via returnObjects)
//       2) If filtersMeta.industries present, we try to localize each API label via translation mapping (`creative.industry_map`)
//          - if no mapping exists, show the original API label (defaultValue)
//     */}
//     {/* {filtersMeta?.industries ? (
//       Object.values(filtersMeta.industries).map((ind, i) => {
//         // try to translate API-provided label using map in JSON: creative.industry_map[apiLabel]
//         const localized = t(`creative.industry_map.${ind}`, { defaultValue: ind });
//         return (
//           <label key={i} className="flex items-center space-x-2">
//             <input type="checkbox" className="accent-teal-500" />
//             <span>{localized}</span>
//           </label>
//         );
//       })
//     ) : (
//       (() => { */}
//         {/* // read an array from translations. If your t() supports returnObjects, pass that.
//         const arr = t("creative.default_industries", { returnObjects: true });
//         const defaultIndustries = Array.isArray(arr)
//           ? arr
//           : (typeof arr === "string" ? arr.split(",").map(s => s.trim()) : ["Industries", "Services", "Skills"]);
//         return defaultIndustries.map((ind, i) => (
//           <label key={i} className="flex items-center space-x-2">
//             <input type="checkbox" className="accent-teal-500" />
//             <span>{ind}</span>
//           </label>
//         ));
//       })()
//     )}
//   </div>
// </div> */}


//       {filtersConfigDynamic.map((filter, idx) => (
//         <div key={idx} className="mb-3">
//           <CustomDropdown
//             label={filter.label}
//             options={filter.options}
//             value={selectedFilters[filter.label] || filter.options[0]}
//             setValue={(val) => setSelectedFilters((prev) => ({ ...prev, [filter.label]: val }))}
//           />
//         </div>
//       ))}
//     </div>
//   );

//   const ActiveFilterChips = () => {
//     const active = Object.entries(selectedFilters).filter(([label, val]) => val && !val.startsWith(t("creative.all")));
//     if (active.length === 0) return null;

//     return (
//       <div className="flex flex-wrap gap-2 items-center">
//         {active.map(([label, val]) => (
//           <div key={label} className="flex items-center bg-gray-100 px-3 py-2 rounded-md text-xs">
//             <span>{label}: <strong className="ml-1">{val}</strong></span>
//             <button onClick={() => clearFilter(label)} className="ml-2 text-gray-600">✕</button>
//           </div>
//         ))}
//         <button onClick={clearAllFilters} className="ml-2 text-xs border px-3 py-1.5 rounded-md font-semibold hover:bg-gray-100">
//           {t("creative.clear_all")}
//         </button>
//       </div>
//     );
//   };

//   const SkillChips = ({ skills = [] }) => {
//     if (!Array.isArray(skills) || skills.length === 0) return null;
//     const visible = skills.slice(0, 3);
//     const extra = skills.length - visible.length;

//     return (
//       <div className="mt-3 flex flex-wrap gap-2">
//         {visible.map((s) => (
//           <span key={s.id} className="text-xs px-2 py-1 font-medium rounded-md bg-gray-200">{s.name}</span>
//         ))}
//         {extra > 0 && (
//           <span className="text-xs px-2 py-1 font-medium rounded-md bg-gray-200">{`+${extra} ${t("creative.more")}`}</span>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="bg-white min-h-screen w-full">
//       <div className="md:max-w-[80%] justify-center mx-auto">
//         {/* Top Navigation */}
//         <div className="flex flex-wrap items-center justify-between px-2 md:px-0 py-4 gap-3">
//           <Link
//             to="/home"
//             className="text-black font-medium text-xs hover:bg-gray-200 rounded-md px-3 py-2 flex items-center"
//           >
//             <FaArrowLeft className="mr-2" /> {t("creative.back_to_home")}
//           </Link>
//           <h1 className="text-center text-lg md:text-xl font-bold flex-1">{t("creative.title")}</h1>
//           <button className="px-4 py-2 text-xs bg-teal-500 text-white rounded-md">
//             {t("creative.count_creatives", { count: creatives.length })}
//           </button>
//         </div>

//         {/* Search + Sort */}
//         <div className="px-2 md:px-0 py-4 space-y-3 border-b">
//           <input
//             type="text"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder={t("creative.search_placeholder")}
//             className="flex-1 form-input w-full"
//           />
//           <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-3 sm:space-y-0">
//             <div className="w-48">
//               <CustomDropdown
//                 options={sortOptions}
//                 value={sort}
//                 setValue={setSort}
//               />
//             </div>

//             <div className="ml-2">
//               <ActiveFilterChips />
//             </div>
//           </div>
//         </div>

//         <div className="flex flex-col md:flex-row md:space-x-6 my-5">
//           {/* Sidebar (Desktop) */}
//           <div className="hidden md:block">
//             <SidebarFilters />
//           </div>
//           {/* Sidebar (Mobile) */}
//           <div className="md:hidden mb-4">
//             <SidebarFilters />
//           </div>

//           {/* Cards Grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 w-full">
//             {loading ? (
//               <p className="text-gray-500"><SpinnerProvider/></p>
//             ) : creatives.length === 0 ? (
//               <p className="text-gray-500">{t("creative.no_creatives")}</p>
//             ) : (
//               creatives.map((creative) => {
//                 const availability = getAvailability(creative);
//                 const rating = typeof creative?.rating === "number" ? creative.rating.toFixed(1) : "—";
//                 const reviews = creative?.total_reviews ?? 0;
//                 const name = creative?.user?.full_name || t("creative.anonymous");
//                 const title = creative?.user?.profile?.title || "—";
//                 const years = creative?.experience_in_year ?? "0";
//                 const level = creative?.experience_in_level
//                   ? String(creative.experience_in_level).charAt(0).toUpperCase() +
//                   String(creative.experience_in_level).slice(1)
//                   : "—";
//                 const workStyle =
//                   creative?.on_site_active === "1" && creative?.is_remote_active === "0" 
//                     ? t("creative.on_site")
//                     : creative?.is_remote_active === "1" && creative?.on_site_active === "0"
//                       ? t("creative.remote_ok")
//                       : t("creative.remote_ok_on_site");

//                 const profileSrc = creative?.user?.profile?.profile_picture || DEFAULT_AVATAR;

//                 return (
//                   <div
//                     key={creative.id}
//                     className="border rounded-xl p-4 shadow-sm bg-white"
//                   >
//                     {/* Header */}
//                     <div className="flex items-center justify-between">
//                       <span className="flex items-center bg-black text-white text-xs px-2 py-1 rounded-md">
//                         <FaStar className="mr-1" /> {rating}
//                         {Number(reviews) > 0 && <span className="ml-1 opacity-80">({reviews})</span>}
//                       </span>
//                       <span className={`flex items-center text-xs px-2 py-1 rounded-md ${availability.badge}`}>
//                         ● {availability.label}
//                       </span>
//                     </div>

//                     {/* Profile */}
//                     <div className="flex items-center mt-4">
//                       <img
//                         src={profileSrc}
//                         alt={name}
//                         className="w-14 h-14 rounded-full object-cover border"
//                         onError={(e) => {
//                           if (e.currentTarget.src !== DEFAULT_AVATAR) {
//                             e.currentTarget.src = DEFAULT_AVATAR;
//                           }
//                         }}
//                       />
//                       <div className="ml-3">
//                         <h3 className="font-bold text-sm">{name}</h3>
//                         <p className="text-xs text-gray-600">{title}</p>
//                       </div>
//                     </div>

//                     {/* Bio */}
//                     <p className="text-xs font-regular text-gray-500 mt-3 line-clamp-4">
//                       {creative?.personal_intro || t("creative.no_intro")}
//                     </p>

//                     {/* Meta */}
//                     <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-y-1 text-xs text-gray-500">
//                       <p className="flex items-center">
//                         <FaMapMarkerAlt className="mr-2" /> {getLocationText(creative)}
//                       </p>
//                       <p className="flex items-center">
//                         <FaClock className="mr-2" /> {years}+ {t("creative.years")}
//                       </p>
//                       <p className="flex items-center">
//                         <FaBriefcase className="mr-2" /> {level} {t("creative.level")}
//                       </p>
//                       <p className="flex items-center">
//                         <FaGlobe className="mr-2" /> {workStyle}
//                       </p>
//                     </div>

//                     <SkillChips skills={creative?.user?.skills} />

//                     {/* Button */}
//                     <button
//                       onClick={() => setOpen(true)}
//                       className="w-full mt-4 bg-teal-500 text-white text-xs font-semibold py-2 rounded-md hover:bg-teal-600"
//                     >
//                       {t("creative.view_profile")}
//                     </button>
//                   </div>
//                 );
//               })
//             )}
//           </div>

//           <ViewProfilePopupModel isOpen={open} onClose={() => setOpen(false)} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreativeDirectory;

// CreativeDirectory.jsx
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaStar,
  FaMapMarkerAlt,
  FaClock,
  FaBriefcase,
  FaGlobe,
} from "react-icons/fa";
import ViewProfilePopupModel from "../modal/ViewProfilePopupModel";
import { getCreativeData, getCreativeFilters } from "../Hooks/useSeller";
import CustomDropdown from "../components/CustomDropdown";
import SpinnerProvider from "../components/SpinnerProvider";
import { useTranslation } from "../contexts/LanguageProvider";

const DEFAULT_AVATAR =
  "https://img.freepik.com/premium-photo/memoji-emoji-handsome-smiling-man-white-background_826801-6987.jpg?semt=ais_hybrid&w=740&q=80";

const CreativeDirectory = () => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [creatives, setCreatives] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceTimer = useRef(null);

  const [filtersMeta, setFiltersMeta] = useState({});
  const [filtersConfigDynamic, setFiltersConfigDynamic] = useState([]);
  const [filterLabelToKeyMap, setFilterLabelToKeyMap] = useState({});
  const [selectedFilters, setSelectedFilters] = useState({});
  const [defaultSelectedFilters, setDefaultSelectedFilters] = useState({});

  // helper: slugify a label to attempt translations like creative.<slug>
  const slugify = (s) =>
    String(s || "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "");

  // try to translate an API-provided label using creative.<slug> key; if missing, fall back to original label
  const tryTranslate = (label) => {
    if (!label) return label;
    const key = `creative.${slugify(label)}`;
    const translated = t(key);
    // t returns the key string when missing in your implementation
    if (translated && translated !== key) return translated;
    return label;
  };

  const sortOptions = [
    t("creative.sort_highest_rated"),
    t("creative.sort_price_low_high"),
    t("creative.sort_price_high_low"),
    t("creative.sort_most_experience"),
    t("creative.sort_name_az"),
  ];
  const [sort, setSort] = useState(sortOptions[0]);

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
        const meta = await getCreativeFilters();
        setFiltersMeta(meta || {});

        const cfg = [];
        const labelToKey = {};

        const humanLabel = (key) => {
          if (key === "availability") return t("creative.filter_availability");
          if (key === "level") return t("creative.filter_experience_level");
          if (key === "working_style") return t("creative.filter_work_style");
          if (key === "union_status") return t("creative.filter_union_status");
          return key;
        };

        const pushFilter = (keyName, apiObj, allLabel) => {
          if (!apiObj) return;
          // apiObj assumed to be object mapping key->label; we localize each label when building options
          const optionsRaw = Object.values(apiObj);
          const options = optionsRaw.map((v) => tryTranslate(v));
          cfg.push({ label: humanLabel(keyName), options: [allLabel, ...options], key: keyName });
          Object.entries(apiObj).forEach(([k, v]) => {
            labelToKey[v] = k;
          });
        };

        // localized "All ..." labels
        pushFilter("availability", meta.availability, t("creative.all_status"));
        pushFilter("level", meta.level, t("creative.all_levels"));
        pushFilter("working_style", meta.working_style, t("creative.all_types"));
        pushFilter("union_status", meta.union_status, t("creative.all_status"));

        if (meta.order_by_rate) {
          const map = {};
          Object.entries(meta.order_by_rate).forEach(([k, v]) => (map[v] = k));
          labelToKey["__order_by_map__"] = map;
        }

        setFiltersConfigDynamic(cfg);
        setFilterLabelToKeyMap(labelToKey);

        const defaults = {};
        cfg.forEach((f) => (defaults[f.label] = f.options[0]));
        setSelectedFilters(defaults);
        setDefaultSelectedFilters(defaults);
      } catch (err) {
        console.error("Failed to load filters:", err);
      }
    })();
    // re-run when language changes so labels update (we rely on t)
  }, [t]);

  const buildApiParams = () => {
    const params = {};
    if (debouncedSearch) params.search = debouncedSearch;

    Object.entries(selectedFilters).forEach(([label, chosenLabel]) => {
      if (!chosenLabel) return;
      if (chosenLabel.startsWith(t("creative.all"))) return; // treat any "All..." label as empty
      const filterObj = filtersConfigDynamic.find((f) => f.label === label);
      if (!filterObj) return;
      // we have stored filterLabelToKeyMap using API-provided labels (not translated),
      // but chosenLabel might be translated. So we need to map back:
      // find apiLabel whose translated version equals chosenLabel.
      const apiKeyFromLabel = (() => {
        // try quick direct lookup (if chosenLabel is actually the API label)
        if (filterLabelToKeyMap[chosenLabel]) return filterLabelToKeyMap[chosenLabel];
        // otherwise scan for a label whose translation matches chosenLabel
        for (const [apiLabel, apiKey] of Object.entries(filterLabelToKeyMap)) {
          if (tryTranslate(apiLabel) === chosenLabel) return apiKey;
        }
        return null;
      })();

      if (!apiKeyFromLabel) return;
      params[filterObj.key] = apiKeyFromLabel;
    });

    if (sort && filterLabelToKeyMap["__order_by_map__"]) {
      const orderMap = filterLabelToKeyMap["__order_by_map__"];
      // sort might be a translated label. map back to API key if possible:
      let mapped = orderMap[sort];
      if (!mapped) {
        for (const [label, key] of Object.entries(orderMap)) {
          if (tryTranslate(label) === sort) {
            mapped = key;
            break;
          }
        }
      }
      if (mapped) params.order_by = mapped;
    }

    return params;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = buildApiParams();
        const data = await getCreativeData(params);
        setCreatives(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch creatives:", err);
        setCreatives([]);
      } finally {
        setLoading(false);
      }
    };

    if (filtersConfigDynamic.length > 0) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, sort, selectedFilters, filtersConfigDynamic]);

  const clearFilter = (label) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [label]: defaultSelectedFilters[label] || (prev[label] && prev[label].startsWith(t("creative.all")) ? prev[label] : ""),
    }));
  };

  const clearAllFilters = () => {
    setSelectedFilters(defaultSelectedFilters);
  };

  const getLocationText = (creative) => {
    const city = creative?.user?.location?.city?.name;
    const state = creative?.user?.location?.state?.name;
    const country = creative?.user?.location?.country?.name;
    const parts = [city, state, country].filter(Boolean);
    return parts.length ? parts.join(", ") : t("creative.na");
  };

  const getAvailability = (creative) => {
    const status = (creative?.status || "").toLowerCase();
    if (status === "online") return { label: t("creative.available"), badge: "bg-green-100 text-green-700" };
    if (status === "busy") return { label: t("creative.busy"), badge: "bg-yellow-100 text-yellow-700" };
    if (status === "booked") return { label: t("creative.booked"), badge: "bg-orange-100 text-orange-700" };
    return { label: t("creative.offline"), badge: "bg-gray-100 text-gray-700" };
  };

  const SidebarFilters = () => {
    // fallback default industries from translation (try reading an array), else fallback hard-coded
    const defaultIndustriesRaw = t("creative.default_industries");
    const defaultIndustries = Array.isArray(defaultIndustriesRaw)
      ? defaultIndustriesRaw
      : (typeof defaultIndustriesRaw === "string" && defaultIndustriesRaw !== "creative.default_industries"
        ? defaultIndustriesRaw.split(",").map((s) => s.trim())
        : ["Industries", "Services", "Skills"]);

    return (
      <div className="w-full md:w-64 shrink-0 border rounded-lg p-4 bg-white shadow-sm">
        <h2 className="font-semibold mb-4">{t("creative.advanced_filters")}</h2>

        <div className="mb-4">
          <p className="font-medium text-sm">{t("creative.budget_range")}</p>
          <input
            type="range"
            min={filtersMeta?.budged_range?.min ?? 0}
            max={filtersMeta?.budged_range?.max ?? 10000}
            className="w-full mt-3 accent-teal-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>${filtersMeta?.budged_range?.min ?? 0}</span>
            <span>${filtersMeta?.budged_range?.max ?? 10000}+ </span>
          </div>
        </div>

        <div className="mb-4">
          <p className="font-medium text-sm">{t("creative.industries")}</p>
          <div className="mt-2 space-y-2 text-xs">
            {filtersMeta?.industries
              ? Object.values(filtersMeta.industries).map((ind, i) => (
                  <label key={i} className="flex items-center space-x-2">
                    <input type="checkbox" className="accent-teal-500" />
                    <span>{tryTranslate(ind)}</span>
                  </label>
                ))
              : defaultIndustries.map((ind, i) => (
                  <label key={i} className="flex items-center space-x-2">
                    <input type="checkbox" className="accent-teal-500" />
                    <span>{tryTranslate(ind)}</span>
                  </label>
                ))}
          </div>
        </div>

        {filtersConfigDynamic.map((filter, idx) => (
          <div key={idx} className="mb-3">
            <CustomDropdown
              label={filter.label}
              options={filter.options}
              value={selectedFilters[filter.label] || filter.options[0]}
              setValue={(val) => setSelectedFilters((prev) => ({ ...prev, [filter.label]: val }))}
            />
          </div>
        ))}
      </div>
    );
  };

  const ActiveFilterChips = () => {
    const active = Object.entries(selectedFilters).filter(([label, val]) => val && !val.startsWith(t("creative.all")));
    if (active.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 items-center">
        {active.map(([label, val]) => (
          <div key={label} className="flex items-center bg-gray-100 px-3 py-2 rounded-md text-xs">
            <span>{label}: <strong className="ml-1">{val}</strong></span>
            <button onClick={() => clearFilter(label)} className="ml-2 text-gray-600">✕</button>
          </div>
        ))}
        <button onClick={clearAllFilters} className="ml-2 text-xs border px-3 py-1.5 rounded-md font-semibold hover:bg-gray-100">
          {t("creative.clear_all")}
        </button>
      </div>
    );
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

  return (
    <div className="bg-white min-h-screen w-full">
      <div className="md:max-w-[80%] justify-center mx-auto">
        {/* Top Navigation */}
        <div className="flex flex-wrap items-center justify-between px-2 md:px-0 py-4 gap-3">
          <Link
            to="/home"
            className="text-black font-medium text-xs hover:bg-gray-200 rounded-md px-3 py-2 flex items-center"
          >
            <FaArrowLeft className="mr-2" /> {t("creative.back_to_home")}
          </Link>
          <h1 className="text-center text-lg md:text-xl font-bold flex-1">{t("creative.title")}</h1>
          <button className="px-4 py-2 text-xs bg-teal-500 text-white rounded-md">
            {t("creative.count_creatives", { count: creatives.length })}
          </button>
        </div>

        {/* Search + Sort */}
        <div className="px-2 md:px-0 py-4 space-y-3 border-b">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("creative.search_placeholder")}
            className="flex-1 form-input w-full"
          />
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-3 sm:space-y-0">
            <div className="w-48">
              <CustomDropdown
                options={sortOptions}
                value={sort}
                setValue={setSort}
              />
            </div>

            <div className="ml-2">
              <ActiveFilterChips />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:space-x-6 my-5">
          {/* Sidebar (Desktop) */}
          <div className="hidden md:block">
            <SidebarFilters />
          </div>
          {/* Sidebar (Mobile) */}
          <div className="md:hidden mb-4">
            <SidebarFilters />
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 w-full">
            {loading ? (
              <p className="text-gray-500"><SpinnerProvider/></p>
            ) : creatives.length === 0 ? (
              <p className="text-gray-500">{t("creative.no_creatives")}</p>
            ) : (
              creatives.map((creative) => {
                const availability = getAvailability(creative);
                const rating = typeof creative?.rating === "number" ? creative.rating.toFixed(1) : "—";
                const reviews = creative?.total_reviews ?? 0;
                const name = creative?.user?.full_name || t("creative.anonymous");
                const title = creative?.user?.profile?.title || "—";
                const years = creative?.experience_in_year ?? "0";
                const level = creative?.experience_in_level
                  ? String(creative.experience_in_level).charAt(0).toUpperCase() +
                  String(creative.experience_in_level).slice(1)
                  : "—";
                const workStyle =
                  creative?.on_site_active === "1" && creative?.is_remote_active === "0" 
                    ? t("creative.on_site")
                    : creative?.is_remote_active === "1" && creative?.on_site_active === "0"
                      ? t("creative.remote_ok")
                      : t("creative.remote_ok_on_site");

                const profileSrc = creative?.user?.profile?.profile_picture || DEFAULT_AVATAR;

                return (
                  <div
                    key={creative.id}
                    className="border rounded-xl p-4 shadow-sm bg-white"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <span className="flex items-center bg-black text-white text-xs px-2 py-1 rounded-md">
                        <FaStar className="mr-1" /> {rating}
                        {Number(reviews) > 0 && <span className="ml-1 opacity-80">({reviews})</span>}
                      </span>
                      <span className={`flex items-center text-xs px-2 py-1 rounded-md ${availability.badge}`}>
                        ● {availability.label}
                      </span>
                    </div>

                    {/* Profile */}
                    <div className="flex items-center mt-4">
                      <img
                        src={profileSrc}
                        alt={name}
                        className="w-14 h-14 rounded-full object-cover border"
                        onError={(e) => {
                          if (e.currentTarget.src !== DEFAULT_AVATAR) {
                            e.currentTarget.src = DEFAULT_AVATAR;
                          }
                        }}
                      />
                      <div className="ml-3">
                        <h3 className="font-bold text-sm">{name}</h3>
                        <p className="text-xs text-gray-600">{title}</p>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-xs font-regular text-gray-500 mt-3 line-clamp-4">
                      {creative?.personal_intro || t("creative.no_intro")}
                    </p>

                    {/* Meta */}
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-y-1 text-xs text-gray-500">
                      <p className="flex items-center">
                        <FaMapMarkerAlt className="mr-2" /> {getLocationText(creative)}
                      </p>
                      <p className="flex items-center">
                        <FaClock className="mr-2" /> {years}+ {t("creative.years")}
                      </p>
                      <p className="flex items-center">
                        <FaBriefcase className="mr-2" /> {level} {t("creative.level")}
                      </p>
                      <p className="flex items-center">
                        <FaGlobe className="mr-2" /> {workStyle}
                      </p>
                    </div>

                    <SkillChips skills={creative?.user?.skills} />

                    {/* Button */}
                    <button
                      onClick={() => setOpen(true)}
                      className="w-full mt-4 bg-teal-500 text-white text-xs font-semibold py-2 rounded-md hover:bg-teal-600"
                    >
                      {t("creative.view_profile")}
                    </button>
                  </div>
                );
              })
            )}
          </div>

          <ViewProfilePopupModel isOpen={open} onClose={() => setOpen(false)} />
        </div>
      </div>
    </div>
  );
};

export default CreativeDirectory;
  