export type PatientsAutocompleteProps = {
  onSelect: (id: string | number) => void;
  className?: string;
  value: string | number;
};

export type OptionType = {
  label: string;
  id: string | number;
};
