import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import { SITE_URL } from "@/lib/site";
import { JsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/jsonld";

const LINKEDIN_URL = "https://www.linkedin.com/in/pragyan-sharma-b4665bb4/";

export const metadata: Metadata = {
  title: { absolute: "AkshaAstra — Indian Mythology Sci-Fi Noir Webcomic" },
  description:
    "A Shiva Purana-rooted mythology fused with sci-fi noir. Step into Rudrakshi's warm world, Tamasa Andhakara's cold world, or the border city of Vaitarandor.",
};

export default function Home() {
  return (
    <>
      <JsonLd
        data={organizationJsonLd({
          name: "AkshaAstra Comics",
          alternateName: "AkshaAstra",
          url: SITE_URL,
          logo: `${SITE_URL}/logo.png`,
          description:
            "An original Indian mythology-fused sci-fi noir webcomic universe rooted in Shiva Purana mythology, following the warm world of Rudrakshi and the cold world of Tamasa Andhakara.",
          founder: {
            name: "Pragyan Sharma",
            jobTitle: "Creative Director & Founder",
            url: `${SITE_URL}/about`,
            sameAs: [LINKEDIN_URL],
          },
          sameAs: [LINKEDIN_URL],
        })}
      />
      <JsonLd data={websiteJsonLd({ name: "AkshaAstra Comics", url: SITE_URL })} />
      <HomeClient />
    </>
  );
}
