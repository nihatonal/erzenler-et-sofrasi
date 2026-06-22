import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type UploadProductImageArgs = {
  file: File;
  slug: string;
};

export async function uploadProductImage({
  file,
  slug,
}: UploadProductImageArgs) {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log("UPLOAD SESSION", session);

  const fileExt = file.name.split(".").pop()?.toLowerCase() || "webp";

  const safeSlug =
    slug
      .trim()
      .toLowerCase()
      .replaceAll("ğ", "g")
      .replaceAll("ü", "u")
      .replaceAll("ş", "s")
      .replaceAll("ı", "i")
      .replaceAll("ö", "o")
      .replaceAll("ç", "c")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "product";

  const fileName = `${safeSlug}-${Date.now()}.${fileExt}`;
  const filePath = `products/${fileName}`;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(filePath);

  return data.publicUrl;
}
