import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";

const faqItems = [
  {
    question: "¿Por qué Meta no coincide con Stripe?",
    answer:
      "Meta atribuye conversiones con su propia ventana y modelo de atribución, mientras que Stripe reporta pagos confirmados. Es normal ver diferencias entre ambas plataformas.",
  },
  {
    question: "¿Necesito instalar código?",
    answer:
      "No necesariamente. Puedes conectar tus herramientas y empezar sin implementar código adicional en la mayoría de casos.",
  },
  {
    question: "¿Funciona con Webflow o Shopify?",
    answer:
      "Sí. Puedes usarlo con Webflow, Shopify y otras plataformas populares mediante integraciones o configuración básica.",
  },
  {
    question: "¿Qué eventos trackean?",
    answer:
      "Se suelen trackear eventos clave como visitas, inicios de checkout, compras y conversiones personalizadas según tu embudo.",
  },
  {
    question: "¿Es seguro conectar Stripe?",
    answer:
      "Sí. La conexión utiliza canales seguros y permisos acotados para acceder únicamente a la información necesaria.",
  },
];

export default function Faqs() {
  return (
    <section className="bg-[#F7F9FA] px-6 py-24 md:px-10">
      <div className="mx-auto w-full max-w-4xl">
        <h2 className="mb-14 text-center text-4xl font-semibold tracking-tight text-black">
          Preguntas Frecuentes
        </h2>

        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={`faq-${index}`} value={`faq-${index}`}>
              <AccordionTrigger className="py-6 text-base font-semibold text-black hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="pb-6 pr-8 text-sm leading-7 text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
