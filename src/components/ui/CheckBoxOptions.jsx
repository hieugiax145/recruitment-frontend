export default function CheckBoxOptions({
  label,
  options=[],
  selectedValues=[],
  onChange,
  isRow = false,
  required = false,
}) {
  

  return (
    <div className={`flex ${isRow ? "items-center gap-4" : "flex-col gap-2"}`}>
      <label className="block text-gray-700" htmlFor={label}>
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <div className={`flex flex-wrap gap-4 ${isRow ? "" : "flex-col"}`}>
        {options.map((option) => (
          <CheckBoxInput
            key={option.id}
            label={option.name}
            checked={selectedValues.includes(option.id)}
            onChange={onChange}
            value={option.id}
          />
        ))}
      </div>
    </div>
  );
}
const CheckBoxInput = ({ label, checked, onChange, value }) => {
  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id={label}
        checked={checked}
        onChange={() => onChange(value)}
        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
      <label htmlFor={label} className="text-gray-700">
        {label}
      </label>
    </div>
  );
};
