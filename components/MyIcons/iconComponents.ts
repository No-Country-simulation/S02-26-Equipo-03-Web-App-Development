import { IconType } from "@react-icons/all-files";
import { NameIcon } from "./typeNameIcon";
import { FiLayers, FiActivity, FiGlobe, FiDatabase, FiSend, FiBarChart2 } from "react-icons/fi";

export const iconComponents: Record<NameIcon, IconType> = {
  database: FiDatabase,
  activity: FiActivity,
  layers: FiLayers,
  globe: FiGlobe,
  send: FiSend,
  barChart: FiBarChart2,
};
