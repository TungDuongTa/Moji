import { Button } from "../ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";

const Signout = () => {
  const { signOut } = useAuthStore();
  const navigate = useNavigate();
  const handleSignout = async () => {
    try {
      await signOut();
      navigate("/signin");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <Button onClick={handleSignout}>Sign Out</Button>
    </div>
  );
};

export default Signout;
