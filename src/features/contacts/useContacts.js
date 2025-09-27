import { useQuery, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";

export default function useContacts(page = 1, size = 10) {
  return useQuery({
    queryKey: ["contacts", page, size],
    queryFn: async () => {
      const res = await axiosInstance.get(`/webhook/contacts?page=${page}&size=${size}`);
      return res.data;
    },
  });
}

export function useUpdateContact() {
  const queryClient = useQueryClient();
  
  return async (contact_id, contactData) => {
    try {
      const res = await axiosInstance.put(`/webhook/contacts/${contact_id}`, contactData);
      // Invalidate both regular and infinite contacts queries
      await queryClient.invalidateQueries({ queryKey: ["contacts"] });
      await queryClient.invalidateQueries({ queryKey: ["infiniteContacts"] });
      toast.success("Contact updated successfully!");
      // window.location.reload();
      return res.data;
    } catch (error) {
      toast.error(error.message || "Failed to update contact");
      throw error;
    }
  };
}

export function useDeleteContact() {
  const queryClient = useQueryClient();
  
  return async (contact_id) => {
    try {
      const res = await axiosInstance.delete(`/webhook/contacts/${contact_id}`);
      // Invalidate both regular and infinite contacts queries
      await queryClient.invalidateQueries({ queryKey: ["contacts"] });
      await queryClient.invalidateQueries({ queryKey: ["infiniteContacts"] });
      toast.success("Contact deleted successfully!");
      // window.location.reload();
      return res.data;
    } catch (error) {
      toast.error(error.message || "Failed to delete contact");
      throw error;
    }
  };
}

export function useCreateContact() {
  const queryClient = useQueryClient();
  
  return async (contactData) => {
    try {
      const res = await axiosInstance.post(`/webhook/contacts`, contactData);
      // Invalidate both regular and infinite contacts queries
      await queryClient.invalidateQueries({ queryKey: ["contacts"] });
      await queryClient.invalidateQueries({ queryKey: ["infiniteContacts"] });
      toast.success("Contact created successfully!");
      // window.location.reload();
      return res.data;
    } catch (error) {
      toast.error(error.message || "Failed to create contact");
      throw error;
    }
  };
}

export function useBulkImportContacts() {
  const queryClient = useQueryClient();
  
  return async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axiosInstance.post(`/webhook/contacts/bulk-import`, formData);
      // Invalidate both regular and infinite contacts queries
      await queryClient.invalidateQueries({ queryKey: ["contacts"] });
      await queryClient.invalidateQueries({ queryKey: ["infiniteContacts"] });
      toast.success("Contacts imported successfully!");
      // window.location.reload();
      return res.data;
    } catch (error) {
      toast.error(error.message || "Failed to import contacts");
      throw error;
    }
  };
}

export function useInfiniteContacts(pageSize = 10) {
  return useInfiniteQuery({
    queryKey: ["infiniteContacts"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axiosInstance.get(`/webhook/contacts?page=${pageParam}&size=${pageSize}`);
      return res.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.contacts || lastPage.contacts.length === 0) return undefined;
      const totalContacts = lastPage.totalContacts || lastPage.total || 0;
      const fetched = allPages.reduce((sum, page) => sum + (page.contacts?.length || 0), 0);
      if (fetched >= totalContacts) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
  });
} 