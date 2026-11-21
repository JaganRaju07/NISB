import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Shield,
  MessageSquare,
} from "lucide-react";
import { OFFICIAL_CONTACT } from "@/lib/official-roster";

function InstagramIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function YoutubeIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

function GithubIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

interface FooterProps {
  className?: string;
}

export function Footer({ className = "" }: FooterProps) {
  return (
    <footer
      id="contact"
      className={`border-t border-slate-800 bg-slate-950 text-slate-300 ${className}`}
    >
      {/* Official NISB Contact Section */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8 lg:py-16">
        <div className="mb-10 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-sky-400 mb-1">
            NIE IEEE Student Branch
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
            Contact
          </h2>
          <div className="mx-auto mt-2 h-1 w-12 bg-sky-500 rounded-full" />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Official Campus Location Map */}
          <div className="lg:col-span-5 flex flex-col justify-between overflow-hidden rounded-lg border border-slate-800 bg-slate-900/60 p-2 shadow-inner">
            <div className="relative h-64 w-full overflow-hidden rounded">
              <iframe
                title="The National Institute of Engineering, Mysuru"
                src={OFFICIAL_CONTACT.mapsEmbed}
                className="h-full w-full border-0 grayscale hover:grayscale-0 transition-all duration-300"
                loading="lazy"
                aria-hidden="false"
              />
            </div>
            <div className="flex items-center gap-2 p-3 font-mono text-xs text-slate-400">
              <MapPin className="h-4 w-4 shrink-0 text-sky-400" />
              <span>The National Institute of Engineering, Mysuru - 570008</span>
            </div>
          </div>

          {/* Right Column: Official Contact Box */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-lg border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Institution Identity */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Image
                    src="/assets/images/Condensed---White-Circle.png"
                    alt="NISB"
                    width={28}
                    height={28}
                    className="h-7 w-7 object-contain"
                  />
                  <h3 className="font-semibold text-white text-base">
                    NIE IEEE Student Branch
                  </h3>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  The National Institute of Engineering
                  <br />
                  Manandavadi Road
                  <br />
                  Mysuru, Karnataka, India
                </p>
                <div className="pt-1 font-mono text-xs text-slate-400">
                  <span className="text-sky-400 font-semibold">IEEE Code:</span> STB64141
                  <br />
                  <span className="text-sky-400 font-semibold">Section:</span> Bangalore Section
                </div>
              </div>

              {/* Chairperson & Direct Contact */}
              <div className="space-y-3">
                <h3 className="font-semibold text-white text-base">
                  Branch Leadership
                </h3>
                <div className="space-y-1.5 text-sm">
                  <p className="font-medium text-slate-200">
                    {OFFICIAL_CONTACT.chairperson}
                  </p>
                  <p className="text-xs font-mono text-slate-400">Chairperson, NISB</p>
                  <div className="flex items-center gap-2 pt-1 text-slate-300">
                    <Phone className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                    <a
                      href={`tel:${OFFICIAL_CONTACT.phone.replace(/\s+/g, "")}`}
                      className="hover:text-white font-mono text-xs transition-colors"
                    >
                      {OFFICIAL_CONTACT.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Mail className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                    <a
                      href={`mailto:${OFFICIAL_CONTACT.email}`}
                      className="hover:text-white font-mono text-xs text-sky-400 transition-colors"
                    >
                      {OFFICIAL_CONTACT.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Official Social Channels */}
            <div className="mt-8 border-t border-slate-800 pt-6">
              <p className="font-mono text-xs uppercase tracking-wider text-slate-400 mb-3">
                Connect With NISB
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={OFFICIAL_CONTACT.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-800 bg-slate-950 text-slate-300 hover:border-pink-500 hover:text-pink-400 transition-all hover:-translate-y-0.5 shadow-sm"
                  aria-label="NISB on Instagram"
                >
                  <InstagramIcon className="h-5 w-5" />
                </a>
                <a
                  href={OFFICIAL_CONTACT.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-800 bg-slate-950 text-slate-300 hover:border-blue-500 hover:text-blue-400 transition-all hover:-translate-y-0.5 shadow-sm"
                  aria-label="NISB on LinkedIn"
                >
                  <LinkedinIcon className="h-5 w-5" />
                </a>
                <a
                  href={OFFICIAL_CONTACT.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-800 bg-slate-950 text-slate-300 hover:border-red-500 hover:text-red-400 transition-all hover:-translate-y-0.5 shadow-sm"
                  aria-label="NISB on YouTube"
                >
                  <YoutubeIcon className="h-5 w-5" />
                </a>
                <a
                  href={OFFICIAL_CONTACT.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-500 hover:text-white transition-all hover:-translate-y-0.5 shadow-sm"
                  aria-label="NISB on GitHub"
                >
                  <GithubIcon className="h-5 w-5" />
                </a>
                <a
                  href={OFFICIAL_CONTACT.socials.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-300 hover:border-indigo-500 hover:text-indigo-400 transition-all shadow-sm"
                  aria-label="CommuNIEty Discord Server"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>CommuNIEty Server</span>
                </a>
                <a
                  href={OFFICIAL_CONTACT.socials.blog}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-300 hover:border-sky-500 hover:text-sky-400 transition-all shadow-sm"
                  aria-label="NISB Technical Blog"
                >
                  <span>NISB Blog</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Institutional Affiliation & Fast Links */}
        <div className="mt-12 border-t border-slate-800/80 pt-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-4 font-mono text-xs">
            <div>
              <p className="font-semibold text-white uppercase tracking-wider mb-2">
                Digital Archive
              </p>
              <ul className="space-y-1.5 text-slate-400">
                <li>
                  <Link href="/directory" className="hover:text-white transition-colors">
                    Member Directory
                  </Link>
                </li>
                <li>
                  <Link href="/milestones" className="hover:text-white transition-colors">
                    Institutional Milestones
                  </Link>
                </li>
                <li>
                  <Link href="/societies" className="hover:text-white transition-colors">
                    Societies &amp; Chapters
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    Archival Mission
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-white uppercase tracking-wider mb-2">
                Technical Chapters
              </p>
              <ul className="space-y-1.5 text-slate-400">
                <li>
                  <Link href="/societies/ieee-cs" className="hover:text-white transition-colors">
                    Computer Society (CS)
                  </Link>
                </li>
                <li>
                  <Link href="/societies/ieee-wie" className="hover:text-white transition-colors">
                    Women in Engineering (WIE)
                  </Link>
                </li>
                <li>
                  <Link href="/societies/ieee-cass" className="hover:text-white transition-colors">
                    Circuits &amp; Systems (CASS)
                  </Link>
                </li>
                <li>
                  <Link href="/societies/ieee-ras" className="hover:text-white transition-colors">
                    Robotics &amp; Automation (RAS)
                  </Link>
                </li>
                <li>
                  <Link href="/societies/ieee-grss" className="hover:text-white transition-colors">
                    Geoscience &amp; Remote (GRSS)
                  </Link>
                </li>
                <li>
                  <Link href="/societies/ieee-ceda" className="hover:text-white transition-colors">
                    Design Automation (CEDA)
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-white uppercase tracking-wider mb-2">
                Institutional Nodes
              </p>
              <ul className="space-y-1.5 text-slate-400">
                <li>
                  <a
                    href="https://www.ieee.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white inline-flex items-center gap-1 transition-colors"
                  >
                    <span>IEEE Global</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://ieeebangalore.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white inline-flex items-center gap-1 transition-colors"
                  >
                    <span>IEEE Bangalore Section</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.nie.ac.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white inline-flex items-center gap-1 transition-colors"
                  >
                    <span>NIE Mysuru (Main)</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.nisb.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white inline-flex items-center gap-1 transition-colors"
                  >
                    <span>nisb.in Official Site</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-white uppercase tracking-wider mb-2">
                Governance &amp; Admin
              </p>
              <ul className="space-y-1.5 text-slate-400">
                <li>
                  <Link
                    href="/admin/login"
                    className="hover:text-amber-400 inline-flex items-center gap-1 transition-colors"
                  >
                    <Shield className="h-3 w-3 text-amber-400" />
                    <span>Admin</span>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/login" className="hover:text-slate-200 transition-colors">
                    Admin Authentication
                  </Link>
                </li>
                <li className="pt-2 text-slate-400">
                  Two-dimensional publication verification model enforced.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright & Provenance Notice */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-900 pt-6 sm:flex-row font-mono text-xs text-slate-400">
          <p>
            © 2026 NIE IEEE Student Branch (NISB) · STB64141. All rights reserved.
          </p>
          <p className="flex items-center gap-2 text-slate-400">
            <span>Data as published on</span>
            <a
              href="https://www.nisb.in/content.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:underline"
            >
              nisb.in
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
