import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Notification } from "./types";

const QUERY_KEY = ["notifications"] as const;

async function fetchNotifications(): Promise<Notification[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) throw new Error(error.message);

  return data.map((row) => ({
    id: row.id,
    type: row.type,
    title: row.title,
    message: row.message,
    read: row.read,
    createdAt: row.created_at,
  }));
}

async function markAllRead() {
  const { error } = await supabase.from("notifications").update({ read: true }).eq("read", false);
  if (error) throw new Error(error.message);
}

async function markOneRead(id: string) {
  const { error } = await supabase.from("notifications").update({ read: true }).eq("id", id);
  if (error) throw new Error(error.message);
}

export function useNotifications() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("notification_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications" }, () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchNotifications,
  });

  const markAllReadMutation = useMutation({
    mutationFn: markAllRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  const markOneReadMutation = useMutation({
    mutationFn: markOneRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  const unreadCount = query.data?.filter((n) => !n.read).length ?? 0;

  return {
    notifications: query.data ?? [],
    unreadCount,
    isLoading: query.isLoading,
    markAllRead: markAllReadMutation.mutate,
    markOneRead: markOneReadMutation.mutate,
  };
}
