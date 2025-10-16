import { Colors } from "../../constants/colors";

const Button = ({ children, onClick }) => {
  return (
    <button className="block mx-auto text-center"
      style={{ backgroundColor: Colors.primary, color: "#fff" }}
      onClick={onClick} 
    >
      {children}
    </button>
  );
};

export default Button;
