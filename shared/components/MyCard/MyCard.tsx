import { MyIcons } from "@/shared/components/MyIcons/MyIcons";
import { MyIconsProperties } from "@/shared/components/MyIcons/typeNameIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

interface MyCardProps {
  icon?: MyIconsProperties;
  title: string;
  description: string;
  className?: string;
}

export const MyCard = (props: MyCardProps) => {
  const { icon, title, description, className } = props;
  return (
    <Card className={className}>
      <CardHeader>
        {icon && <MyIcons name={icon.name} size={icon.size} className={icon.className} />}
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{description}</p>
      </CardContent>
    </Card>
  );
};
