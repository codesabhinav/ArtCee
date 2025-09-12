import {
  UserIcon,
  MapPinIcon,
  BriefcaseIcon,
  StarIcon,
  CameraIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const steps = [
  { id: 1, name: "Personal Info", icon: UserIcon },
  { id: 2, name: "Location", icon: MapPinIcon },
  { id: 3, name: "Professional", icon: BriefcaseIcon },
  { id: 4, name: "Services & Skills", icon: StarIcon },
  { id: 5, name: "Portfolio & Social", icon: CameraIcon },
  { id: 6, name: "Rates & Pricing", icon: CurrencyDollarIcon },
  { id: 7, name: "Profile Settings", icon: Cog6ToothIcon },
];

const StepProgress = ({ currentStep }) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      {/* Title */}
      <h1 className="text-2xl font-bold text-center">Join ArtCee</h1>
      <p className="text-center text-gray-600 my-3 font-light text-sm">
        Where artsy people go to get discovered
      </p>

      {/* Progress bar */}
      <div className="relative w-full bg-gray-200 rounded-full h-1.5 mb-10">
        <div
          className="bg-black h-1.5 rounded-full transition-all"
          style={{ width: `${(currentStep / steps.length) * 100}%` }}
        ></div>
      </div>

      {/* Steps with icons */}
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index + 1 === currentStep;
          const isCompleted = index + 1 < currentStep;

          return (
            <div
              key={step.id}
              className="flex flex-col items-center text-center w-20"
            >
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  isActive
                    ? "bg-teal-400 border-teal-500 text-white"
                    : isCompleted
                    ? "border-green-500 text-green-600"
                    : "bg-gray-100 border-gray-300 text-gray-500"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`mt-2 text-xs font-medium ${
                  isActive
                    ? "text-teal-500"
                    : isCompleted
                    ? "border-green-500 text-green-600"
                    : "text-gray-500"
                }`}
              >
                {step.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepProgress;
