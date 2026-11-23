import Image from "next/image";
import Link from "next/link";
import {
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa6";
import { OFFICIAL_CONTACT } from "@/lib/official-roster";

export function Footer({ className = "" }: { className?: string }) {
  const socials = [
    { href: OFFICIAL_CONTACT.socials.instagram, label: "Instagram", Icon: FaInstagram },
    { href: OFFICIAL_CONTACT.socials.linkedin, label: "LinkedIn", Icon: FaLinkedin },
    { href: OFFICIAL_CONTACT.socials.youtube, label: "YouTube", Icon: FaYoutube },
    { href: OFFICIAL_CONTACT.socials.github, label: "GitHub", Icon: FaGithub },
  ];

  return (
    <footer id="contact" className={`border-t border-[var(--line)] bg-[var(--surface)] ${className}`}>
      <div className="site-container hairline-grid py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <section className="lg:col-span-5" aria-labelledby="contact-heading">
            <p className="mono-label">07 / Contact</p>
            <h2 id="contact-heading" className="mt-5">Let&apos;s build<br />together.</h2>
            <address className="mt-8 not-italic text-[15px] leading-7 text-[var(--body)]">
              {OFFICIAL_CONTACT.address}<br />
              <a className="link-slide" href={`tel:${OFFICIAL_CONTACT.phone.replace(/\s+/g, "")}`}>{OFFICIAL_CONTACT.phone}</a><br />
              <a className="link-slide" href={`mailto:${OFFICIAL_CONTACT.email}`}>{OFFICIAL_CONTACT.email}</a>
            </address>
            <p className="mono-label mt-6">Chairperson · {OFFICIAL_CONTACT.chairperson}</p>
          </section>

          <div className="map-filter lg:col-span-7">
            <iframe
              title="The National Institute of Engineering, Mysuru"
              src={OFFICIAL_CONTACT.mapsEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[320px] w-full border-0"
            />
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-2">
          {socials.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`NISB on ${label}`}
              className="flex h-11 w-11 items-center justify-center border border-[var(--line)] transition-colors hover:border-[var(--accent)]"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
          <a href={OFFICIAL_CONTACT.socials.discord} target="_blank" rel="noopener noreferrer" className="ml-2 min-h-11 border border-[var(--line)] px-4 py-3 text-sm">
            CommuNIEty Server ↗
          </a>
          <a href={OFFICIAL_CONTACT.socials.blog} target="_blank" rel="noopener noreferrer" className="min-h-11 border border-[var(--line)] px-4 py-3 text-sm">
            Blog ↗
          </a>
        </div>

        <div className="mt-16 grid gap-10 border-t border-[var(--line)] pt-10 md:grid-cols-12">
          <div className="md:col-span-3">
            <p className="mono-label">Explore</p>
            <div className="mt-4 flex flex-col gap-2 text-sm">
              <Link href="/directory">People</Link>
              <Link href="/societies">Societies</Link>
              <Link href="/milestones">Milestones</Link>
              <Link href="/about">About NISB</Link>
              <Link href="/about#collections">Publications</Link>
            </div>
          </div>
          <div className="md:col-span-3">
            <p className="mono-label">Societies</p>
            <div className="mt-4 flex flex-col gap-2 text-sm">
              <Link href="/societies/ieee-cs">CS</Link>
              <Link href="/societies/ieee-wie">WIE</Link>
              <Link href="/societies/ieee-cass">CASS</Link>
              <Link href="/societies/ieee-ras">RAS</Link>
              <Link href="/societies/ieee-grss">GRSS</Link>
              <Link href="/societies/ieee-ceda">CEDA</Link>
            </div>
          </div>
          <div className="md:col-span-3">
            <p className="mono-label">Links</p>
            <div className="mt-4 flex flex-col gap-2 text-sm">
              <a href="https://www.ieee.org" target="_blank" rel="noopener noreferrer">IEEE Global</a>
              <a href="https://ieeebangalore.org" target="_blank" rel="noopener noreferrer">Bangalore Section</a>
              <a href="https://www.nie.ac.in" target="_blank" rel="noopener noreferrer">The National Institute of Engineering</a>
            </div>
          </div>
          <div className="md:col-span-3 text-right">
            <p className="mono-label">STB64141 · Region 10</p>
          </div>
        </div>

        <div className="relative mt-14 overflow-hidden border-t border-[var(--line)] pt-5">
          <p className="select-none font-display text-[clamp(7rem,19vw,16rem)] leading-[.72] text-[var(--text)] opacity-[0.06]">NISB</p>
          <p className="mt-8 text-xs text-[var(--muted)]">© 2026 NIE IEEE Student Branch. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
