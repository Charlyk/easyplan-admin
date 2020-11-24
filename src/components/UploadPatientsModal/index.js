import React, { useEffect, useState } from 'react';

import UploadIcon from '@material-ui/icons/CloudUpload';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';

import dataAPI from '../../utils/api/dataAPI';
import { textForKey } from '../../utils/localization';
import EasyPlanModal from '../EasyPlanModal/EasyPlanModal';
import './styles.scss';

const ImportDataModal = ({ title, open, onClose, onUpload }) => {
  const [file, setFile] = useState(null);
  const [providers, setProviders] = useState([]);
  const [provider, setProvider] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setFile(null);
      setIsLoading(false);
    }
  }, [open]);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    setIsLoading(true);
    const response = await dataAPI.fetchSupportedPatientsProviders();
    if (response.isError) {
      console.error(response.message);
    } else {
      const { data } = response;
      setProviders(data);
      if (data.length > 0) {
        setProvider(response.data[0]);
      }
    }
    setIsLoading(false);
  };

  const handleUpload = () => {
    onUpload({ file, provider });
    onClose();
  };

  const handleFileChange = event => {
    setFile(event.target.files[0]);
  };

  const handleProviderChange = event => {
    setProvider(event.target.value);
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
      isPositiveDisabled={file == null || provider == null}
      isPositiveLoading={isLoading}
    >
      <Form.Group>
        <Form.Label>{textForKey('Upload file')}</Form.Label>
        <input
          className='custom-file-input'
          type='file'
          name='patients-file'
          id='patients-file'
          accept='.xls,.xlsx'
          onChange={handleFileChange}
        />
        <label htmlFor='patients-file'>{file?.name}</label>
      </Form.Group>

      <Form.Group>
        <Form.Label>{textForKey('Select provider')}</Form.Label>
        <Form.Control
          onChange={handleProviderChange}
          as='select'
          className='mr-sm-2'
          id='inlineFormCustomSelect'
          value={provider}
          custom
        >
          {providers.map(provider => (
            <option key={provider} value={provider}>
              {provider}
            </option>
          ))}
        </Form.Control>
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
