import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useTranslation } from "../contexts/LanguageProvider";
const safeHtml = (str) => (typeof str === "string" ? str : "");

const PolicyModal = ({ open, onClose, initialTab = "overview" }) => {
  const { t } = useTranslation();
  const tabs = [
    { key: "overview", label: t("policy.tabs.overview") },
    { key: "dataWeCollect", label: t("policy.tabs.dataWeCollect") },
    { key: "howWeUseData", label: t("policy.tabs.howWeUseData") },
    { key: "dataSharing", label: t("policy.tabs.dataSharing") },
    { key: "minors", label: t("policy.tabs.minors") },
    { key: "gdprRights", label: t("policy.tabs.gdprRights") },
    { key: "dataSecurity", label: t("policy.tabs.dataSecurity") },
    { key: "contact", label: t("policy.tabs.contact") },
    { key: "cookiePolicy", label: t("policy.tabs.cookiePolicy") },
    { key: "termsOfService", label: t("policy.tabs.termsOfService") },
    { key: "dataSecurityPolicy", label: t("policy.tabs.dataSecurityPolicy") },
  ];

  const [active, setActive] = useState(initialTab);
  const dialogRef = useRef(null);
  const previouslyFocused = useRef(null);

   useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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
        const idx = tabs.findIndex((t) => t.key === active);
        if (idx === -1) return;
        const next =
          e.key === "ArrowDown"
            ? tabs[(idx + 1) % tabs.length]
            : tabs[(idx - 1 + tabs.length) % tabs.length];
        setActive(next.key);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, active, onClose, tabs]);

  if (!open) return null;

  const renderHtml = (key) => {
    const html = t(`policy.content.${key}`);
    return (
      <div
        className="prose max-w-none prose-sm"
        dangerouslySetInnerHTML={{ __html: safeHtml(html) }}
      />
    );
  };

  const renderDataSecurityPolicy = () => {
    const overview = t("policy.content.dataSecurityPolicy.overview");
    const sections = t("policy.content.dataSecurityPolicy.sections") || [];
    const contact = t("policy.content.dataSecurityPolicy.contact") || "";
    return (
      <div>
        <div
          className="prose max-w-none prose-sm"
          dangerouslySetInnerHTML={{ __html: safeHtml(overview) }}
        />
        {Array.isArray(sections) &&
          sections.map((s, idx) => (
            <section key={idx} className="mt-4">
              <h4 className="font-semibold text-sm">{s.heading}</h4>
              <div
                dangerouslySetInnerHTML={{ __html: safeHtml(s.html) }}
                className="prose max-w-none prose-sm"
              />
            </section>
          ))}
        <div
          className="mt-4 prose max-w-none prose-sm"
          dangerouslySetInnerHTML={{ __html: safeHtml(contact) }}
        />
      </div>
    );
  };

  const contentRenderer = {
    overview: () => renderHtml("overview"),
    dataWeCollect: () => renderHtml("dataWeCollect"),
    howWeUseData: () => renderHtml("howWeUseData"),
    dataSharing: () => renderHtml("dataSharing"),
    minors: () => renderHtml("minors"),
    gdprRights: () => renderHtml("gdprRights"),
    dataSecurity: () => renderHtml("dataSecurity"),
    contact: () => renderHtml("contact"),
    cookiePolicy: () => renderHtml("cookiePolicy"),
    termsOfService: () => renderHtml("termsOfService"),
    dataSecurityPolicy: () => renderDataSecurityPolicy(),
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="bg-white w-full max-w-3xl md:max-w-4xl lg:max-w-5xl h-[92vh] md:h-auto rounded-xl shadow-2xl overflow-hidden
                   flex flex-col md:grid md:grid-cols-12"
      >
        {/* MOBILE: top scrollable tabs (hidden on md+) */}
        <div className="md:hidden border-b">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-lg">🔒</div>
              <h3 className="text-sm font-semibold">{t("policy.header")}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded text-gray-600 hover:bg-gray-100"
              aria-label={t("policy.close_aria")}
            >
              <X size={18} />
            </button>
          </div>

          <nav
            className="overflow-x-auto px-2 py-2 -mb-1"
            aria-label={t("policy.nav_aria")}
          >
            <ul className="flex gap-2 whitespace-nowrap">
              {tabs.map((tab) => (
                <li key={tab.key} className="flex-shrink-0">
                  <button
                    onClick={() => setActive(tab.key)}
                    className={`px-3 py-2 rounded-full text-xs font-medium transition-colors
                      ${active === tab.key ? "bg-teal-600 text-white shadow" : "bg-white text-gray-700 border border-gray-100 hover:bg-gray-50"}`}
                    aria-current={active === tab.key ? "true" : undefined}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* DESKTOP: left sidebar (hidden on small screens) */}
        <aside className="hidden md:block md:col-span-4 bg-gradient-to-b from-white to-teal-50 p-4 border-r overflow-auto">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-lg">
              🔒
            </div>
            <h3 className="text-base font-semibold">{t("policy.header")}</h3>
          </div>

          <nav className="flex-1" aria-label={t("policy.nav_aria")}>
            <ul className="space-y-1">
              {tabs.map((tab) => (
                <li key={tab.key}>
                  <button
                    onClick={() => setActive(tab.key)}
                    className={`w-full text-left px-2 py-2 rounded-md text-sm transition-colors
                      ${active === tab.key ? "bg-teal-600 text-white shadow" : "text-gray-700 hover:bg-gray-100"}`}
                    aria-current={active === tab.key ? "true" : undefined}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Right content */}
        <main className="col-span-12 md:col-span-8 p-4 relative overflow-auto">
          {/* Mobile close on top-right is in mobile header; keep a close button for md+ */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded text-gray-600 hover:bg-gray-100 md:inline-flex hidden"
            aria-label={t("policy.close_aria")}
          >
            <X size={18} />
          </button>

          <div className="mb-3">
            <h2 className="text-lg font-bold">
              {tabs.find((t) => t.key === active)?.label ?? ""}
            </h2>
          </div>

          <div className="text-sm text-gray-700 space-y-4">
            {contentRenderer[active] ? contentRenderer[active]() : <p>{t("policy.no_content")}</p>}
          </div>

          {/* bottom spacing so content isn't flush to the bottom on small screens */}
          <div className="h-6 md:hidden" />
        </main>
      </div>
    </div>
  );
};

export default PolicyModal;
