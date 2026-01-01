import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "How long does delivery take?",
      answer: "We deliver within 24-48 hours in major cities. Your cotton candy is freshly spun and delivered quickly to maintain its quality."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept cash on delivery, bank transfers, and all major credit/debit cards for your convenience."
    },
    {
      question: "How fresh is the cotton candy?",
      answer: "All our cotton candy is freshly spun just before delivery. We ensure maximum freshness and quality with every order."
    },
    {
      question: "Are there any preservatives in the cotton candy?",
      answer: "No! We are proud to offer 100% organic cotton candy with absolutely no preservatives. Just pure, delicious sweetness."
    },
    {
      question: "Can I customize the bundle sizes?",
      answer: "Currently, we offer pre-made bundles of 3, 5, and 7 cups in both Medium and Large sizes. Contact us for special bulk orders!"
    },
    {
      question: "What flavors do you offer?",
      answer: "We offer a variety of delicious flavors including classic, strawberry, blueberry, and many more. Each bundle can include a mix of flavors."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-foreground">
          Frequently Asked Questions
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          Got questions? We've got answers!
        </p>
        
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left hover:text-primary transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
