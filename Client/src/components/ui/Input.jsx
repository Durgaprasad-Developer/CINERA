export default function Input({
  label,
  error,
  ...props
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm text-gray-300">
          {label}
        </label>
      )}
      <input
        className="bg-gray-800 text-white px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-red-600"
        {...props}
      />
      {error && (
        <span className="text-xs text-red-500">
          {error}
        </span>
      )}
    </div>
  );
}
