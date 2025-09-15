// // PolicyModal.jsx
// import { useState, useEffect, useRef } from "react";
// import { X } from "lucide-react";
// import { useTranslation } from "../contexts/LanguageProvider";

// const leftTabKeys = [
//   "overview",
//   "dataWeCollect",
//   "howWeUseData",
//   "dataSharing",
//   "minors",
//   "gdprRights",
//   "dataSecurity",
//   "contact",
//   "cookiePolicy",
//   "termsOfService",
//   "dataSecurityPolicy",
// ];

// const PolicyModal = ({ open, onClose, initialTab = "overview" }) => {
//   const { t } = useTranslation();
//   const [active, setActive] = useState(initialTab);
//   const dialogRef = useRef(null);
//   const previouslyFocused = useRef(null);

//   useEffect(() => {
//     if (open) {
//       setActive(initialTab);
//       previouslyFocused.current = document.activeElement;
//       setTimeout(() => dialogRef.current?.focus(), 0);
//       document.body.style.overflow = "hidden";
//     }
//     return () => {
//       document.body.style.overflow = "";
//       if (previouslyFocused.current) previouslyFocused.current.focus?.();
//     };
//   }, [open, initialTab]);

//   useEffect(() => {
//     const onKey = (e) => {
//       if (!open) return;
//       if (e.key === "Escape") onClose();
//       if (e.key === "ArrowDown" || e.key === "ArrowUp") {
//         e.preventDefault();
//         const idx = leftTabKeys.findIndex((k) => k === active);
//         if (idx === -1) return;
//         const next =
//           e.key === "ArrowDown"
//             ? leftTabKeys[(idx + 1) % leftTabKeys.length]
//             : leftTabKeys[(idx - 1 + leftTabKeys.length) % leftTabKeys.length];
//         setActive(next);
//       }
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [open, active, onClose]);

//   if (!open) return null;

//   const renderHtml = (key) => {
//     const html = t(`policy.${key}.html`);
//     return <div className="prose max-w-none prose-sm" dangerouslySetInnerHTML={{ __html: html }} />;
//   };

//   // Data Security special renderer because it's structured (overview + sections)
//   const renderDataSecurity = () => {
//     const overview = t("policy.dataSecurity.overview");
//     // sections is an array in translations — some translation loaders return arrays, others strings.
//     // We attempt to fetch a JSON-stringified array first; LanguageProvider implementation must support arrays for this key.
//     const sections = t("policy.dataSecurity.sections", { returnObjects: true }) || [];
//     const contact = t("policy.dataSecurity.contact");
//     return (
//       <div>
//         <div className="prose max-w-none prose-sm" dangerouslySetInnerHTML={{ __html: overview }} />
//         {Array.isArray(sections) &&
//           sections.map((s, idx) => (
//             <section key={idx} className="mt-4">
//               <h4 className="font-semibold text-sm">{s.heading}</h4>
//               <div dangerouslySetInnerHTML={{ __html: s.html }} />
//             </section>
//           ))}
//         <div className="mt-4" dangerouslySetInnerHTML={{ __html: contact }} />
//       </div>
//     );
//   };

//   const contentMap = {
//     overview: () => renderHtml("overview"),
//     dataWeCollect: () => renderHtml("dataWeCollect"),
//     howWeUseData: () => renderHtml("howWeUseData"),
//     dataSharing: () => renderHtml("dataSharing"),
//     minors: () => renderHtml("minors"),
//     gdprRights: () => renderHtml("gdprRights"),
//     dataSecurity: () => renderHtml("dataSecurity"), // backwards-compatible: if you prefer structured object, use dataSecurityPolicy below
//     contact: () => renderHtml("contact"),
//     cookiePolicy: () => renderHtml("cookiePolicy"),
//     termsOfService: () => renderHtml("termsOfService"),
//     dataSecurityPolicy: () => renderDataSecurity(),
//   };

//   const tabLabel = (key) => t(`policy.tabs.${key}`);

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2" role="dialog" aria-modal="true">
//       <div
//         ref={dialogRef}
//         tabIndex={-1}
//         className="bg-white w-full max-w-2xl h-auto rounded-xl shadow-2xl grid grid-cols-12 overflow-hidden"
//       >
//         {/* Left sidebar */}
//         <aside className="col-span-4 md:col-span-4 bg-gradient-to-b from-white to-teal-50 p-4 border-r">
//           <div className="flex items-center gap-2 mb-4">
//             <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-lg">🔒</div>
//             <h3 className="text-base font-semibold">{t("policy.sidebar_title")}</h3>
//           </div>

//           <nav className="flex-1 overflow-auto pr-1" aria-label={t("policy.nav_aria_label")}>
//             <ul className="space-y-1">
//               {leftTabKeys.map((key) => (
//                 <li key={key}>
//                   <button
//                     onClick={() => setActive(key)}
//                     className={`w-full text-left px-2 py-1 rounded-md text-sm transition-colors
//                       ${active === key ? "bg-teal-600 text-white shadow" : "text-gray-700 hover:bg-gray-100"}`}
//                   >
//                     {tabLabel(key)}
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </nav>
//         </aside>

//         {/* Right content */}
//         <main className="col-span-8 md:col-span-8 p-4 relative max-h-[70vh] overflow-auto bg-white">
//           <button
//             onClick={onClose}
//             className="absolute top-3 right-3 p-1 rounded text-gray-600 hover:bg-gray-100"
//             aria-label={t("policy.close_aria")}
//           >
//             <X size={18} />
//           </button>

//           <div className="mb-3">
//             <h2 className="text-lg font-bold">{tabLabel(active)}</h2>
//           </div>

//           <div className="text-sm text-gray-700">
//             {contentMap[active] ? contentMap[active]() : <p>{t("policy.no_content")}</p>}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default PolicyModal;

// PolicyModal.jsx
import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useTranslation } from "../contexts/LanguageProvider";

const leftTabKeys = [
  "overview",
  "dataWeCollect",
  "howWeUseData",
  "dataSharing",
  "minors",
  "gdprRights",
  "dataSecurity",
  "contact",
  "cookiePolicy",
  "termsOfService",
  "dataSecurityPolicy",
];

const PolicyModal = ({ open, onClose, initialTab = "overview" }) => {
  const { t } = useTranslation();
  const [active, setActive] = useState(initialTab);
  const dialogRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    if (open) {
      setActive(initialTab);
      previouslyFocused.current = document.activeElement;
      setTimeout(() => dialogRef.current?.focus(), 0);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
      if (previouslyFocused.current) previouslyFocused.current.focus?.();
    };
  }, [open, initialTab]);

  useEffect(() => {
    const onKey = (e) => {
      if (!open) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const idx = leftTabKeys.findIndex((k) => k === active);
        if (idx === -1) return;
        const next =
          e.key === "ArrowDown"
            ? leftTabKeys[(idx + 1) % leftTabKeys.length]
            : leftTabKeys[(idx - 1 + leftTabKeys.length) % leftTabKeys.length];
        setActive(next);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, active, onClose]);

  if (!open) return null;

  const renderHtml = (key) => {
    const html = t(`policy.${key}.html`);
    return <div className="prose max-w-none prose-sm" dangerouslySetInnerHTML={{ __html: html }} />;
  };

  // Data Security special renderer because it's structured (overview + sections)
  const renderDataSecurity = () => {
    const overview = t("policy.dataSecurity.overview");
    // sections is an array in translations — some translation loaders return arrays, others strings.
    // We attempt to fetch a JSON-stringified array first; LanguageProvider implementation must support arrays for this key.
    const sections = t("policy.dataSecurity.sections", { returnObjects: true }) || [];
    const contact = t("policy.dataSecurity.contact");
    return (
      <div>
        <div className="prose max-w-none prose-sm" dangerouslySetInnerHTML={{ __html: overview }} />
        {Array.isArray(sections) &&
          sections.map((s, idx) => (
            <section key={idx} className="mt-4">
              <h4 className="font-semibold text-sm">{s.heading}</h4>
              <div dangerouslySetInnerHTML={{ __html: s.html }} />
            </section>
          ))}
        <div className="mt-4" dangerouslySetInnerHTML={{ __html: contact }} />
      </div>
    );
  };

  const contentMap = {
    overview: () => renderHtml("overview"),
    dataWeCollect: () => renderHtml("dataWeCollect"),
    howWeUseData: () => renderHtml("howWeUseData"),
    dataSharing: () => renderHtml("dataSharing"),
    minors: () => renderHtml("minors"),
    gdprRights: () => renderHtml("gdprRights"),
    dataSecurity: () => renderHtml("dataSecurity"), // backwards-compatible: if you prefer structured object, use dataSecurityPolicy below
    contact: () => renderHtml("contact"),
    cookiePolicy: () => renderHtml("cookiePolicy"),
    termsOfService: () => renderHtml("termsOfService"),
    dataSecurityPolicy: () => renderDataSecurity(),
  };

  const tabLabel = (key) => t(`policy.tabs.${key}`);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2" role="dialog" aria-modal="true">
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="bg-white w-full max-w-2xl h-auto rounded-xl shadow-2xl grid grid-cols-12 overflow-hidden"
      >
        {/* Left sidebar */}
        <aside className="col-span-4 md:col-span-4 bg-gradient-to-b from-white to-teal-50 p-4 border-r">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-lg">🔒</div>
            <h3 className="text-base font-semibold">{t("policy.sidebar_title")}</h3>
          </div>

          <nav className="flex-1 overflow-auto pr-1" aria-label={t("policy.nav_aria_label")}>
            <ul className="space-y-1">
              {leftTabKeys.map((key) => (
                <li key={key}>
                  <button
                    onClick={() => setActive(key)}
                    className={`w-full text-left px-2 py-1 rounded-md text-sm transition-colors
                      ${active === key ? "bg-teal-600 text-white shadow" : "text-gray-700 hover:bg-gray-100"}`}
                  >
                    {tabLabel(key)}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Right content */}
        <main className="col-span-8 md:col-span-8 p-4 relative max-h-[70vh] overflow-auto bg-white">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded text-gray-600 hover:bg-gray-100"
            aria-label={t("policy.close_aria")}
          >
            <X size={18} />
          </button>

          <div className="mb-3">
            <h2 className="text-lg font-bold">{tabLabel(active)}</h2>
          </div>

          <div className="text-sm text-gray-700">
            {contentMap[active] ? contentMap[active]() : <p>{t("policy.no_content")}</p>}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PolicyModal;
