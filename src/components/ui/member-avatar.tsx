"use client";

import { useState } from "react";
import Image from "next/image";
import { Monogram } from "@/components/ui/monogram";

export interface MemberAvatarProps {
  name: string;
  photoUrl?: string | null;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const sizeConfig = {
  xs: { px: 28, class: "h-7 w-7", monogramSize: "sm" as const },
  sm: { px: 36, class: "h-9 w-9", monogramSize: "sm" as const },
  md: { px: 48, class: "h-12 w-12", monogramSize: "md" as const },
  lg: { px: 80, class: "h-20 w-20", monogramSize: "lg" as const },
};

/**
 * Institutional Member Avatar component.
 * Displays official member photograph with hairline border,
 * automatically falling back to the local offline asset mirror or archival Monogram.
 */
export function MemberAvatar({
  name,
  photoUrl,
  size = "md",
  className = "",
}: MemberAvatarProps) {
  const [useLocalFallback, setUseLocalFallback] = useState(false);
  const [error, setError] = useState(false);
  const cfg = sizeConfig[size] ?? sizeConfig.md;

  if (!photoUrl || error) {
    return (
      <Monogram
        name={name}
        size={cfg.monogramSize}
        className={`${cfg.class} shrink-0 ${className}`}
      />
    );
  }

  // Derive source url: if remote failed and it's a nisb.in asset, try local mirror
  let currentSrc = photoUrl;
  if (useLocalFallback) {
    currentSrc = photoUrl.replace(/^https?:\/\/(?:www\.)?nisb\.in\//, "/");
  }

  function handleImageError() {
    if (!useLocalFallback && photoUrl?.includes("nisb.in/assets/")) {
      setUseLocalFallback(true);
    } else {
      setError(true);
    }
  }

  return (
    <Image
      src={currentSrc}
      alt={name}
      width={cfg.px}
      height={cfg.px}
      className={`${cfg.class} rounded-sm object-cover border border-border shrink-0 ${className}`}
      unoptimized
      onError={handleImageError}
    />
  );
}
