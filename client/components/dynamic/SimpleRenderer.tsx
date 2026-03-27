import { SafeHtml } from "@site/components/ui/SafeHtml";

interface SimpleContent {
  title?: string;
  body?: string;
}

interface Props {
  content: Record<string, unknown>;
}

export default function SimpleRenderer({ content: raw }: Props) {
  const content = raw as SimpleContent;

  return (
    <div className="bg-white py-[40px] md:py-[60px]">
      <div className="max-w-[2560px] mx-auto w-[95%] md:w-[90%] lg:w-[70%]">
        {content.title && (
          <h1 className="font-playfair text-[32px] md:text-[48px] leading-tight text-black pb-[20px] md:pb-[30px]">
            {content.title}
          </h1>
        )}
        {content.body && (
          <SafeHtml
            html={content.body}
            className="font-outfit text-[18px] leading-[28px] text-black prose prose-lg max-w-none"
          />
        )}
      </div>
    </div>
  );
}
