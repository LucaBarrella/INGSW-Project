export interface RoleCardProps {
  title: string;
  description: string;
  iconUrl: string;
  onSelect: () => void;
  accessibilityLabel: string;
}

export interface RoleData {
  id: string;
  title: string;
  description: string;
  iconUrl: string;
  route: string;
  accessibilityLabel: string;
}