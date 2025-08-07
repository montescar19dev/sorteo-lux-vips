import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export const useStats = (token: string) => {
  return useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const res = await axios.get("/api/stats/summary", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });
};
