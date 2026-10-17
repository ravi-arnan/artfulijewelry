/** Keyboard a11y: lets users jump past the header straight to main content. */
export function SkipLink() {
  return (
    <a
      href="#content"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-espresso focus:px-5 focus:py-2 focus:text-sm focus:text-paper"
    >
      Skip to content
    </a>
  );
}
