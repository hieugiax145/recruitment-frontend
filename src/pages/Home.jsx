import { toast } from "react-toastify";

export default function Home() {
  return (
    <div>
      Home<button onClick={() => toast("hello")}></button>
    </div>
  );
}
