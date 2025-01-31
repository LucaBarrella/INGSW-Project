export interface InputFieldProps {
  label: string;
  id: string;
  type: string;
  value: string | null;
  onChange: (value: string) => void;
  placeholder: string;
}

export interface ActionButtonProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

export interface FormProps {
  title: string;
  onSubmit: () => void;
  children: React.ReactNode;
}
