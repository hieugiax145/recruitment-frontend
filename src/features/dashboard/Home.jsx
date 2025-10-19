import { toast } from "react-toastify";
import { userServices } from "../../services/userServices";

export default function Home() {
  return (
    <div>
      Home<button onClick={() => userServices.getCurrentUser()}></button>
    </div>
  );
}
