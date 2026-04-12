/** Avatar com foto (URL pública) ou iniciais — sem dados mock. */
export function StudentAvatar({
  name,
  avatarUrl,
  initials,
  sizeClass = 'w-12 h-12',
  textClass = 'text-sm',
}: {
  name: string;
  avatarUrl: string | null;
  initials: string;
  sizeClass?: string;
  textClass?: string;
}) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={`${sizeClass} rounded-full object-cover border-2 border-[rgba(232,39,26,0.2)] shrink-0`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full shrink-0 flex items-center justify-center border-2 border-[rgba(232,39,26,0.25)] bg-[#2a2a2a] text-[#f2f2f2] font-semibold ${textClass}`}
      aria-hidden
    >
      {initials.slice(0, 2)}
    </div>
  );
}
