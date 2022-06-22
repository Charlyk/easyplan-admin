import React, { useContext, useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { useTranslate } from 'react-polyglot';
import { useDispatch, useSelector } from 'react-redux';
import EASSelect from 'app/components/common/EASSelect';
import EASModal from 'app/components/common/modals/EASModal';
import NotificationsContext from 'app/context/notificationsContext';
import { HeaderKeys } from 'app/utils/constants';
import useMappedValue from 'app/utils/hooks/useMappedValue';
import { addPatientXRayImage } from 'middleware/api/patients';
import {
  authTokenSelector,
  currentClinicSelector,
} from 'redux/selectors/appDataSelector';
import { updateXRay } from 'redux/slices/mainReduxSlice';
import styles from './AddXRay.module.scss';

const rawPhases = [
  {
    id: 'Initial',
    name: 'initial phase',
  },
  {
    id: 'Middle',
    name: 'middle phase',
  },
  {
    id: 'Final',
    name: 'final phase',
  },
];

const AddXRay = ({ open, patientId, onClose }) => {
  const textForKey = useTranslate(rawPhases);
  const phases = useMappedValue();
  const dispatch = useDispatch();
  const toast = useContext(NotificationsContext);
  const authToken = useSelector(authTokenSelector);
  const clinic = useSelector(currentClinicSelector);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [phase, setPhase] = useState('Initial');

  useEffect(() => {
    if (!open) setImageFile(null);
  }, [open]);

  const handleFileChange = (event) => {
    const allowedExtensionsRegex = /\.(jpe?g|png)$/i;
    if (!event.target.files[0]?.name.match(allowedExtensionsRegex)) {
      toast.error(textForKey('selected_file_is_not_an_image'));
      return;
    }
    const file = event.target.files[0];
    setImageFile(file);
  };

  const handleSaveImage = async () => {
    setIsLoading(true);
    try {
      const headers = {
        [HeaderKeys.authorization]: authToken,
        [HeaderKeys.clinicId]: clinic.id,
        [HeaderKeys.subdomain]: clinic.domainName,
      };
      await addPatientXRayImage(patientId, phase, imageFile, headers);
      dispatch(updateXRay());
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhaseChange = (event) => {
    setPhase(event.target.value);
  };

  return (
    <EASModal
      onClose={onClose}
      open={open}
      className={styles.addXRayRoot}
      title={textForKey('add_xray_image')}
      isPositiveLoading={isLoading}
      isPositiveDisabled={imageFile == null || phase == null}
      onPrimaryClick={handleSaveImage}
    >
      <form className={styles.formRoot}>
        <div className={styles.fileInput}>
          <Typography className={styles.formLabel}>
            {textForKey('upload image')}
          </Typography>
          <input
            className='custom-file-input'
            type='file'
            name='x-ray-file'
            id='x-ray-file'
            accept='.jpg,.jpeg,.png'
            onChange={handleFileChange}
          />
          <label htmlFor='x-ray-file'>{imageFile?.name}</label>
        </div>
      </form>
    </EASModal>
  );
};

export default AddXRay;

AddXRay.propTypes = {
  open: PropTypes.bool.isRequired,
  patientId: PropTypes.number,
  onClose: PropTypes.func,
};

AddXRay.defaultProps = {
  onClose: () => null,
};
