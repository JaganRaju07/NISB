import Link from "next/link";
import Image from "next/image";
import {
  ExternalLink,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
} from "lucide-react";
import {
  FaGithub as Github,
  FaInstagram as Instagram,
  FaLinkedin as Linkedin,
  FaYoutube as Youtube,
} from "react-icons/fa6";
import { OFFICIAL_CONTACT } from "@/lib/official-roster";

interface FooterProps {
  className?: string;
}

export function Footer({ className = "" }: FooterProps) {
  return (
    <footer id="contact" className={`border-t border-border bg-slate-950 ${className}`}>
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <p className="section-eyebrow">Contact</p>
            <h2 className="mt-3 font-display text-4xl font-semibold text-white">Let&apos;s build together.</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
              Reach NISB for branch activities, technical events, partnerships and student opportunities.
            </p>

            <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card">
              <iframe
                title="The National Institute of Engineering, Mysuru"
                src={OFFICIAL_CONTACT.mapsEmbed}
                className="h-64 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="flex items-center gap-2 border-t border-border px-4 py-3 text-xs text-slate-400">
                <MapPin className="h-4 w-4 text-sky-400" />
                The National Institute of Engineering, Mysuru - 570008
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
            <div className="flex items-center gap-3 border-b border-border pb-6">
              <Image
                src="/assets/images/Condensed---White-Circle.png"
                alt="NISB emblem"
                width={44}
                height={44}
                className="h-11 w-11 object-contain"
              />
              <div>
                <h3 className="font-semibold text-white">NIE IEEE Student Branch</h3>
                <p className="mt-1 text-xs text-slate-400">The National Institute of Engineering</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Branch chairperson</p>
                <p className="mt-1 text-sm font-semibold text-white">{OFFICIAL_CONTACT.chairperson}</p>
              </div>
              <a href={`tel:${OFFICIAL_CONTACT.phone.replace(/\s+/g, "")}`} className="flex items-center gap-3 text-sm text-slate-300 hover:text-white">
                <Phone className="h-4 w-4 text-sky-400" />
                {OFFICIAL_CONTACT.phone}
              </a>
              <a href={`mailto:${OFFICIAL_CONTACT.email}`} className="flex items-center gap-3 text-sm text-sky-300 hover:text-sky-200">
                <Mail className="h-4 w-4" />
                {OFFICIAL_CONTACT.email}
              </a>
              <p className="flex items-start gap-3 text-sm leading-6 text-slate-300">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-sky-400" />
                {OFFICIAL_CONTACT.address}
              </p>
            </div>

            <div className="mt-8 border-t border-border pt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Connect with NISB</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  [OFFICIAL_CONTACT.socials.instagram, "Instagram", Instagram],
                  [OFFICIAL_CONTACT.socials.linkedin, "LinkedIn", Linkedin],
                  [OFFICIAL_CONTACT.socials.youtube, "YouTube", Youtube],
                  [OFFICIAL_CONTACT.socials.github, "GitHub", Github],
                ].map(([href, label, Icon]) => {
                  const SocialIcon = Icon as typeof Instagram;
                  return (
                    <a
                      key={String(label)}
                      href={String(href)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`NISB on ${String(label)}`}
                      className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-slate-400 transition hover:border-sky-400 hover:text-white"
                    >
                      <SocialIcon className="h-4 w-4" />
                    </a>
                  );
                })}
                <a href={OFFICIAL_CONTACT.socials.discord} target="_blank" rel="noopener noreferrer" className="social-link">
                  <MessageSquare className="h-4 w-4" /> CommuNIEty Server
                </a>
                <a href={OFFICIAL_CONTACT.socials.blog} target="_blank" rel="noopener noreferrer" className="social-link">
                  Blog <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-8 border-t border-border pt-8 text-sm sm:grid-cols-3">
          <div>
            <p className="font-semibold text-white">Explore</p>
            <div className="mt-3 flex flex-col gap-2 text-slate-400">
              <Link href="/directory">Leadership directory</Link>
              <Link href="/societies">Societies & chapters</Link>
              <Link href="/milestones">Milestones</Link>
              <Link href="/about">About NISB</Link>
            </div>
          </div>
          <div>
            <p className="font-semibold text-white">IEEE</p>
            <div className="mt-3 flex flex-col gap-2 text-slate-400">
              <a href="https://www.ieee.org" target="_blank" rel="noopener noreferrer">IEEE Global</a>
              <a href="https://ieeebangalore.org" target="_blank" rel="noopener noreferrer">IEEE Bangalore Section</a>
              <a href="https://www.nie.ac.in" target="_blank" rel="noopener noreferrer">The National Institute of Engineering</a>
            </div>
          </div>
          <div>
            <p className="font-semibold text-white">Branch</p>
            <p className="mt-3 text-slate-400">STB64141 · IEEE Region 10</p>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-xs text-slate-500">
          © 2026 NIE IEEE Student Branch (NISB). All rights reserved.
        </div>
      </div>
    </footer>
  );
}
