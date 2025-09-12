import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { FaCheck, FaChevronDown } from "react-icons/fa";

const CustomDropdown = ({ label, options, value, setValue }) => {
  return (
    <div className="">
      {label ? <p className="font-medium mb-1 text-sm">{label}</p> : null}
      <Listbox value={value} onChange={setValue}>
        <div className="relative">
          {/* Button */}
          <Listbox.Button className="relative w-full cursor-default rounded-md form-input py-2 pl-3 pr-10 text-left shadow-sm text-xs">
            <span className="block truncate">{value}</span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <FaChevronDown className="h-3 w-3 text-gray-400" />
            </span>
          </Listbox.Button>

          {/* Options */}
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-xs z-10">
              {options.map((opt, idx) => (
                <Listbox.Option
                  key={idx}
                  value={opt}
                  className={({ active }) =>
                    `relative cursor-default select-none m-1 px-2 py-2 rounded-md ${
                      active ? "bg-gray-200 text-gray-900" : "text-gray-900"
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-normal" : "font-normal"
                        }`}
                      >
                        {opt}
                      </span>
                      {selected && (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400">
                          <FaCheck className="h-3 w-3" />
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default CustomDropdown;
