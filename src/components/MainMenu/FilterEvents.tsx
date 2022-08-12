import { OptionBase, Select } from 'chakra-react-select';
import { useMemo } from 'react';

import { FormControl, Text } from '@chakra-ui/react';

import { useEvents } from '../../contexts';

interface Option extends OptionBase {
  label: React.ReactNode;
  value: string;
}

function getOption(name: string): Option {
  return {
    label: <Text fontFamily="monospace">{name}</Text>,
    value: name,
  };
}

export function FilterEvents() {
  const { filters, setEventFilters, methods } = useEvents();

  const options = useMemo(
    (): Option[] => methods.sort().map(getOption),
    [methods]
  );

  return (
    <FormControl data-cy="filter-menu">
      <Select<Option, true>
        chakraStyles={{
          placeholder: (props) => ({
            ...props,
            textColor: 'gray.500',
          }),
          menu: (props) => ({
            ...props,
            zIndex: 300,
          }),
        }}
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        isMulti
        options={options}
        placeholder="Filter by event type"
        selectedOptionStyle="check"
        value={filters.map(getOption)}
        onChange={(newValue) => {
          setEventFilters(newValue.map(({ value }) => value));
        }}
      />
    </FormControl>
  );
}
