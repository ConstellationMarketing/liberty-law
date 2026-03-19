import { SafeHtml } from "@site/components/ui/SafeHtml";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@site/components/ui/accordion";
import { triggerDniRefreshAfterReveal } from "@site/components/WcDniManager";
import type { PracticeFaq } from "@site/lib/cms/practicePageTypes";

interface Props {
  faq: PracticeFaq;
}

export default function FaqSection({ faq }: Props) {
  if (!faq.enabled || !faq.items || faq.items.length === 0) return null;

  return (
    <>
      <div className="bg-gray-50 py-[50px] md:py-[70px]">
        <div className="max-w-[2560px] mx-auto w-[95%] md:w-[85%] lg:w-[75%]">
          <h2 className="font-playfair text-[clamp(1.75rem,4vw,48px)] leading-tight text-law-dark text-center mb-[40px] md:mb-[56px]">
            {faq.heading}
          </h2>

          <Accordion
            type="single"
            collapsible
            className="space-y-3"
            onValueChange={(value) => {
              // When opening an accordion item, trigger DNI refresh
              // so phone numbers inside the answer get swapped
              if (value) {
                triggerDniRefreshAfterReveal();
              }
            }}
          >
            {faq.items.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white border border-gray-200 rounded px-6"
              >
                <AccordionTrigger className="font-outfit font-semibold text-[17px] text-law-dark text-left hover:no-underline py-5">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <SafeHtml
                    html={item.answer}
                    className="font-outfit text-[16px] leading-[26px] text-black/80 prose prose-p:mb-2 prose-ul:list-disc prose-ul:pl-5 max-w-none"
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </>
  );
}
