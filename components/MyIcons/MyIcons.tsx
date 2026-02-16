import { iconComponents } from "./iconComponents";
import { MyIconsProperties } from "./typeNameIcon";

export const MyIcons = (properties: MyIconsProperties) => {
  const { name, size, className } = properties;
  const IconComponent = iconComponents[name];

  if (!IconComponent) {
    return false;
  }

  return <IconComponent size={size} className={className} />;
};
