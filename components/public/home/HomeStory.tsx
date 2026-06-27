import { getTranslations } from "next-intl/server";

import { type Locale } from "@/i18n";

type HomeStoryProps = {
  locale: Locale;
};

export async function HomeStory({ locale }: HomeStoryProps) {
  const t = await getTranslations({
    locale,
    namespace: "home.story",
  });

  const timeline = [
    {
      year: "1995",
      title: t("timeline.1995.title"),
      description: t("timeline.1995.description"),
    },
    {
      year: "2003",
      title: t("timeline.2003.title"),
      description: t("timeline.2003.description"),
    },
    {
      year: "2013",
      title: t("timeline.2013.title"),
      description: t("timeline.2013.description"),
    },
    {
      year: "30+",
      title: t("timeline.today.title"),
      description: t("timeline.today.description"),
    },
  ];

  return (
    <section id="story" className="px-5 py-14 md:px-8 md:py-20 scroll-mt-16">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-red">
            {t("eyebrow")}
          </p>

          <h2 className="mt-3 font-display text-4xl font-bold leading-tight text-brand-green md:text-5xl">
            {t("title")}
          </h2>

          <div className="mx-auto mt-4 h-px w-20 bg-brand-sand" />

          <p className="mt-6 text-sm leading-7 text-brand-muted md:text-base">
            {t("description")}
          </p>
        </div>

        <div className="mt-10 grid md:grid-cols-4 gap-3 md:gap-6">
          {timeline.map((item, i) => (
            <div key={item.year} className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-brand-sand bg-white text-xl font-bold text-brand-green shadow-sm md:h-20 md:w-20">
                {item.year}
              </div>

              <h3 className="mt-4 text-md font-bold text-brand-red md:text-base">
                {item.title}
              </h3>

              <p className="mt-2 text-sm leading-5 text-brand-muted md:text-sm md:leading-6">
                {item.description}
              </p>
              {i !== timeline.length - 1 && (
                <span
                  className="
    block
    mx-auto
    mt-1
    h-12
    w-px
    bg-gradient-to-b
    from-transparent
    via-brand-greenLight/80
    to-transparent
    md:hidden
  "
                />
              )}
            </div>
          ))}
        </div>

        {/* <div className="mt-14 rounded-3xl border border-brand-sand bg-white/70 p-5 text-center shadow-sm md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-green">
            {t("platformsTitle")}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {platformLogos.map((platform) => (
              <div
                key={platform.name}
                className="flex h-16 items-center justify-center rounded-2xl border border-brand-sand bg-white px-4 shadow-sm"
              >
                <Image
                  src={platform.src}
                  alt={platform.name}
                  width={150}
                  height={42}
                  className="max-h-9 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </section>
  );
}
