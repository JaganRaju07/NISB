"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { OFFICIAL_ROSTER_MEMBERS, OFFICIAL_SOCIETIES } from "@/lib/official-roster";

export function SocietyAccordion() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="mt-10">
      {OFFICIAL_SOCIETIES.map((society) => {
        const isOpen = open === society.slug;
        const officers = OFFICIAL_ROSTER_MEMBERS.filter((member) =>
          member.societySlug === society.slug || (society.slug === "ieee-ras" && member.designation.includes("RAS"))
        );
        return (
          <div key={society.slug} className="society-row">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`society-${society.slug}`}
              onClick={() => setOpen(isOpen ? null : society.slug)}
              className="grid w-full items-center gap-4 py-5 text-left md:grid-cols-[72px_220px_1fr_44px]"
            >
              <span className="logo-chip h-12 w-12"><Image src={society.logoUrl} alt="" width={36} height={36} sizes="36px" className="h-9 w-9 object-contain" /></span>
              <span>
                <span className="mono-label block text-[10px] text-[var(--accent)]">{society.shortName}</span>
                <span className="mt-1 block font-display text-2xl">{society.name}</span>
              </span>
              <span className="line-clamp-2 text-sm text-[var(--body)]">{society.description}</span>
              <span className="justify-self-end text-xl" aria-hidden="true">{isOpen ? "−" : "+"}</span>
            </button>
            <div id={`society-${society.slug}`} className={`society-disclosure ${isOpen ? "is-open" : ""}`}>
              <div>
                <div className="grid gap-6 pb-6 md:ml-[292px] md:grid-cols-2">
                  <p className="body-copy text-sm">{society.description}</p>
                  <div>
                    {officers.map((officer) => (
                      <Link key={officer.id} href={`/directory/${officer.id}`} className="block border-t border-[var(--line)] py-2 text-sm hover:text-[var(--accent)]">
                        {officer.fullName} · <span className="text-[var(--muted)]">{officer.designation}</span>
                      </Link>
                    ))}
                    <div className="mt-3 flex gap-4 text-sm">
                      <Link href={`/societies/${society.slug}`} className="link-slide">Chapter page</Link>
                      <a href={society.websiteUrl} target="_blank" rel="noopener noreferrer" className="link-slide">Global site ↗</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
