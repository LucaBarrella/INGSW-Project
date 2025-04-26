export interface Location {
  name: string;
  distance: number;
  image: string;
}

export interface CategoryItem {
  title: string;
  count: number;
}

export interface TabItem {
  icon: string;
  label: string;
  onPress: () => void;
}
