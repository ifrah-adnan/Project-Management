import React from "react";
import * as LucideIcons from "lucide-react";
import { LucideProps } from "lucide-react";

type IconName = keyof typeof LucideIcons;

const IconComponent: React.FC<{ iconName: string }> = ({ iconName }) => {
  const Icon = LucideIcons[
    iconName as IconName
  ] as React.ComponentType<LucideProps>;
  return Icon ? <Icon size={20} /> : null;
};

export default IconComponent;
