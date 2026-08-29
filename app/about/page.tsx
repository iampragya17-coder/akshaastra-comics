import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";
import { JsonLd, personJsonLd } from "@/lib/jsonld";

const PAGE_URL = `${SITE_URL}/about`;
const LINKEDIN_URL = "https://www.linkedin.com/in/pragyan-sharma-b4665bb4/";

export const metadata: Metadata = {
  title: "About the Creator",
  description:
    "Pragyan Sharma is a solo creative director and brand strategist, founder of AkshaAstra Comics — an Indian mythology-fused sci-fi noir webcomic built with an AI-native production pipeline.",
};

const sectionHeading: React.CSSProperties = {
  fontFamily: "var(--font-cinzel), serif",
  fontSize: 12,
  letterSpacing: ".3em",
  color: "#19d3c5",
  marginBottom: 8,
};

const bodyText: React.CSSProperties = {
  fontSize: 16,
  lineHeight: 1.9,
  color: "rgba(232,230,223,.75)",
  maxWidth: 680,
};

export default function AboutPage() {
  return (
    <article
      className="flex flex-col gap-8 px-6 py-16 md:px-16"
      style={{ background: "#07070c", color: "#e8e6df" }}
    >
      <JsonLd
        data={personJsonLd({
          name: "Pragyan Sharma",
          url: PAGE_URL,
          jobTitle: "AI-First Creative Producer & Brand Strategist, Founder of AkshaAstra Comics",
          description:
            "Solo creative director and brand strategist with 8+ years in content strategy, brand marketing, and AI-native creative production. Founder of AkshaAstra Comics.",
          sameAs: [LINKEDIN_URL],
          worksFor: { name: "AkshaAstra Comics" },
          alumniOf: [
            { name: "Goa Institute of Management" },
            { name: "Gujarat University" },
          ],
        })}
      />

      <Link
        href="/"
        style={{
          fontFamily: "var(--font-cinzel), serif",
          fontSize: 11,
          letterSpacing: ".3em",
          color: "#19d3c5",
        }}
      >
        ← BACK TO AKSHAASTRA
      </Link>

      <div className="flex flex-col gap-3">
        <div
          style={{
            fontFamily: "var(--font-cinzel), serif",
            fontSize: 12,
            letterSpacing: ".4em",
            color: "#19d3c5",
          }}
        >
          AI-FIRST CREATIVE PRODUCER &amp; BRAND STRATEGIST · FOUNDER, AKSHAASTRA COMICS
        </div>
        <h1
          style={{
            fontFamily: "var(--font-alfa-slab), serif",
            fontSize: "clamp(34px,4.6vw,60px)",
            lineHeight: 0.98,
            color: "#e8e6df",
            textShadow: "3px 3px 0 #000, 0 0 30px rgba(25,211,197,.35)",
          }}
        >
          ABOUT PRAGYAN SHARMA
        </h1>
      </div>

      <p style={bodyText}>
        Pragyan Sharma is a solo creative director and brand strategist with 8+ years
        translating complex ideas into business-ready narratives — from AI/ML product
        marketing to original IP development. She is the founder and creative director of
        AkshaAstra Comics, an original Indian mythology-fused sci-fi noir webcomic universe
        rooted in Shiva Purana mythology, built and produced solo using an AI-native
        production pipeline.
      </p>

      <p style={bodyText}>
        Building AkshaAstra meant designing a full production system from scratch — without
        an art department, dev team, or SEO desk: a character-consistency system to
        eliminate visual drift across 100+ AI generations using canonical CDN
        reference-locking, a search-visible website rebuilt on Next.js with server-side
        rendering after the original client-side architecture proved invisible to search
        engines, and a live Studio Command Center unifying production tracking across
        disconnected tools. That system — proven on real production, not theory — is now
        also the credibility foundation behind her consulting work helping other solo
        creators solve AI character-consistency problems in their own comic production.
      </p>

      <p style={bodyText}>
        Beyond AkshaAstra, Pragyan works at the intersection of GenAI product marketing and
        agentic automation — building multi-agent LLM workflows and packaging technical
        outcomes into brand strategy and sales enablement that converts. Her work spans
        content strategy, technical-to-business translation, and hands-on automation using
        tools like Claude Code, MCP, n8n, and Zapier.
      </p>

      <p style={bodyText}>
        Previously, she has led content and brand strategy at Moon Technolabs, Blackboard
        Radio, Bloop Communications, and 9series Inc., and served as Creative Director,
        Marketing at DRAF Club Goa. She holds a Bachelor of Commerce from Gujarat University
        and is currently completing a Post Graduate Diploma in Management at the Goa
        Institute of Management.
      </p>

      <p style={bodyText}>Based between Ahmedabad and Goa, India.</p>

      <div>
        <h2 style={sectionHeading}>CONNECT</h2>
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 16, color: "#e8e6df", textDecoration: "underline" }}
        >
          LinkedIn: linkedin.com/in/pragyan-sharma-b4665bb4
        </a>
      </div>
    </article>
  );
}
