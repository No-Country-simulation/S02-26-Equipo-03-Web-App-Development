import { iconComponents } from "@/shared/components/MyIcons/iconComponents";
import { MyIconsProperties } from "@/shared/components/MyIcons/typeNameIcon";

export const MyIcons = (properties: MyIconsProperties) => {
  const { name, size, className } = properties;
  const IconComponent = iconComponents[name];

  if (!IconComponent) {
    return false;
  }

  return <IconComponent size={size} className={className} />;
};
