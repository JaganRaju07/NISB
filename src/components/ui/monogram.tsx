/**
 * Monogram block component.
 * Displays initials when a member has no photo.
 */

interface MonogramProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-20 w-20 text-xl",
} as const;

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function Monogram({ name, size = "md", className = "" }: MonogramProps) {
  const initials = getInitials(name);

  return (
    <div
      className={`monogram-block rounded-sm ${sizeClasses[size]} ${className}`}
      aria-label={`${name} initials`}
    >
      {initials}
    </div>
  );
}
