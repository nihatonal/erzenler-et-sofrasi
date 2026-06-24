import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export default async function QrPage({
  params,
}: Props) {
  const { locale, slug } = await params;

  redirect(`/${locale}/menu?table=${slug}`);
}