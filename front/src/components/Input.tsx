import type { ElementType } from "react";

const Input = ({
  type,
  title,
  value,
  placeholder,
  onChange,
  icon: Icon,
}: {
  type: "text" | "email" | "password";
  title: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  icon?: ElementType;
}) => {
  return (
    <div className="space-y-3">
      <legend className="text-slate-300 text-sm font-medium">{title}</legend>
      <div className="relative">
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          className="input pl-10"
          onChange={(e) => onChange(e.target.value)}
        />
        {Icon && (
          <Icon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-5 opacity-60" />
        )}
      </div>
    </div>
  );
};
export default Input;
