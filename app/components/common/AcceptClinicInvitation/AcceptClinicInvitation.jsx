import React, { useReducer } from 'react';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress'
import VisibilityOn from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from "@material-ui/core/IconButton";
import clsx from 'clsx';
import { toast } from 'react-toastify';
import { useRouter } from "next/router";

import { requestAcceptInvitation } from "../../../../middleware/api/users";
import uploadFileToAWS from '../../../utils/uploadFileToAWS';
import { textForKey } from '../../../utils/localization';
import { PasswordRegex, Role } from '../../../utils/constants';
import isPhoneNumberValid from "../../../utils/isPhoneNumberValid";
import useIsMobileDevice from "../../../utils/hooks/useIsMobileDevice";
import LoadingButton from '../LoadingButton';
import UploadAvatar from "../UploadAvatar";
import EASTextField from "../EASTextField";
import EASPhoneInput from "../EASPhoneInput";
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

const AcceptInvitation = ({ token, isNew }) => {
  const router = useRouter();
  const isMobileDevice = useIsMobileDevice();
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

  const handleFirstNameChange = (newValue) => {
    localDispatch(setFirstName(newValue));
  };

  const handleLastNameChange = (newValue) => {
    localDispatch(setLastName(newValue));
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

  const handlePasswordChange = (newValue) => {
    localDispatch(setPassword(newValue));
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

  const handleAcceptInvitation = async (event) => {
    event?.preventDefault();
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
        <form
          onSubmit={handleAcceptInvitation}
          className={clsx(
            styles.formRoot,
            styles.acceptInvitation,
            { [styles.mobileDevice]: isMobileDevice }
          )}
        >
          <div className={styles.fieldsWrapper}>
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

                <EASTextField
                  type="text"
                  containerClass={styles.textField}
                  fieldLabel={textForKey('Last name')}
                  value={lastName}
                  onChange={handleLastNameChange}
                />

                <EASTextField
                  type="text"
                  containerClass={styles.textField}
                  fieldLabel={textForKey('First name')}
                  value={firstName}
                  onChange={handleFirstNameChange}
                />

                <EASPhoneInput
                  fieldLabel={textForKey('Phone number')}
                  rootClass={styles.textField}
                  value={phoneNumber}
                  country='md'
                  onChange={handlePhoneNumberChange}
                />

                <EASTextField
                  containerClass={styles.textField}
                  fieldLabel={textForKey('Enter a new password')}
                  type={isPasswordVisible ? 'text' : 'password'}
                  autoComplete='new-password'
                  onChange={handlePasswordChange}
                  helperText={textForKey('passwordValidationMessage')}
                  error={password.length > 0 && !password.match(PasswordRegex)}
                  value={password}
                  endAdornment={
                    <IconButton
                      onClick={togglePasswordVisibility}
                      className={styles.visibilityToggleBtn}
                    >
                      {isPasswordVisible ? <VisibilityOff/> : <VisibilityOn/>}
                    </IconButton>
                  }
                />
              </div>
            ) : (
              <div>
                <Typography className={styles.formTitle}>{textForKey('Accept invitation')}</Typography>
                <Typography className={styles.welcomeText}>
                  {textForKey('Click on button below to accept the invitation')}
                </Typography>
              </div>
            )}
          </div>
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
        </form>
      </div>
    </div>
  );
};

export default AcceptInvitation;
