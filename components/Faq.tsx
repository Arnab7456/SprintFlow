import { faqs } from "@/lib/constants/faq.constants";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export default function FAQPage() {
  return (
    <div className="text-center  dark:bg-black/[0.96] mt-1 p-12 md:p-4">
      <h1 className="text-2xl md:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">Frequently Asked Questions</h1>
      <p className="pb-4 pt-2 text-sm dark:text-white">Quick answers to any questions you may have.</p>

      <div className="w-full h-fit py-0 flex justify-center items-center">
        <div className="md:w-3/6 w-full flex flex-col items-center rounded-lg">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border rounded-xl overflow-hidden"
              >
                <AccordionTrigger className="flex w-full justify-between items-center cursor-pointer focus:outline-none p-4 text-left font-medium text-gray-900 dark:text-white hover:bg-blue-100 dark:hover:bg-gray-700/50 transition-colors duration-200">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="flex w-full justify-start items-start cursor-pointer focus:outline-none p-4 text-left">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}