import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import DeleteUpdateDialog from "@/components/DeleteUpdateDialog";
import { useToast } from "@/components/ui/use-toast";
import { PlusCircle, Trash2, Loader2, Pencil } from "lucide-react";
import { ICON_MAP } from "@/lib/adminIcons";

const AdminUpdates = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const { data: updates = [], isLoading } = useQuery({
    queryKey: ["admin-updates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("updates")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("updates").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-updates"] });
      setDeleteTarget(null);
      toast({ title: "Update deleted" });
    },
    onError: () => {
      toast({ title: "Failed to delete update", variant: "destructive" });
    },
  });

  return (
    <div className="max-w-5xl mx-auto w-full min-w-0">
      <DeleteUpdateDialog
        target={deleteTarget}
        isPending={deleteMutation.isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={(id) => deleteMutation.mutate(id)}
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5 sm:mb-6">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            Updates
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {updates.length} update{updates.length === 1 ? "" : "s"}
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => navigate("/admin/dashboard/updates/create")}
          className="gap-2 shrink-0 w-full sm:w-auto"
        >
          <PlusCircle className="h-4 w-4" />
          New Update
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      )}

      {!isLoading && updates.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 py-16 sm:py-24 text-center px-2">
          <p className="text-sm text-gray-400">No updates yet.</p>
          <Button
            variant="link"
            size="sm"
            className="mt-2 text-sirdash-500"
            onClick={() => navigate("/admin/dashboard/updates/create")}
          >
            Create the first one
          </Button>
        </div>
      )}

      {!isLoading && updates.length > 0 && (
        <div className="flex flex-col gap-3">
          {updates.map((u) => {
            const IconComp = ICON_MAP[u.icon];
            return (
              <div
                key={u.id}
                className="flex flex-col sm:flex-row sm:items-stretch gap-3 sm:gap-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 sm:p-4 group"
              >
                <div className="flex flex-1 min-w-0 gap-3 sm:gap-4">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="h-9 w-9 rounded-lg bg-sirdash-50 dark:bg-sirdash-900/30 flex items-center justify-center border border-sirdash-100 dark:border-sirdash-800">
                      {IconComp ? (
                        <IconComp className="h-4 w-4 text-sirdash-500" />
                      ) : (
                        <span className="text-sirdash-400 text-xs font-medium">
                          {u.icon?.slice(0, 2).toUpperCase() || "—"}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 pr-1">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm leading-snug break-words">
                          {u.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{u.date}</p>
                      </div>
                      <div className="flex items-center gap-0.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:transition-opacity flex-shrink-0 -mr-1 sm:mr-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 sm:h-7 sm:w-7 text-gray-500 hover:text-sirdash-500"
                          onClick={() =>
                            navigate(`/admin/dashboard/updates/edit/${u.id}`)
                          }
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 sm:h-7 sm:w-7 text-gray-500 hover:text-red-500"
                          disabled={
                            deleteMutation.isPending &&
                            deleteTarget?.id === u.id
                          }
                          onClick={() =>
                            setDeleteTarget({ id: u.id, title: u.title })
                          }
                          aria-label={`Delete update: ${u.title}`}
                        >
                          {deleteMutation.isPending &&
                          deleteTarget?.id === u.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </div>
                    {u.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2 break-words">
                        {u.description}
                      </p>
                    )}
                  </div>
                </div>

                {u.img && (
                  <div className="flex-shrink-0 w-full sm:w-auto flex sm:block justify-center sm:justify-end sm:self-center">
                    <img
                      src={u.img}
                      alt={u.title}
                      className="h-20 w-full max-w-xs sm:max-w-none sm:h-16 sm:w-28 object-contain rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-1"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminUpdates;
