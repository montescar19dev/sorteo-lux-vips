import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { User } from "@/types/User";

const API_URL = import.meta.env.VITE_API_URL;

export const useUsers = (token: string | null) => {
  return useQuery<User[]>({
    queryKey: ["users", token],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.users; // asegúrate de que el backend devuelva { users: [...] }
    },
    enabled: !!token,
  });
};

export const useCreateUser = (token: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newUser: Partial<User>) => {
      const response = await axios.post(`${API_URL}/users`, newUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", token] });

    },
  });
};

export const useToggleUserStatus = (token: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      const response = await axios.patch(
        `${API_URL}/users/${userId}/toggle-status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", token] });
    },
  });
};
