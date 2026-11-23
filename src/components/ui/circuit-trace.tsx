export function CircuitTrace() {
  return (
    <svg
      className="circuit-motif h-[360px] w-full"
      viewBox="0 0 520 360"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="#00629B" strokeWidth="1">
        <path className="trace-path" d="M20 300H140V240H230V178H348V104H500" />
        <path className="trace-path" d="M80 300V270H170V210H276V150H420V62H500" style={{ animationDelay: "120ms" }} />
        <path className="trace-path" d="M140 240H194V300H306V238H398V178H500" style={{ animationDelay: "240ms" }} />
      </g>
      <g fill="#F8F8F5" stroke="#00629B" strokeWidth="1">
        <circle cx="140" cy="240" r="4" /><circle cx="230" cy="178" r="4" />
        <circle cx="348" cy="104" r="4" /><circle cx="276" cy="150" r="4" />
        <circle cx="398" cy="178" r="4" /><circle cx="306" cy="238" r="4" />
      </g>
    </svg>
  );
}
