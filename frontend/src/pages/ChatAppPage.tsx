import Signout from "@/components/auth/signout";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import React from "react";
import { toast } from "sonner";

const ChatAppPage = () => {
  const user = useAuthStore((s) => s.user); //only rerender when user change
  const handleOnCLick = async () => {
    try {
      await api.get("/users/test", { withCredentials: true });
      toast.success("ok ok ok");
    } catch (error) {
      toast.error("di r ong giao a");
      console.error(error);
    }
  };
  return (
    <div>
      {user?.username}
      <Signout />

      <Button onClick={handleOnCLick}>test</Button>
    </div>
  );
};

export default ChatAppPage;
