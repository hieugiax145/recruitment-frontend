const TextInput = ({ label, type, value, onChange, required=false }) => {
  return (
    <div className="flex flex-col ">
      <label className="block mb-2 text-gray-700" htmlFor={label}>
        {label}
      </label>
      <input
        className="border border-gray-300 p-2 rounded-md text-gray-700
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        type={type}
        id={label}
        name={label}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};

export default TextInput;
