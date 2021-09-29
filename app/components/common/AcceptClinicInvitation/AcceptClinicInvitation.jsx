import React, { useReducer } from 'react';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress'
import VisibilityOn from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Box from "@material-ui/core/Box";
import clsx from 'clsx';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup'
import PhoneInput from 'react-phone-input-2';
import { toast } from 'react-toastify';
import { useRouter } from "next/router";

import useIsMobileDevice from "../../../utils/useIsMobileDevice";
import { requestAcceptInvitation } from "../../../../middleware/api/users";
import LoadingButton from '../LoadingButton';
import { JwtRegex, PasswordRegex, Role } from '../../../utils/constants';
import uploadFileToAWS from '../../../../utils/uploadFileToAWS';
import { textForKey } from '../../../../utils/localization';
import isPhoneInputValid from "../../../utils/isPhoneInputValid";
import isPhoneNumberValid from "../../../utils/isPhoneNumberValid";
import UploadAvatar from "../UploadAvatar";
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

const AcceptInvitation = () => {
  const router = useRouter();
  const isMobileDevice = useIsMobileDevice();
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

  const handleAvatarChange = file => {
    if (file != null) {
      localDispatch(setAvatarFile(file));
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
      console.error(error);
      if (error.response != null) {
        const { data } = error.response;
        toast.error(data.message);
      } else {
        toast.error(error.message);
      }
    } finally {
      localDispatch(setIsLoading(false));
    }
  };

  return (
    <div
      className={clsx(
        styles.generalPage,
        { [styles.mobileDevice]: isMobileDevice }
      )}
    >
      {!isMobileDevice && (
        <div className={styles.logoContainer}>
          <img
            src='https://easyplan-pro-files.s3.eu-central-1.amazonaws.com/settings/easyplan-logo.svg'
            alt='EasyPlan'
          />
        </div>
      )}
      <div
        className={clsx(
          styles.formContainer,
          { [styles.mobileDevice]: isMobileDevice }
        )}
      >
        {isMobileDevice && (
          <img
            src='https://easyplan-pro-files.s3.eu-central-1.amazonaws.com/settings/easyplan-logo.svg'
            alt='EasyPlan'
          />
        )}
        <div
          className={clsx(
            styles.formRoot,
            styles.acceptInvitation,
            { [styles.mobileDevice]: isMobileDevice }
          )}
        >
          <Box display='flex' flexDirection='column' width='100%'>
            {!isNewUser && isLoading && (
              <div className='progress-bar-wrapper'>
                <CircularProgress className='circular-progress-bar'/>
              </div>
            )}
            {isNewUser ? (
              <div className={styles.formWrapper}>
              <span className={styles.formTitle}>
                {textForKey('Accept invitation')}
              </span>
                <span className={styles.welcomeText}>
                {textForKey('accept invitation message')}
              </span>
                <UploadAvatar
                  className={styles.uploadAvatar}
                  currentAvatar={avatarFile}
                  onChange={handleAvatarChange}
                />
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
          </Box>
          <div
            className={clsx(
              styles.footer,
              {
                [styles.isNew]: isNewUser,
                [styles.mobileDevice]: isMobileDevice,
              },
            )}
          >
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
