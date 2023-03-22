// import { ReactComponent as CreditCard } from "./icons/CreditCard.svg";
import { ReactComponent as Home } from "./icons/Home.svg";
import { ReactComponent as LocationMarker } from "./icons/LocationMarker.svg";
import { ReactComponent as Menu } from "./icons/Menu.svg";
import { ReactComponent as Photograph } from "./icons/Photograph.svg";
import { ReactComponent as Truck } from "./icons/Truck.svg";
import { ReactComponent as Book } from "./icons/Book.svg";

const icons = {
  // CreditCard,
  Home,
  LocationMarker,
  Menu,
  Photograph,
  Truck,
  Book,
};

const sizes = {
  sm: "12px",
  md: "24px",
  lg: "32px",
  xl: "48px",
};

interface IconProps {
  type: keyof typeof icons;
  size?: keyof typeof sizes;
  onClick: () => void;
}

export default function Icon({ type, size = "md", onClick }: IconProps) {
  const SelectedIcon = icons[type];

  return (
    <SelectedIcon
      onClick={onClick}
      style={{ width: sizes[size], height: sizes[size] }}
    />
  );
}
