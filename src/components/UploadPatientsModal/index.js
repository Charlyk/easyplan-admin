import React, { useEffect, useState } from 'react';

import UploadIcon from '@material-ui/icons/CloudUpload';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';

import { textForKey } from '../../../utils/localization';
import EasyPlanModal from '../../../components/common/EasyPlanModal';
import './UploadPatientsModal.module.scss';

const ImportDataModal = ({ title, open, onClose, onUpload }) => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setFile(null);
      setIsLoading(false);
    }
  }, [open]);

  const handleUpload = () => {
    onUpload({ file });
    onClose();
  };

  const handleFileChange = event => {
    setFile(event.target.files[0]);
  };

  return (
    <EasyPlanModal
      className='upload-patients-modal'
      open={open}
      onClose={onClose}
      title={title}
      onPositiveClick={handleUpload}
      positiveBtnText={textForKey('Upload')}
      positiveBtnIcon={<UploadIcon />}
      isPositiveDisabled={file == null}
      isPositiveLoading={isLoading}
    >
      <Form.Group>
        <Form.Label>{textForKey('Upload file')}</Form.Label>
        <input
          className='custom-file-input'
          type='file'
          name='patients-file'
          id='data-file'
          accept='.xls,.xlsx'
          onChange={handleFileChange}
        />
        <label htmlFor='data-file'>{file?.name}</label>
      </Form.Group>
    </EasyPlanModal>
  );
};

export default ImportDataModal;

ImportDataModal.propTypes = {
  title: PropTypes.string,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onUpload: PropTypes.func,
};

ImportDataModal.defaultProps = {
  title: textForKey('Upload patients'),
};
