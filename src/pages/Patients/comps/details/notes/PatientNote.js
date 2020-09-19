import React from 'react';

import PropTypes from 'prop-types';

const PatientNote = ({ note }) => {
  return (
    <div className='patients-root__notes__item'>
      <div className='patients-root__notes__item__note-date'>
        20 Jan 2020 12:33
      </div>
      <div className='patients-root__notes__item__note-text'>
        Some long text will go here so I need to fill this with a random text
        just for test purpose. Some long text will go here so I need to fill
        this with a random text just for test purpose. Some long text will go
        here so I need to fill this with a random text just for test purpose.
        Some long text will go here so I need to fill this with a random text
        just for test purpose. Some long text will go here so I need to fill
        this with a random text just for test purpose. Some long text will go
        here so I need to fill this with a random text just for test purpose.
        Some long text will go here so I need to fill this with a random text
        just for test purpose.
      </div>
    </div>
  );
};

export default PatientNote;

PatientNote.propTypes = {
  note: PropTypes.object,
};
