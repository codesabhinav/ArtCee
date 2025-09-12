import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

const privacyPolicy = {
  overview: {
    title: "Overview",
    html: `
      <p><strong>ArtCee</strong> (“we,” “our,” “us”) values your privacy. This Privacy Policy explains how we collect, use,
      store, and protect your personal information when you use our platform, website, and services. By creating an account, you agree to these practices.</p>
    `
  },

  dataWeCollect: {
    title: "Data We Collect",
    html: `
      <ul>
        <li><strong>Account Information:</strong> Name, email, password, profile details, and business info.</li>
        <li><strong>Portfolio & Content:</strong> Images, videos, resumes, and project files uploaded by you.</li>
        <li><strong>Payment Information:</strong> Processed securely by Stripe. We do not store credit card details.</li>
        <li><strong>Booking & Service Requests:</strong> Contact details, scheduling information, and communications.</li>
        <li><strong>Usage Data:</strong> IP address, browser type, device identifiers, session activity, approximate location.</li>
        <li><strong>Cookies & Tracking:</strong> Session cookies, analytics cookies, and authentication tokens.</li>
      </ul>
    `
  },

  howWeUseData: {
    title: "How We Use Data",
    html: `
      <ul>
        <li>Provide services (profiles, directories, jobs, bookings).</li>
        <li>Process payments, subscriptions, and invoices.</li>
        <li>Communicate with you about updates and account activity.</li>
        <li>Detect and prevent fraudulent or malicious behavior.</li>
        <li>Improve platform security and performance.</li>
        <li>With consent, send marketing updates and newsletters.</li>
      </ul>
    `
  },

  dataSharing: {
    title: "Data Sharing",
    html: `
      <p>We do not sell your personal data. We may share data with trusted providers:</p>
      <ul>
        <li>Stripe (billing & payments)</li>
        <li>Hosting providers (AWS, SiteGround, Vercel)</li>
        <li>Analytics providers (Google Analytics)</li>
        <li>Legal authorities, where required by law</li>
      </ul>
    `
  },

  minors: {
    title: "Minors & Parental Rights",
    html: `
      <p>ArtCee is not intended for children under 16. We do not knowingly collect data from minors. Any accounts suspected to belong to minors may be suspended.
      Parents or guardians may contact us to review, update, or request deletion of any data collected from a minor.</p>
    `
  },

  gdprRights: {
    title: "Your GDPR Rights",
    html: `
      <p>If you are an EU resident, you have the right to:</p>
      <ul>
        <li>Access, correct, or delete your personal data.</li>
        <li>Restrict or object to processing.</li>
        <li>Request portability of your data.</li>
        <li>File a complaint with your local Data Protection Authority.</li>
      </ul>
    `
  },

  dataSecurity: {
    title: "Data Security",
    html: `
      <p>We use industry-standard safeguards including TLS encryption, secure servers, access controls, malware scanning, and encrypted backups.
      While we strive for high security, no system is 100% secure. We comply with laws such as FOSTA-SESTA and will remove and report content involving exploitation, trafficking, or explicit sexual content where required.</p>
    `
  },

  contact: {
    title: "Contact Us",
    html: `
      <p>For privacy-related inquiries, contact: <a href="mailto:privacy@artcee.co">privacy@artcee.co</a></p>
    `
  }
};

const cookiePolicy = {
  title: "Cookie Policy",
  html: `
    <p>We use cookies to improve your experience. Categories:</p>
    <ul>
      <li><strong>Essential Cookies:</strong> Required for login, authentication, and security.</li>
      <li><strong>Functional Cookies:</strong> Store preferences such as display settings.</li>
      <li><strong>Analytics Cookies:</strong> Help us analyze performance and improve features.</li>
      <li><strong>Marketing Cookies:</strong> Used with consent for targeted promotions.</li>
    </ul>
    <p>You may manage cookies through your browser settings or opt out of non-essential cookies via our cookie banner.</p>
    <p>Contact: <a href="mailto:privacy@artcee.co">privacy@artcee.co</a></p>
  `
};

const termsOfService = {
  title: "Terms of Service (ToS)",
  html: `
    <ol>
      <li><strong>Acceptance:</strong> By using ArtCee, you agree to these Terms, Privacy Policy, and Cookie Policy.</li>
      <li><strong>Services:</strong> ArtCee offers user profiles, portfolios, job listings, business directories, bookings, and subscriptions.</li>
      <li><strong>Eligibility:</strong> Users must be at least 18 years old. Accurate information is required.</li>
      <li><strong>User Content:</strong> Users retain ownership but grant ArtCee a license to display content. Prohibited content includes illegal content, adult/explicit material, exploitation, trafficking, harassment, spam, and IP violations.</li>
      <li><strong>Payments:</strong> Subscriptions are managed via Stripe. Auto-renewal applies. No partial refunds.</li>
      <li><strong>Bookings & Jobs:</strong> ArtCee is not a party to contracts between users. Responsibility lies with businesses and users.</li>
      <li><strong>Prohibited Uses:</strong> Unlawful activity, malware, harassment, adult entertainment promotion, and trafficking are banned.</li>
      <li><strong>Intellectual Property:</strong> ArtCee branding and platform belong to Entertainment Connects LLC.</li>
      <li><strong>Termination:</strong> We may suspend/terminate accounts violating our policies.</li>
      <li><strong>Disclaimer:</strong> Services are provided “as is.” Liability is limited.</li>
      <li><strong>Governing Law:</strong> Nevada, USA.</li>
      <li><strong>Contact:</strong> <a href="mailto:legal@artcee.co">legal@artcee.co</a></li>
    </ol>
  `
};

const dataSecurityPolicy = {
  title: "Data Security Policy",
  overview: `
    <p>ArtCee is committed to safeguarding the personal and professional information of our users.
    This Data Security Policy outlines technical, administrative, and organizational measures we use
    to ensure data confidentiality, integrity, and availability. These practices align with GDPR, CCPA/CPRA, FOSTA-SESTA, and industry best standards.</p>
  `,
  sections: [
    {
      heading: "Encryption",
      html: `
        <ul>
          <li>All data in transit is protected by TLS 1.2+ encryption.</li>
          <li>Sensitive data at rest is stored with AES-256 encryption.</li>
          <li>Passwords are hashed using bcrypt or argon2.</li>
        </ul>
      `
    },
    {
      heading: "Access Controls",
      html: `
        <ul>
          <li>Role-based access controls restrict data access to authorized personnel.</li>
          <li>Two-factor authentication (2FA) required for administrative access.</li>
          <li>Staff accounts reviewed quarterly; access revoked upon termination.</li>
        </ul>
      `
    },
    {
      heading: "Infrastructure Security",
      html: `
        <ul>
          <li>Hosting providers (AWS, Vercel, SiteGround) maintain industry certifications (ISO 27001, SOC2).</li>
          <li>Firewalls, intrusion detection, malware scanning protect servers.</li>
          <li>DDoS mitigation enabled through Cloudflare/CDN partners.</li>
        </ul>
      `
    },
    {
      heading: "Monitoring & Backups",
      html: `
        <ul>
          <li>Daily backups retained for a minimum of 30 days in encrypted storage.</li>
          <li>Uptime, performance, and error logs monitored continuously.</li>
          <li>Centralized logging detects and alerts for suspicious activity.</li>
        </ul>
      `
    },
    {
      heading: "Content & Abuse Safeguards",
      html: `
        <ul>
          <li>Prohibits and removes content related to exploitation, pornography, or trafficking.</li>
          <li>Reports of prohibited content can be made at <a href="mailto:legal@artcee.co">legal@artcee.co</a>.</li>
          <li>Systems prevent promotion/storage of explicit or illegal material.</li>
        </ul>
      `
    },
    {
      heading: "Compliance",
      html: `
        <ul>
          <li>Adheres to GDPR, CCPA/CPRA, and relevant U.S. laws.</li>
          <li>Stripe manages payment processing in PCI-DSS Level 1 certified environments.</li>
          <li>Cooperates with law enforcement for CSAM, exploitation, or trafficking incidents.</li>
        </ul>
      `
    }
  ],
  contact: `<p>For questions or security concerns: <a href="mailto:privacy@artcee.co">privacy@artcee.co</a></p>`
};

const leftTabs = [
  { key: "overview", label: "Overview" },
  { key: "dataWeCollect", label: "Data We Collect" },
  { key: "howWeUseData", label: "How We Use Data" },
  { key: "dataSharing", label: "Data Sharing" },
  { key: "minors", label: "Minors & Parental Rights" },
  { key: "gdprRights", label: "Your GDPR Rights" },
  { key: "dataSecurity", label: "Data Security" },
  { key: "contact", label: "Contact Us" },
  { key: "cookiePolicy", label: "Cookie Policy" },
  { key: "termsOfService", label: "Terms of Service" },
  { key: "dataSecurityPolicy", label: "Data Security Policy" }
];

const PolicyModal = ({ open, onClose, initialTab = "overview" }) => {
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
        const idx = leftTabs.findIndex((t) => t.key === active);
        if (idx === -1) return;
        const next =
          e.key === "ArrowDown"
            ? leftTabs[(idx + 1) % leftTabs.length]
            : leftTabs[(idx - 1 + leftTabs.length) % leftTabs.length];
        setActive(next.key);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, active, onClose]);

  if (!open) return null;

  const renderHtml = (html) => (
    <div className="prose max-w-none prose-sm" dangerouslySetInnerHTML={{ __html: html }} />
  );

  const renderDataSecurity = () => (
    <div>
      <div dangerouslySetInnerHTML={{ __html: dataSecurityPolicy.overview }} />
      {dataSecurityPolicy.sections.map((s, idx) => (
        <section key={idx} className="mt-4">
          <h4 className="font-semibold text-sm">{s.heading}</h4>
          <div dangerouslySetInnerHTML={{ __html: s.html }} />
        </section>
      ))}
      <div className="mt-4" dangerouslySetInnerHTML={{ __html: dataSecurityPolicy.contact }} />
    </div>
  );

  const contentMap = {
    overview: () => renderHtml(privacyPolicy.overview.html),
    dataWeCollect: () => renderHtml(privacyPolicy.dataWeCollect.html),
    howWeUseData: () => renderHtml(privacyPolicy.howWeUseData.html),
    dataSharing: () => renderHtml(privacyPolicy.dataSharing.html),
    minors: () => renderHtml(privacyPolicy.minors.html),
    gdprRights: () => renderHtml(privacyPolicy.gdprRights.html),
    dataSecurity: () => renderHtml(privacyPolicy.dataSecurity.html),
    contact: () => renderHtml(privacyPolicy.contact.html),
    cookiePolicy: () => renderHtml(cookiePolicy.html),
    termsOfService: () => renderHtml(termsOfService.html),
    dataSecurityPolicy: () => renderDataSecurity()
  };

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
            <h3 className="text-base font-semibold">Privacy Policy & GDPR Rights</h3>
          </div>

          <nav className="flex-1 overflow-auto pr-1" aria-label="Policy sections">
            <ul className="space-y-1">
              {leftTabs.map((tab) => (
                <li key={tab.key}>
                  <button
                    onClick={() => setActive(tab.key)}
                    className={`w-full text-left px-2 py-1 rounded-md text-sm transition-colors
                      ${active === tab.key ? "bg-teal-600 text-white shadow" : "text-gray-700 hover:bg-gray-100"}`}
                  >
                    {tab.label}
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
            aria-label="Close"
          >
            <X size={18} />
          </button>

          <div className="mb-3">
            <h2 className="text-lg font-bold">
              {leftTabs.find((t) => t.key === active)?.label ?? ""}
            </h2>
          </div>

          <div className="text-sm text-gray-700">
            {contentMap[active] ? contentMap[active]() : <p>No content available.</p>}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PolicyModal;
