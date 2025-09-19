// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { FaUser, FaShieldAlt, FaCalendarAlt, FaUserCheck } from "react-icons/fa";

// const AgeVerificationModal = ({ isOpen, onClose, onSubmit, formData, setFormData }) => {
//   const [method, setMethod] = useState("dob"); // "dob" or "declaration"
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (isOpen) {
//       document.body.classList.add("overflow-hidden");
//     } else {
//       document.body.classList.remove("overflow-hidden");
//     }
//     return () => {
//       document.body.classList.remove("overflow-hidden");
//     };
//   }, [isOpen]);

//   if (!isOpen) return null;

//   // ✅ Calculate age from formData.date_of_birth
//   const calculateAge = () => {
//     if (!formData.date_of_birth) return null;

//     const [year, month, day] = formData.date_of_birth.split("-").map(Number);
//     if (!year || !month || !day) return null;

//     const birthDate = new Date(year, month - 1, day);
//     const today = new Date();

//     let calculatedAge = today.getFullYear() - birthDate.getFullYear();
//     const m = today.getMonth() - birthDate.getMonth();
//     if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
//       calculatedAge--;
//     }

//     return calculatedAge;
//   };

//   // ✅ Validation + update formData
//   const handleVerify = async () => {
//     let userAge = 0;

//     if (method === "dob") {
//       userAge = calculateAge();
//       if (!userAge) {
//         setError("Please select a valid date of birth.");
//         toast.error("Please select a valid date of birth.");
//         return;
//       }
//       setFormData((prev) => ({
//         ...prev,
//         date_of_birth_type: "date",
//         age: userAge.toString(),
//       }));
//     } else {
//       if (!formData.age) {
//         setError("Please enter your age.");
//         toast.error("Please enter your age.");
//         return;
//       }
//       userAge = parseInt(formData.age, 10);
//       setFormData((prev) => ({
//         ...prev,
//         date_of_birth_type: "age",
//         age: userAge.toString(),
//         date_of_birth: "",
//       }));
//     }

//     if (userAge < 18) {
//       setError("You must be at least 18 years old.");
//       toast.error("You must be at least 18 years old.");
//       return;
//     }

//     setError("");
//     toast.success("Age verified successfully!");
//     if (onSubmit) await onSubmit();
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
//       <div className="bg-white rounded-lg w-full max-w-md shadow-lg p-6 max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="flex justify-between items-start">
//           <h2 className="text-lg font-semibold">Age Verification</h2>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-xl">✕</button>
//         </div>

//         {/* Top Icon */}
//         <div className="flex justify-center my-4">
//           <div className="w-14 h-14 flex items-center justify-center rounded-full bg-teal-500">
//             <FaUser className="text-white text-2xl" />
//           </div>
//         </div>

//         <h3 className="text-sm font-bold text-center mb-2">Age Verification Required</h3>
//         <p className="text-sm font-light text-gray-600 text-center mb-6">
//           We need to verify your age to comply with privacy regulations and ensure appropriate protections.
//         </p>

//         {/* Privacy Notice */}
//         <div className="border rounded-lg p-4 mb-6 flex space-x-3">
//           <FaShieldAlt className="text-gray-600 mt-1" />
//           <div>
//             <p className="font-bold text-gray-600 text-xs">Privacy First:</p>
//             <p className="text-xs font-light text-gray-600">
//               Your age information is used only for compliance and account protection. We follow strict GDPR guidelines.
//             </p>
//           </div>
//         </div>

//         {/* Verification Method */}
//         <div className="border rounded-lg p-4 mb-6">
//           <h4 className="text-sm font-medium mb-3">Choose Verification Method</h4>
//           <div className="space-y-3">
//             {/* DOB */}
//             <label
//               className={`flex items-center justify-between border rounded-lg p-3 cursor-pointer ${method === "dob" ? "bg-teal-50 border-teal-400" : "hover:bg-gray-50"
//                 }`}
//               onClick={() => setMethod("dob")}
//             >
//               <div className="flex items-center space-x-2">
//                 <FaCalendarAlt className="text-teal-500" />
//                 <div>
//                   <p className="font-medium text-sm">Date of Birth (Recommended)</p>
//                   <p className="text-xs text-gray-500">More secure and accurate</p>
//                 </div>
//               </div>
//               <input type="radio" checked={method === "dob"} readOnly />
//             </label>

//             {/* Age Declaration */}
//             <label
//               className={`flex items-center justify-between border rounded-lg p-3 cursor-pointer ${method === "declaration" ? "bg-teal-50 border-teal-400" : "hover:bg-gray-50"
//                 }`}
//               onClick={() => setMethod("declaration")}
//             >
//               <div className="flex items-center space-x-2">
//                 <FaUserCheck className="text-teal-500" />
//                 <div>
//                   <p className="font-medium text-sm">Age Declaration</p>
//                   <p className="text-xs text-gray-500">Simply enter your current age</p>
//                 </div>
//               </div>
//               <input type="radio" checked={method === "declaration"} readOnly />
//             </label>
//           </div>
//         </div>

//         {/* Conditional Input */}
//         {method === "dob" ? (
//           <div className="border rounded-lg p-4 mb-6">
//             <h4 className="text-sm font-medium mb-3">Enter Your Date of Birth</h4>
//             <div className="flex space-x-3">
//               {/* Month */}
//               <select
//                 className="border rounded-md p-2 w-1/3 text-sm"
//                 value={formData.date_of_birth.split("-")[1] || ""}
//                 onChange={(e) => {
//                   const [y, , d] = formData.date_of_birth.split("-");
//                   const month = e.target.value.padStart(2, "0");
//                   setFormData((prev) => ({
//                     ...prev,
//                     date_of_birth_type: "date",
//                     date_of_birth: y && d ? `${y}-${month}-${d}` : `${y}-${month}`,
//                   }));
//                 }}
//               >
//                 <option value="">Month</option>
//                 {[
//                   "January", "February", "March", "April", "May", "June",
//                   "July", "August", "September", "October", "November", "December"
//                 ].map((m, i) => (
//                   <option key={i} value={String(i + 1).padStart(2, "0")}>
//                     {m}
//                   </option>
//                 ))}
//               </select>


//               {/* Day */}
//               <select
//                 className="border rounded-md p-2 w-1/3 text-sm"
//                 value={formData.date_of_birth.split("-")[2] || ""}
//                 onChange={(e) => {
//                   const [y, m] = formData.date_of_birth.split("-");
//                   const day = e.target.value.padStart(2, "0");
//                   setFormData((prev) => ({
//                     ...prev,
//                     date_of_birth_type: "date",
//                     date_of_birth: y && m ? `${y}-${m}-${day}` : `${y}-${day}`,
//                   }));
//                 }}
//               >
//                 <option value="">Day</option>
//                 {Array.from({ length: 31 }, (_, i) => (
//                   <option key={i + 1} value={i + 1}>{i + 1}</option>
//                 ))}
//               </select>

//               {/* Year */}
//               <select
//                 className="border rounded-md p-2 w-1/3 text-sm"
//                 value={formData.date_of_birth.split("-")[0] || ""}
//                 onChange={(e) => {
//                   const [, m, d] = formData.date_of_birth.split("-");
//                   const year = e.target.value;
//                   setFormData((prev) => ({
//                     ...prev,
//                     date_of_birth_type: "date",
//                     date_of_birth: m && d ? `${year}-${m}-${d}` : `${year}`,
//                   }));
//                 }}
//               >
//                 <option value="">Year</option>
//                 {Array.from({ length: 100 }, (_, i) => {
//                   const year = new Date().getFullYear() - i;
//                   return <option key={year} value={year}>{year}</option>;
//                 })}
//               </select>
//             </div>
//           </div>
//         ) : (
//           <div className="border rounded-lg p-4 mb-6">
//             <h4 className="text-sm font-medium mb-3">Enter Your Age</h4>
//             <input
//               type="number"
//               placeholder="Enter your age"
//               value={formData.age}
//               onChange={(e) =>
//                 setFormData((prev) => ({
//                   ...prev,
//                   date_of_birth_type: "age",
//                   age: e.target.value,
//                   date_of_birth: "",
//                 }))
//               }
//               className="border rounded-md p-2 w-full text-sm"
//             />
//           </div>
//         )}

//         {error && <p className="text-red-500 text-xs mb-4 text-center">{error}</p>}

//         {/* Footer */}
//         <div className="flex justify-between space-x-3">
//           <button onClick={onClose} className="flex-1 px-4 py-2 text-xs border rounded-md text-gray-700 hover:bg-gray-100">Cancel</button>
//           <button onClick={handleVerify} className="flex-1 px-4 py-2 bg-teal-400 text-xs text-white rounded-md hover:bg-teal-500">Verify Age</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AgeVerificationModal;


// src/components/AgeVerificationModal.jsx
// src/components/modals/AgeVerificationModal.jsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaUser, FaShieldAlt, FaCalendarAlt, FaUserCheck } from "react-icons/fa";
import { useTranslation } from "../../contexts/LanguageProvider";

const safeSplitDOB = (dob) => (typeof dob === "string" && dob.length ? dob.split("-") : []);

const AgeVerificationModal = ({ isOpen, onClose, onSubmit, formData = {}, setFormData }) => {
  const { t } = useTranslation();


  const [method, setMethod] = useState("dob");
  const [localYear, setLocalYear] = useState("");
  const [localMonth, setLocalMonth] = useState("");
  const [localDay, setLocalDay] = useState("");
  const [localAge, setLocalAge] = useState("");
  const [error, setError] = useState("");

  const months = (t("age_verification.months") || "January|February|March|April|May|June|July|August|September|October|November|December").split("|");

  useEffect(() => {
    if (!isOpen) return;

    const dtype = formData?.date_of_birth_type || "date";
    setMethod(dtype === "age" ? "declaration" : "dob");

    const [y, m, d] = safeSplitDOB(formData?.date_of_birth || "");
    setLocalYear(y || "");
    setLocalMonth(m || "");
    setLocalDay(d || "");
    setLocalAge(formData?.age ? String(formData.age) : "");
    setError("");
  }, [isOpen, formData]);

  // prevent body scroll while modal is open
  useEffect(() => {
    if (isOpen) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  if (!isOpen) return null;

  const calculateAgeFromLocal = () => {
    const year = Number(localYear);
    const month = Number(localMonth);
    const day = Number(localDay);
    if (!year || !month || !day) return null;

    const birthDate = new Date(year, month - 1, day);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const handleVerify = async () => {
    setError("");
    let userAge = null;

    if (method === "dob") {
      userAge = calculateAgeFromLocal();
      if (userAge === null || userAge < 0) {
        const msg = t("age_verification.errors.invalid_dob");
        setError(msg);
        toast.error(msg);
        return;
      }

      const monthStr = String(localMonth).padStart(2, "0");
      const dayStr = String(localDay).padStart(2, "0");
      const dobString = `${localYear}-${monthStr}-${dayStr}`;


      setFormData((prev) => ({
        ...prev,
        date_of_birth_type: "date",
        date_of_birth: dobString,
        age: String(userAge),
      }));
    } else {

      if (!localAge) {
        const msg = t("age_verification.errors.enter_age");
        setError(msg);
        toast.error(msg);
        return;
      }
      const parsed = parseInt(localAge, 10);
      if (Number.isNaN(parsed)) {
        const msg = t("age_verification.errors.enter_age");
        setError(msg);
        toast.error(msg);
        return;
      }
      userAge = parsed;

      setFormData((prev) => ({
        ...prev,
        date_of_birth_type: "age",
        age: String(userAge),
        date_of_birth: "",
      }));
    }

    if (userAge < 18) {
      const msg = t("age_verification.errors.underage");
      setError(msg);
      toast.error(msg);
      return;
    }

    setError("");
    toast.success(t("age_verification.success"));
    if (onSubmit) await onSubmit();
    onClose();
  };

  const selectMethod = (m, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setMethod(m);
    setError("");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg w-full max-w-md shadow-lg p-6 max-h-[90vh] overflow-y-auto scrollbar-hide">
        {/* Header */}
        <div className="flex justify-between items-start">
          <h2 className="text-sm font-semibold">{t("age_verification.title")}</h2>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="text-gray-500 hover:text-gray-800 text-sm"
            aria-label={t("age_verification.close")}
          >
            ✕
          </button>
        </div>

        {/* Icon */}
        <div className="flex justify-center my-4">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-teal-500">
            <FaUser className="text-white text-2xl" />
          </div>
        </div>

        <h3 className="text-sm font-bold text-center mb-2">{t("age_verification.heading")}</h3>
        <p className="text-xs font-regular text-gray-600 text-center mb-6">{t("age_verification.subheading")}</p>

        {/* Privacy */}
        <div className="border rounded-lg p-4 mb-6 flex space-x-3">
          <FaShieldAlt className="text-gray-600 mt-1" />
          <div>
            <p className="font-bold text-gray-600 text-xs">{t("age_verification.privacy_title")}</p>
            <p className="text-xs font-light text-gray-600">{t("age_verification.privacy_body")}</p>
          </div>
        </div>

        {/* Method selector */}
        <div className="border rounded-lg p-4 mb-6">
          <h4 className="text-xs font-semibold mb-3">{t("age_verification.choose_method")}</h4>
          <div className="space-y-3">
            <button
              type="button"
              onClick={(e) => selectMethod("dob", e)}
              className={`w-full text-left flex items-start justify-start border rounded-lg p-3 ${method === "dob" ? "bg-teal-50 border-teal-400" : "hover:bg-gray-50"}`}
            >
              <input type="radio" checked={method === "dob"} readOnly />
              <div className="ml-2">
                <div className="flex flex-row gap-2">
                  <FaCalendarAlt className="text-teal-500 h-3 w-3" />
                  <p className="font-semibold text-xs">{t("age_verification.method_dob.title")}</p>
                </div>
                <p className="text-[10px] text-gray-500">{t("age_verification.method_dob.desc")}</p>
              </div>
            </button>

            <button
              type="button"
              onClick={(e) => selectMethod("declaration", e)}
              className={`w-full text-left flex items-start justify-start border rounded-lg p-3 ${method === "declaration" ? "bg-teal-50 border-teal-400" : "hover:bg-gray-50"}`}
            >
              <input type="radio" checked={method === "declaration"} readOnly />
              <div className="ml-2">
                <div className="flex flex-row gap-2">
                  <FaUserCheck className="text-teal-500 h-3 w-3" />
                  <p className="font-semibold text-xs">{t("age_verification.method_decl.title")}</p>
                </div>
                <p className="text-[10px] text-gray-500">{t("age_verification.method_decl.desc")}</p>
              </div>

            </button>
          </div>
        </div>

        {/* Conditional inputs (local only) */}
        {method === "dob" ? (
          <div className="border rounded-lg p-4 mb-6">
            <h4 className="text-xs font-semibold mb-3">{t("age_verification.enter_dob")}</h4>
            <div className="flex space-x-3">
              <select
                className="border form-input rounded-md p-2 w-1/3 text-xs"
                value={localMonth || ""}
                onChange={(e) => setLocalMonth(String(e.target.value).padStart(2, "0"))}
              >
                <option value="">{t("age_verification.month_placeholder")}</option>
                {months.map((m, i) => (
                  <option key={i} value={String(i + 1).padStart(2, "0")}>{m}</option>
                ))}
              </select>

              <select
                className="border form-input rounded-md p-2 w-1/3 text-xs"
                value={localDay || ""}
                onChange={(e) => setLocalDay(String(e.target.value))}
              >
                <option value="">{t("age_verification.day_placeholder")}</option>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1} value={String(i + 1)}>{i + 1}</option>
                ))}
              </select>

              <select
                className="border form-input rounded-md p-2 w-1/3 text-xs"
                value={localYear || ""}
                onChange={(e) => setLocalYear(e.target.value)}
              >
                <option value="">{t("age_verification.year_placeholder")}</option>
                {Array.from({ length: 100 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return <option key={year} value={String(year)}>{year}</option>;
                })}
              </select>
            </div>
          </div>
        ) : (
          <div className="border rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium mb-3">{t("age_verification.enter_age")}</h4>
            <input
              type="number"
              placeholder={t("age_verification.age_placeholder")}
              value={localAge || ""}
              onChange={(e) => setLocalAge(e.target.value)}
              className="border rounded-md p-2 w-full text-sm"
            />
          </div>
        )}

        {error && <p className="text-red-500 text-xs mb-4 text-center">{error}</p>}

        {/* Footer */}
        <div className="flex justify-between space-x-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="flex-1 px-4 py-2 text-xs border rounded-md text-gray-700 hover:bg-gray-100"
          >
            {t("age_verification.cancel")}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleVerify();
            }}
            className="flex-1 px-4 py-2 bg-teal-400 text-xs text-white rounded-md hover:bg-teal-500"
          >
            {t("age_verification.verify")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgeVerificationModal;
