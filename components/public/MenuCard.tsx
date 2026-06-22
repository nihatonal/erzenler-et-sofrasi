import Image from "next/image";
import { formatCurrency } from "@/lib/utils";

type MenuCardProps = {
  title: string;
  description: string;
  price: number;
  image: string;
};

export function MenuCard({ title, description, price, image }: MenuCardProps) {
  return (
    <article className="group overflow-hidden border border-neutral-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-cardHover">
      <div className="relative h-[170px] w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          unoptimized={image.startsWith("https://")}
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 25vw"
          loading="eager"
        />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-dark-bg">{title}</h3>

        <p className="mt-3 line-clamp-2 text-sm leading-7 text-neutral-600">
          {description}
        </p>

        <div className="mt-5 text-lg font-semibold text-dark-bg">
          {formatCurrency(price)}
        </div>
      </div>
    </article>
  );
}
