import CreatableSelect from 'react-select/creatable';
import { FORM_FIELD_COLOR, MAX } from 'config/index.jsx';

// Generic typeahead input component
export default function TypeaheadInput({
  options = [],
  value,
  onChange,
  placeholder = "",
  label,
  name
}) {
  // Transform options array to react-select format
  const selectOptions = options.map(option => ({
    value: option,
    label: option
  }));

  // Find the selected option object
  const selectedOption = value ? { value, label: value } : null;

  // Handle selection change
  const handleChange = (selectedOption) => {
    onChange(selectedOption?.value || '');
  };

  return (
    <div style={{ marginBottom: '1rem', width: MAX }}>
      {label && <label style={{ display: 'block', marginBottom: '0.5rem', color: FORM_FIELD_COLOR }}>{label}</label>}
      <CreatableSelect
        options={selectOptions}
        value={selectedOption}
        onChange={handleChange}
        isClearable
        placeholder={placeholder}
        name={name}
        styles={{
          control: (base) => ({ ...base, minHeight: '40px', height: '40px' }),
          valueContainer: (base) => ({ ...base, height: '36px' }),
          indicatorsContainer: (base) => ({ ...base, height: '36px' })
        }}
      />
    </div>
  );
}
