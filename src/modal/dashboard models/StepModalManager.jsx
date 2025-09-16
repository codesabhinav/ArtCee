import React from "react";
import BasicInfoModal from "./BasicInfoModal";
import LocationModal from "./LocationModal";
import PersonalIntroModal from "./PersonalIntroModal";
import UploadProfileModal from "./UploadProfileModal";
import EmailVerifyModal from "./EmailVerifyModal";

const STEP_COMPONENTS = {
    BASIC_INFO: BasicInfoModal,
    LOCATION: LocationModal,
    PERSONAL_INTRO: PersonalIntroModal,
    PROFILE_IMAGE_VID: UploadProfileModal,
    EMAIL_VERIFY: EmailVerifyModal,
    PERSONAL_BIO: "Professional Bio",
    SERVICE_SKILL_ADDED: "Services & Skills",
    PORTIFLIO_WORK: "Portfolio Work",
    SOCAIL_LINK: "Social Media Links",
    PRICING_INFO: "Pricing Information",
};

const StepModalManager = ({ stepKey, isOpen, onClose, initialData, onSaved }) => {
    if (!isOpen || !stepKey) return null;

    const Comp = STEP_COMPONENTS[stepKey];
    if (!Comp) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white p-6 rounded-md">No editor implemented for: {stepKey}
                    <div className="mt-4 text-right">
                        <button className="px-3 py-1 border rounded" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        );
    }

    return <Comp isOpen={isOpen} onClose={onClose} initialData={initialData} onSaved={onSaved} />;
};

export default StepModalManager;
