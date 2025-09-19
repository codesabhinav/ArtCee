import React, { useRef } from "react";
import {
  UserIcon,
  MapPinIcon,
  BriefcaseIcon,
  StarIcon,
  CameraIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "../../contexts/LanguageProvider";

const stepsConfig = [
  { id: 1, key: "personal_info", icon: UserIcon },
  { id: 2, key: "location", icon: MapPinIcon },
  { id: 3, key: "professional", icon: BriefcaseIcon },
  { id: 4, key: "services_skills", icon: StarIcon },
  { id: 5, key: "portfolio_social", icon: CameraIcon },
  { id: 6, key: "rates_pricing", icon: CurrencyDollarIcon },
  { id: 7, key: "profile_settings", icon: Cog6ToothIcon },
];

const StepProgress = ({ currentStep = 1, onChangeStep = () => {} }) => {
  const { t } = useTranslation();
  const trackRef = useRef(null);

  const percent = Math.min(100, Math.max(0, (currentStep / stepsConfig.length) * 100));

  return (
    <div className="w-full max-w-5xl mx-auto ">
      <h1 className="text-2xl font-bold text-center">{t("join.title")}</h1>
      <p className="text-center text-gray-600 my-3 font-light text-sm">{t("join.subtitle")}</p>

      <div className="relative w-full bg-gray-200 rounded-full h-1.5 mb-6">
        <div
          className="bg-black h-1.5 rounded-full transition-all"
          style={{ width: `${percent}%` }}
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          role="progressbar"
        />
      </div>

      <div className="relative">
        <div
          ref={trackRef}
          className="flex overflow-x-auto scrollbar snap-x snap-mandatory space-x-6 md:justify-between md:overflow-visible md:snap-none"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {stepsConfig.map((step, index) => {
            const Icon = step.icon;
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;

            return (
              <div
                key={step.id}
                className="snap-center flex-shrink-0 flex flex-col items-center text-center min-w-[5.5rem] md:min-w-0"
              >
                <button
                  type="button"
                  onClick={() => onChangeStep(stepNumber)}
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                    isActive
                      ? "bg-teal-400 border-teal-500 text-white"
                      : isCompleted
                      ? "border-green-500 text-green-600 bg-transparent"
                      : "bg-gray-100 border-gray-300 text-gray-500"
                  }`}
                  aria-current={isActive ? "step" : undefined}
                  aria-label={t(`join.steps.${step.key}`)}
                  title={t(`join.steps.${step.key}`)}
                >
                  <Icon className="w-5 h-5" />
                </button>

                <span
                  className={`mt-2 text-xs font-medium ${
                    isActive ? "text-teal-500" : isCompleted ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {t(`join.steps.${step.key}`)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StepProgress;
