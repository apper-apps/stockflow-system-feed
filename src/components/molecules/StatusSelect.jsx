import React from 'react';
import Select from '@/components/atoms/Select';

const StatusSelect = ({ value, onChange, options, ...props }) => {
  return (
    <Select
      value={value}
      onChange={onChange}
      options={options}
      className="w-auto min-w-[120px]"
      {...props}
    />
  );
};

export default StatusSelect;