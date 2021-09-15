import React, { useReducer } from 'react';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress'
import VisibilityOn from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import clsx from 'clsx';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import InputGroup from 'react-bootstrap/InputGroup'
import PhoneInput from 'react-phone-input-2';
import { toast } from 'react-toastify';
import { useRouter } from "next/router";

import IconAvatar from '../../../components/icons/iconAvatar';
import LoadingButton from '../../../../components/common/LoadingButton';
import { JwtRegex, PasswordRegex, Role } from '../../../utils/constants';
import uploadFileToAWS from '../../../../utils/uploadFileToAWS';
import { textForKey } from '../../../../utils/localization';
import isPhoneInputValid from "../../../utils/isPhoneInputValid";
import isPhoneNumberValid from "../../../utils/isPhoneNumberValid";
import reducer, {
  initialState,
  setFirstName,
  setIsPasswordVisible,
  setPassword,
  setLastName,
  setPhoneNumber,
  setAvatarFile,
  setIsLoading,
} from './AcceptClinicInvitation.reducer';
import styles from './AcceptInvitation.module.scss';
import { requestAcceptInvitation } from "../../../../middleware/api/users";

const AcceptInvitation = () => {
  const router = useRouter();
  const { isNew, token } = router.query;
  const isNewUser = isNew === '1';
  const [
    {
      isLoading,
      firstName,
      lastName,
      phoneNumber,
      isPhoneValid,
      password,
      avatarFile,
      isPasswordVisible,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);

  if (!token.match(JwtRegex)) {
    router.replace('/login');
    return null;
  }

  const handleFirstNameChange = event => {
    localDispatch(setFirstName(event.target.value));
  };

  const handleLastNameChange = event => {
    localDispatch(setLastName(event.target.value));
  };

  const handleAvatarChange = event => {
    const files = event.target.files;
    if (files != null) {
      localDispatch(setAvatarFile(files[0]));
    }
  };

  const handlePhoneNumberChange = (value, country, event) => {
    localDispatch(
      setPhoneNumber({
        number: `+${value}`,
        isValid: isPhoneNumberValid(value, country) && !event.target?.classList.value.includes('invalid-number'),
        country,
      }),
    );
  };

  const handlePasswordChange = event => {
    localDispatch(setPassword(event.target.value));
  };

  const togglePasswordVisibility = () => {
    localDispatch(setIsPasswordVisible(!isPasswordVisible));
  };

  const isFormValid = () => {
    return (
      password.match(PasswordRegex) &&
      firstName.length > 2 &&
      lastName.length > 2 &&
      isPhoneValid
    );
  };

  const handleSuccessResponse = async (user) => {
    const selectedClinic = user.clinics.find((clinic) => clinic.isSelected) || user.clinics[0];
    if (selectedClinic != null) {
      switch (selectedClinic.roleInClinic) {
        case Role.reception:
          await router.replace('/calendar/day');
          break;
        case Role.admin:
        case Role.manager:
          await router.replace('/analytics/general');
          break;
        default:
          await router.replace('/login');
          break;
      }
    } else {
      await router.replace('/login');
    }
  }

  const handleAcceptInvitation = async () => {
    if (isNewUser && !isFormValid()) {
      return;
    }
    localDispatch(setIsLoading(true));
    try {
      const requestBody = {
        firstName,
        lastName,
        password,
        phoneNumber,
        invitationToken: token,
      };
      if (avatarFile != null) {
        const uploadResult = await uploadFileToAWS('avatars', avatarFile);
        if (uploadResult?.location != null) {
          requestBody.avatar = uploadResult.location;
        }
      }
      const { data: user } = await requestAcceptInvitation(requestBody);
      toast.success(textForKey('invitation_accepted_success'));
      await handleSuccessResponse(user)
    } catch (error) {
      toast.error(error.message);
    } finally {
      localDispatch(setIsLoading(false));
    }
  };

  return (
    <div className={styles['general-page']}>
      <div className={styles['logo-container']}>
        <img
          src='https://easyplan-pro-files.s3.eu-central-1.amazonaws.com/settings/easyplan-logo.svg'
          alt='EasyPlan'
        />
      </div>
      <div className={styles['form-container']}>
        <div className={clsx(styles['form-root'], styles['accept-invitation'])}>
          {!isNewUser && isLoading && (
            <div className='progress-bar-wrapper'>
              <CircularProgress className='circular-progress-bar'/>
            </div>
          )}
          {isNewUser ? (
            <div className={styles['form-wrapper']}>
              <span className={styles['form-title']}>
                {textForKey('Accept invitation')}
              </span>
              <span className={styles['welcome-text']}>
                {textForKey('accept invitation message')}
              </span>
              <div className='upload-avatar-container'>
                {avatarFile ? (
                  <Image roundedCircle src={avatarFile}/>
                ) : (
                  <IconAvatar/>
                )}
                <span style={{ margin: '1rem' }}>
                  {textForKey('JPG or PNG, Max size of 800kb')}
                </span>
                <Form.Group>
                  <input
                    className='custom-file-button'
                    type='file'
                    name='avatar-file'
                    id='avatar-file'
                    accept='.jpg,.jpeg,.png'
                    onChange={handleAvatarChange}
                  />
                  <label htmlFor='avatar-file'>
                    {textForKey('Upload image')}
                  </label>
                </Form.Group>
              </div>
              <Form.Group controlId='lastName'>
                <Form.Label>{textForKey('Last name')}</Form.Label>
                <InputGroup>
                  <Form.Control
                    value={lastName}
                    type='text'
                    onChange={handleLastNameChange}
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group controlId='firstName'>
                <Form.Label>{textForKey('First name')}</Form.Label>
                <InputGroup>
                  <Form.Control
                    value={firstName}
                    type='text'
                    onChange={handleFirstNameChange}
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group controlId='phoneNumber'>
                <Form.Label>{textForKey('Phone number')}</Form.Label>
                <InputGroup>
                  <PhoneInput
                    onChange={handlePhoneNumberChange}
                    value={phoneNumber}
                    alwaysDefaultMask
                    countryCodeEditable={false}
                    country='md'
                    placeholder='079123456'
                    isValid={isPhoneInputValid}
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group controlId='newPassword'>
                <Form.Label>{textForKey('Enter a new password')}</Form.Label>
                <InputGroup>
                  <Form.Control
                    autoComplete='new-password'
                    value={password}
                    onChange={handlePasswordChange}
                    type={isPasswordVisible ? 'text' : 'password'}
                  />
                  <InputGroup.Append className={styles['password-visibility-append']}>
                    <Button
                      onClick={togglePasswordVisibility}
                      variant='outline-primary'
                      className={styles['visibility-toggle-btn']}
                    >
                      {isPasswordVisible ? <VisibilityOff/> : <VisibilityOn/>}
                    </Button>
                  </InputGroup.Append>
                </InputGroup>
                <Form.Text className='text-muted'>
                  {textForKey('passwordValidationMessage')}
                </Form.Text>
              </Form.Group>
            </div>
          ) : (
            <div>
              <Typography className={styles['form-title']}>{textForKey('Accept invitation')}</Typography>
              <span className={styles['welcome-text']}>
                {textForKey('Click on button below to accept the invitation')}
              </span>
            </div>
          )}
          <div className={clsx(styles['footer'], !isNewUser && styles['is-new'])}>
            <LoadingButton
              isLoading={isLoading}
              disabled={isLoading}
              className='positive-button'
              onClick={handleAcceptInvitation}
            >
              {textForKey('Accept invitation')}
            </LoadingButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcceptInvitation;
