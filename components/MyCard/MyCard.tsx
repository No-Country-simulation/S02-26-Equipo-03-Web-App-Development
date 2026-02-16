import { MyIcons } from "../MyIcons/MyIcons";
import { MyIconsProperties } from "../MyIcons/typeNameIcon";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

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
