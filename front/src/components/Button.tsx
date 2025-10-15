import clsx from "clsx";
import { Loader } from "lucide-react";

type Props = {
  type?: "submit" | "button";
  style?: "default" | "outline";
  text: string;
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
  onClick: () => void;
};

const Button = (props: Props) => {
  const {
    text,
    type = "button",
    style = "default",
    className,
    disabled = false,
    isLoading = false,
    onClick,
  } = props;

  return (
    <button
      type={type}
      className={clsx(
        "w-full cursor-pointer hover:opacity-70 translate-[opacity] duration-300 rounded-lg py-2 font-medium flex justify-center", // common
        {
          "bg-slate-700 text-slate-200": style === "default", // default
        },
        {
          "border-1 border-slate-200 text-slate-200": style === "outline", // outline
        },
        className
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {isLoading ? <Loader className="animate-spin" /> : text}
    </button>
  );
};
export default Button;
