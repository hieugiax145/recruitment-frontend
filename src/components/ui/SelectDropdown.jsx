import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../utils/utils";

export default function SelectDropdown({
  label,
  options = [],
  id,
  isRow,
  onChange = () => {},
  placeholder,
  className,
  required
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [selectedValue, setSelectedValue] = useState("");
  const selectedOption = options.find((option) => option.id === id);

  const displayLabel = selectedOption ? selectedOption.name: placeholder;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleOptionClick = (optionValue) => {
    // onChange(optionValue);
    setSelectedValue(optionValue.name);
    setIsOpen(false);
  };

  return (
    <div className={`flex ${isRow ? "items-center gap-4" : "flex-col gap-2"}`}>
      <label className="block text-gray-700" htmlFor={label}>
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <div className={cn("relative w-full", className)} ref={dropdownRef}>
        <div
          tabIndex="0"
          className={cn(
            `border border-gray-300 p-2 rounded-md text-gray-700
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-between`,
            className
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={cn(!selectedOption && "text-gray-500")}>
            {selectedValue || displayLabel}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-gray-400 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </div>

        {isOpen && (
          <ul
            className="absolute z-10 mt-1 w-full
                     max-h-60 overflow-y-auto
                     rounded-md bg-white py-1
                     shadow-lg ring-1 ring-black ring-opacity-5"
            role="listbox"
          >
            {options.map((option) => (
              <li
                key={option.id}
                className={cn(
                  "relative cursor-pointer select-none px-3 py-2 text-sm",
                  "text-gray-900 hover:bg-gray-100",
                  option.id === id && "font-semibold bg-gray-100"
                )}
                onClick={() => handleOptionClick(option)}
                role="option"
                aria-selected={option.name === name}
              >
                {option.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
