// Renders a JSON-LD structured-data script. The data is app-controlled, and we
// escape "<" so any value containing "</script>" cannot break out of the element.
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
