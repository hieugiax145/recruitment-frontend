import { Colors } from "../../constants/colors";
import { cn } from "../../utils/utils";

const Button = ({ children, onClick, className, ...props }) => {
  return (
    <div
      className={
        cn(
        `inline-flex items-center justify-center
        px-4 py-2 h-9 rounded-md font-medium shadow-sm
        hover:opacity-90 transition-opacity duration-200 cursor-pointer select-none`,
        className
      )}
      style={{ backgroundColor: Colors.primary, color: "#fff" }}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Button;