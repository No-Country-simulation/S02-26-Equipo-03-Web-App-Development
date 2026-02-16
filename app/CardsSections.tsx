import { MyCard } from "@/components/MyCard/MyCard";
import { MyIconsProperties } from "@/components/MyIcons/typeNameIcon";

interface CardsSectionsProps {
  title: string;
  subtitle?: string;
  cards: {
    title: string;
    icon: MyIconsProperties;
    description: string;
  }[];
}

export default function CardsSections(props: CardsSectionsProps) {
  const { title, subtitle, cards } = props;

  return (
    <div className="w-full flex-col items-center justify-center gap-4">
      <div className="p-10 text-center">
        <h2 className="mb-2 text-3xl font-bold text-black">{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="grid grid-cols-3 justify-items-center gap-5 p-6">
        {cards.map((card, index) => (
          <MyCard
            key={index}
            title={card.title}
            description={card.description}
            icon={{ name: card.icon.name, size: card.icon.size, className: card.icon?.className }}
            className="w-96"
          />
        ))}
      </div>
    </div>
  );
}
