import { IconType } from "@react-icons/all-files";
import { NameIcon } from "@/shared/components/MyIcons/typeNameIcon";
import {
  FiLayers,
  FiActivity,
  FiGlobe,
  FiDatabase,
  FiSend,
  FiBarChart2,
  FiMail,
  FiLock,
  FiPlay,
} from "react-icons/fi";
import { GiAutoRepair } from "react-icons/gi";
export const iconComponents: Record<NameIcon, IconType> = {
  database: FiDatabase,
  activity: FiActivity,
  layers: FiLayers,
  globe: FiGlobe,
  send: FiSend,
  barChart: FiBarChart2,
  password: FiLock,
  email: FiMail,
  play: FiPlay,
  repair: GiAutoRepair,
};
