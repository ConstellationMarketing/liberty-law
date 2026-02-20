interface SafeHtmlProps {
  html: string;
  className?: string;
  as?: "div" | "span" | "p";
}

export function SafeHtml({ html, className, as: Tag = "div" }: SafeHtmlProps) {
  // If value is plain text (no HTML tags), render as-is via dangerouslySetInnerHTML
  // which will display plain text correctly. Once TipTap saves HTML, it renders as HTML.
  return (
    <Tag
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
