import React, { KeyboardEvent, useState } from 'react';
import EASTextField from 'app/components/common/EASTextField';
import { textForKey } from 'app/utils/localization';

interface Props {
  id: number;
}

const ClinicCabinets: React.FC<Props> = () => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (evt: KeyboardEvent): void => {
    if (evt.key === 'Enter') {
      console.log(inputValue);
    }
  };

  return (
    <div>
      <EASTextField
        fieldLabel={textForKey('clinic_cabinets_tag_field')}
        helperText={textForKey('clinic_cabinets_tag_helper')}
        onKeyDown={handleKeyDown}
        value={inputValue}
        onChange={(data: string) => setInputValue(data)}
      />
    </div>
  );
};

export default ClinicCabinets;
