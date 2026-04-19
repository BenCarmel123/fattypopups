import CreatableSelect from 'react-select/creatable';
import * as Config from 'config/index.jsx';

export default function TypeaheadInput({
  options = [],
  value,
  onChange,
  placeholder = "",
  label,
  name
}) {
  const selectOptions = options.map(option => ({
    value: option,
    label: option
  }));

  const selectedOption = value ? { value, label: value } : null;

  const handleChange = (selectedOption) => {
    onChange(selectedOption?.value || '');
  };

  return (
    <div style={{ marginBottom: '1rem', width: Config.MAX }}>
      {label && <label style={{ display: 'block', marginBottom: '0.5rem', color: Config.FORM_INPUT_COLOR }}>{label}</label>}
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
