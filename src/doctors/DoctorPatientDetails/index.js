import React, { useEffect, useState } from 'react';

import cloneDeep from 'lodash/cloneDeep';
import remove from 'lodash/remove';
import sum from 'lodash/sum';
import moment from 'moment';
import { Form, Modal, Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import './styles.scss';
import IconAvatar from '../../assets/icons/iconAvatar';
import LoadingButton from '../../components/LoadingButton';
import PatientDetails from '../../pages/Patients/comps/details/PatientDetails';
import {
  setPatientNoteModal,
  setPatientXRayModal,
} from '../../redux/actions/actions';
import dataAPI from '../../utils/api/dataAPI';
import { teeth } from '../../utils/constants';
import { textForKey } from '../../utils/localization';
import FinalServiceItem from './components/FinalServiceItem';
import ToothView from './components/ToothView';

const TabId = {
  appointmentsNotes: 'AppointmentsNotes',
  notes: 'Notes',
  xRay: 'X-Ray',
};

const DoctorPatientDetails = () => {
  const dispatch = useDispatch();
  const { patientId, scheduleId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [patient, setPatient] = useState(null);
  const [services, setServices] = useState([]);
  const [teethServices, setTeethServices] = useState([]);
  const [toothServices, setToothServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [schedule, setSchedule] = useState(null);

  useEffect(() => {
    fetchPatientDetails();
  }, [patientId]);

  const fetchServices = async () => {
    const response = await dataAPI.fetchServices(null);
    if (response.isError) {
      console.error(response.message);
    } else {
      const { data } = response;
      setServices(data.filter(item => item.serviceType === 'all'));
      setToothServices(data.filter(item => item.serviceType !== 'all'));
    }
  };

  const fetchScheduleDetails = async () => {
    const response = await dataAPI.fetchScheduleDetails(scheduleId);
    if (!response.isError) {
      setSchedule(response.data);
    }
  };

  const fetchPatientDetails = async () => {
    setIsLoading(true);
    const response = await dataAPI.fetchAllPatients();
    if (response.isError) {
      console.error(response.message);
    } else {
      setPatient(response.data.find(item => item.id === patientId));
      await fetchServices();
      await fetchScheduleDetails();
    }
    setIsLoading(false);
  };

  const handleServiceChecked = event => {
    const serviceId = event.target.id;
    const newServices = cloneDeep(selectedServices);
    const service = services.find(item => item.id === serviceId);
    if (newServices.some(item => item.id === serviceId)) {
      remove(newServices, item => item.id === serviceId);
    } else {
      newServices.push(service);
    }
    setSelectedServices(newServices);
  };

  const handleAddNote = () => {
    dispatch(setPatientNoteModal({ open: true, patientId, mode: 'notes' }));
  };

  const handleAddXRay = () => {
    dispatch(setPatientXRayModal({ open: true, patientId }));
  };

  const handleAddAppointmentNote = () => {
    dispatch(
      setPatientNoteModal({
        open: true,
        patientId,
        mode: 'appointments',
        scheduleId,
      }),
    );
  };

  const handleToothServicesChange = ({ toothId, services }) => {
    let newServices = cloneDeep(teethServices);
    if (newServices.some(item => item.toothId === toothId)) {
      newServices = newServices.map(item => {
        if (item.toothId !== toothId) {
          return item;
        }

        return {
          ...item,
          services,
        };
      });
    } else {
      newServices.push({ toothId, services });
    }

    setTeethServices(newServices);
  };

  const getPatientName = () => {
    if (patient?.firstName && patient?.lastName) {
      return `${patient.firstName} ${patient.lastName}`;
    } else if (patient?.firstName) {
      return patient.firstName;
    } else if (patient?.lastName) {
      return patient.lastName;
    } else {
      return patient?.phoneNumber || '';
    }
  };

  const getCombinedServices = () => {
    let allServices = cloneDeep(selectedServices);
    for (let tooth of teethServices) {
      if (!Array.isArray(tooth.services)) {
        continue;
      }
      for (let toothService of tooth.services) {
        if (allServices?.some(item => item.id === toothService.id)) {
          allServices = allServices.map(item => {
            if (item.id !== toothService.id) {
              return item;
            }

            return {
              ...item,
              price: item.price + toothService.price,
            };
          });
        } else {
          allServices.push(toothService);
        }
      }
    }
    return allServices;
  };

  const getTotalPrice = () => {
    const prices = getCombinedServices().map(item => item.price);
    return sum(prices);
  };

  return (
    <div className='doctor-patient-root'>
      <Modal
        centered
        className='loading-modal'
        show={isLoading}
        onHide={() => null}
      >
        <Modal.Body>
          <Spinner animation='border' />
          {textForKey('Loading patient...')}
        </Modal.Body>
      </Modal>
      <div className='left-container'>
        <div className='patient-info'>
          <IconAvatar />
          <div className='personal-data-container'>
            <span className='patient-name'>{getPatientName()}</span>
            <div className='patient-info-row'>
              <span className='patient-info-title'>{textForKey('Date')}:</span>
              <span className='patient-info-value'>
                {schedule
                  ? moment(schedule.dateAndTime).format('DD MMM YYYY HH:mm')
                  : ''}
              </span>
            </div>
            <div className='patient-info-row'>
              <span className='patient-info-title'>
                {textForKey('Doctor')}:
              </span>
              <span className='patient-info-value'>{schedule?.doctorName}</span>
            </div>
          </div>
        </div>
        <div className='tooth-container'>
          <div className='top-left'>
            {teeth
              .filter(it => it.type === 'top-left')
              .map(item => (
                <ToothView
                  key={item.toothId}
                  onServicesChange={handleToothServicesChange}
                  icon={item.icon}
                  services={toothServices}
                  toothId={item.toothId}
                />
              ))}
          </div>
          <div className='top-right'>
            {teeth
              .filter(it => it.type === 'top-right')
              .map(item => (
                <ToothView
                  key={item.toothId}
                  onServicesChange={handleToothServicesChange}
                  icon={item.icon}
                  services={toothServices}
                  toothId={item.toothId}
                />
              ))}
          </div>
          <div className='bottom-left'>
            {teeth
              .filter(it => it.type === 'bottom-left')
              .map(item => (
                <ToothView
                  key={item.toothId}
                  onServicesChange={handleToothServicesChange}
                  icon={item.icon}
                  services={toothServices}
                  toothId={item.toothId}
                  direction='top'
                />
              ))}
          </div>
          <div className='bottom-right'>
            {teeth
              .filter(it => it.type === 'bottom-right')
              .map(item => (
                <ToothView
                  key={item.toothId}
                  onServicesChange={handleToothServicesChange}
                  icon={item.icon}
                  services={toothServices}
                  toothId={item.toothId}
                  direction='top'
                />
              ))}
          </div>
        </div>
        <div className='services-container'>
          <div className='available-services'>
            <span className='total-title'>{textForKey('Services')}</span>
            {services.map(service => (
              <Form.Group key={service.id} controlId={service.id}>
                <Form.Check
                  onChange={handleServiceChecked}
                  type='checkbox'
                  checked={selectedServices.some(
                    item => item.id === service.id,
                  )}
                  label={service.name}
                />
              </Form.Group>
            ))}
          </div>
          <div className='services-total'>
            <span className='total-title'>
              {textForKey('Provided services')}
            </span>

            {getCombinedServices().length === 0 && (
              <span className='no-data-label'>
                {textForKey('No selected services')}
              </span>
            )}

            {getCombinedServices().map(service => (
              <FinalServiceItem key={service.id} service={service} />
            ))}

            {getCombinedServices().length > 0 && (
              <span className='total-price'>
                {textForKey('Total')}: {getTotalPrice()} MDL
              </span>
            )}

            <LoadingButton
              disabled={getCombinedServices().length === 0}
              className='positive-button'
            >
              {textForKey('Finalize')}
            </LoadingButton>
          </div>
        </div>
      </div>
      <div className='right-container'>
        {patient && (
          <PatientDetails
            onAddXRay={handleAddXRay}
            onAddNote={handleAddNote}
            onAddAppointmentNote={handleAddAppointmentNote}
            patient={patient}
            defaultTab={TabId.appointmentsNotes}
            showTabs={[TabId.appointmentsNotes, TabId.xRay, TabId.notes]}
          />
        )}
      </div>
    </div>
  );
};

export default DoctorPatientDetails;
