import { Fragment, useMemo } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { FaCheck, FaChevronDown } from "react-icons/fa";
import { X } from "lucide-react";
import clsx from "clsx";

export default function MultiSelectDropdown({
  label,
  options = [],
  value = [],
  setValue,
  placeholder = "Select...",
  disabled = false,
}) {
  const normalized = useMemo(() => {
    return options.map((o, i) =>
      typeof o === "string" ? { id: `s-${i}`, name: o, _raw: o } : { id: o.id ?? o.name ?? `o-${i}`, name: o.name ?? o.label ?? o.id, _raw: o }
    );
  }, [options]);

  const normalizedSelected = useMemo(() => {
    if (!Array.isArray(value)) return [];
    if (value.length === 0) return [];
    const first = value[0];
    if (typeof first === "string") {
      return normalized.filter((n) => value.includes(n._raw));
    }
    return normalized.filter((n) => value.some((v) => (v?.id && String(v.id) === String(n.id)) || v === n._raw || v?.name === n.name));
  }, [value, normalized]);

  const toOutput = (selectedObjects) => {
    const origIsStringArray = options.length && typeof options[0] === "string";
    if (origIsStringArray) return selectedObjects.map((s) => s._raw);
    return selectedObjects.map((s) => (s._raw && typeof s._raw === "object" ? s._raw : { id: s.id, name: s.name }));
  };

  return (
    <div>
      {label ? <p className="font-medium mb-1 text-sm">{label}</p> : null}

      <Listbox
        value={normalizedSelected}
        onChange={(selected) => {
          const out = toOutput(Array.isArray(selected) ? selected : [selected]);
          setValue(out);
        }}
        multiple
        disabled={disabled}
      >
        <div className="relative">
          <Listbox.Button
            className={clsx(
              "relative w-full cursor-default rounded-md border form-input py-2 px-2 text-left text-xs",
              { "opacity-50 pointer-events-none bg-gray-50": disabled }
            )}
          >
            <div className="flex items-center flex-wrap gap-1">
              {normalizedSelected.length ? (
                normalizedSelected.map((s) => (
                  <span
                    key={s.id}
                    className="flex items-center gap-1 bg-gray-100 text-xs px-2 py-0.5 rounded-md border"
                    onClick={(e) => e.stopPropagation()} 
                  >
                    <span className="max-w-[180px] truncate">{s.name}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const remaining = normalizedSelected.filter((x) => x.id !== s.id);
                        const out = toOutput(remaining);
                        setValue(out);
                      }}
                      className="inline-flex p-0.5 rounded hover:bg-gray-200"
                      aria-label={`Remove ${s.name}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-gray-500 truncate">{placeholder}</span>
              )}
            </div>

            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <FaChevronDown className="h-3 w-3 text-gray-400" />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-xs z-20">
              {normalized.map((opt) => (
                <Listbox.Option
                  key={opt.id}
                  value={opt}
                  className={({ active }) =>
                    `relative cursor-default select-none px-3 py-2 m-1 rounded-md ${active ? "bg-gray-200 text-gray-900" : "text-gray-900"}`
                  }
                >
                  {({ selected }) => (
                    <>
                      <div className="flex items-center justify-between">
                        <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>{opt.name}</span>
                        {selected ? (
                          <span className="flex items-center text-gray-900">
                            <FaCheck className="w-3 h-3" />
                          </span>
                        ) : null}
                      </div>
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
}
