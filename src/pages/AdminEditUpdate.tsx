import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ImagePlus } from "lucide-react";
import { ICON_OPTIONS } from "@/lib/adminIcons";

interface UpdateForm {
  title: string;
  description: string;
  date: string;
  icon: string;
}

const AdminEditUpdate = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<UpdateForm>({
    title: "",
    description: "",
    date: "",
    icon: "",
  });
  const [existingImg, setExistingImg] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!id) return;
    const fetchUpdate = async () => {
      const { data, error } = await supabase
        .from("updates")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        toast({ title: "Update not found", variant: "destructive" });
        navigate("/admin/dashboard/updates");
        return;
      }

      setForm({
        title: data.title ?? "",
        description: data.description ?? "",
        date: data.date ?? "",
        icon: data.icon ?? "",
      });
      setExistingImg(data.img ?? null);
      setLoading(false);
    };

    void fetchUpdate();
  }, [id, navigate, toast]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.date || !form.icon) {
      toast({
        title: "Please fill in all fields and pick an icon",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    let imgUrl = existingImg;

    if (imageFile) {
      const ext = imageFile.name.split(".").pop() ?? "png";
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("update-images")
        .upload(filename, imageFile);

      if (uploadError) {
        toast({
          title: "Image upload failed",
          description: uploadError.message,
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("update-images")
        .getPublicUrl(filename);

      imgUrl = urlData.publicUrl;
    }

    const { error: updateError } = await supabase
      .from("updates")
      .update({ ...form, img: imgUrl })
      .eq("id", id as string);

    setSubmitting(false);

    if (updateError) {
      toast({
        title: "Failed to save update",
        description: updateError.message,
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Update saved successfully" });
    queryClient.invalidateQueries({ queryKey: ["admin-updates"] });
    navigate("/admin/dashboard/updates");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 sm:py-24 min-h-[12rem]">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  const displayedImage = imagePreview ?? existingImg;

  return (
    <div className="max-w-xl mx-auto w-full min-w-0">
      <div className="mb-5 sm:mb-6">
        <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
          Edit Update
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Make changes and save to update the changelog entry.
        </p>
      </div>

      <form
        onSubmit={(e) => void handleSave(e)}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 flex flex-col gap-4 sm:gap-5"
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="e.g. Full MSSQL Support"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe the update..."
            rows={4}
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Icon</Label>
          <div className="grid grid-cols-2 min-[400px]:grid-cols-3 sm:grid-cols-5 gap-2">
            {ICON_OPTIONS.map(({ name, Icon, label }) => (
              <button
                key={name}
                type="button"
                onClick={() => setForm((f) => ({ ...f, icon: name }))}
                title={label}
                className={`flex flex-col items-center gap-1.5 rounded-lg border px-2 sm:px-3 py-2.5 text-[11px] sm:text-xs font-medium transition-colors min-h-[4.5rem] sm:min-h-0 ${
                  form.icon === name
                    ? "border-sirdash-500 bg-sirdash-50 text-sirdash-600 dark:bg-sirdash-900/30 dark:text-sirdash-400 dark:border-sirdash-500"
                    : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/40"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="text-center leading-tight">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Image</Label>
          <button
            type="button"
            className={`relative w-full flex flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors cursor-pointer ${
              displayedImage
                ? "border-sirdash-300 dark:border-sirdash-700"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            {displayedImage ? (
              <img
                src={displayedImage}
                alt="Preview"
                className="w-full max-h-48 object-cover rounded-lg"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 py-8 text-gray-400">
                <ImagePlus className="h-8 w-8" />
                <span className="text-sm">Click to upload image</span>
                <span className="text-xs">PNG, JPG, WEBP</span>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </button>
          {displayedImage && (
            <button
              type="button"
              className="text-xs text-gray-400 hover:text-red-500 self-start transition-colors"
              onClick={() => {
                setImageFile(null);
                setImagePreview(null);
                setExistingImg(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
            >
              Remove image
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 pt-2">
          <Button
            type="submit"
            disabled={submitting}
            className="gap-2 w-full sm:w-auto"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full sm:w-auto"
            onClick={() => navigate("/admin/dashboard/updates")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditUpdate;
