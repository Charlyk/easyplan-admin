import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { toast } from "react-toastify";
import Typography from "@material-ui/core/Typography";
import { triggerUpdateXRay } from '../../../../../redux/actions/actions';
import { addPatientXRayImage } from "../../../../../middleware/api/patients";
import { textForKey } from '../../../../utils/localization';
import { HeaderKeys } from "../../../../utils/constants";
import EASModal from "../../../common/modals/EASModal";
import EASSelect from "../../../common/EASSelect";
import styles from './AddXRay.module.scss';

const phases = [
  {
    id: 'Initial',
    name: textForKey('Initial phase'),
  },
  {
    id: 'Middle',
    name: textForKey('Middle phase'),
  },
  {
    id: 'Final',
    name: textForKey('Final phase'),
  },
];

const AddXRay = ({ open, currentClinic, authToken, patientId, onClose }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [phase, setPhase] = useState('Initial');

  useEffect(() => {
    if (!open) setImageFile(null);
  }, [open]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
  };

  const handleSaveImage = async () => {
    setIsLoading(true);
    try {
      await addPatientXRayImage(patientId, phase, imageFile);
      dispatch(triggerUpdateXRay());
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
      title={textForKey('Add X-Ray image')}
      isPositiveLoading={isLoading}
      isPositiveDisabled={imageFile == null || phase == null}
      onPrimaryClick={handleSaveImage}
    >
      <form className={styles.formRoot}>
        <div className={styles.fileInput}>
          <Typography className={styles.formLabel}>
            {textForKey('Upload image')}
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

        <EASSelect
          rootClass={styles.simpleField}
          label={textForKey('Select phase')}
          value={phase}
          options={phases}
          onChange={handlePhaseChange}
        />
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
