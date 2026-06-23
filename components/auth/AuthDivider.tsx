/** "or continue with email" separator between OAuth and the email form. */
export function AuthDivider() {
  return (
    <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-ink-soft">
      <span className="h-px flex-1 bg-line" />
      or continue with email
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
