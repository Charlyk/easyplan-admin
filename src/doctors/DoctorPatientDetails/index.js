import React, { useEffect, useState } from 'react';

import cloneDeep from 'lodash/cloneDeep';
import remove from 'lodash/remove';
import sum from 'lodash/sum';
import { useParams } from 'react-router-dom';

import './styles.scss';
import IconAvatar from '../../assets/icons/iconAvatar';
import IconTooth11 from '../../assets/icons/iconTooth11';
import IconTooth12 from '../../assets/icons/iconTooth12';
import IconTooth13 from '../../assets/icons/iconTooth13';
import IconTooth14 from '../../assets/icons/iconTooth14';
import IconTooth15 from '../../assets/icons/iconTooth15';
import IconTooth16 from '../../assets/icons/iconTooth16';
import IconTooth17 from '../../assets/icons/iconTooth17';
import IconTooth18 from '../../assets/icons/iconTooth18';
import IconTooth21 from '../../assets/icons/iconTooth21';
import IconTooth22 from '../../assets/icons/iconTooth22';
import IconTooth23 from '../../assets/icons/iconTooth23';
import IconTooth24 from '../../assets/icons/iconTooth24';
import IconTooth25 from '../../assets/icons/iconTooth25';
import IconTooth26 from '../../assets/icons/iconTooth26';
import IconTooth27 from '../../assets/icons/iconTooth27';
import IconTooth28 from '../../assets/icons/iconTooth28';
import IconTooth31 from '../../assets/icons/iconTooth31';
import IconTooth32 from '../../assets/icons/iconTooth32';
import IconTooth33 from '../../assets/icons/iconTooth33';
import IconTooth34 from '../../assets/icons/iconTooth34';
import IconTooth35 from '../../assets/icons/iconTooth35';
import IconTooth36 from '../../assets/icons/iconTooth36';
import IconTooth37 from '../../assets/icons/iconTooth37';
import IconTooth38 from '../../assets/icons/iconTooth38';
import IconTooth41 from '../../assets/icons/iconTooth41';
import IconTooth42 from '../../assets/icons/iconTooth42';
import IconTooth43 from '../../assets/icons/iconTooth43';
import IconTooth44 from '../../assets/icons/iconTooth44';
import IconTooth45 from '../../assets/icons/iconTooth45';
import IconTooth46 from '../../assets/icons/iconTooth46';
import IconTooth47 from '../../assets/icons/iconTooth47';
import IconTooth48 from '../../assets/icons/iconTooth48';
import LoadingButton from '../../components/LoadingButton';
import PatientDetails from '../../pages/Patients/comps/details/PatientDetails';
import dataAPI from '../../utils/api/dataAPI';
import { textForKey } from '../../utils/localization';
import FinalServiceItem from './components/FinalServiceItem';
import ToothView from './components/ToothView';

import { Form } from 'react-bootstrap';

const TabId = {
  appointments: 'Appointments',
  notes: 'Notes',
  xRay: 'X-Ray',
};

const DoctorPatientDetails = () => {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  useEffect(() => {
    fetchPatientDetails();
    fetchServices();
  }, [patientId]);

  const fetchServices = async () => {
    const response = await dataAPI.fetchServices(null);
    if (response.isError) {
      console.error(response.message);
    } else {
      setServices(response.data);
    }
  };

  const fetchPatientDetails = async () => {
    const response = await dataAPI.fetchAllPatients();
    if (response.isError) {
      console.error(response.message);
    } else {
      setPatient(response.data.find(item => item.id === patientId));
    }
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

  const getTotalPrice = () => {
    const prices = selectedServices.map(item => item.price);
    return sum(prices);
  };

  return (
    <div className='doctor-patient-root'>
      <div className='left-container'>
        <div className='patient-info'>
          <IconAvatar />
          <div className='personal-data-container'>
            <span className='patient-name'>{getPatientName()}</span>
            <div className='patient-info-row'>
              <span className='patient-info-title'>{textForKey('Date')}:</span>
              <span className='patient-info-value'>
                {textForKey('20 Sep 2020')}
              </span>
            </div>
            <div className='patient-info-row'>
              <span className='patient-info-title'>
                {textForKey('Doctor')}:
              </span>
              <span className='patient-info-value'>Jacob Jones</span>
            </div>
          </div>
        </div>
        <div className='tooth-container'>
          <div className='top-left'>
            <ToothView
              icon={<IconTooth18 />}
              services={services}
              toothId='18'
            />
            <ToothView
              icon={<IconTooth17 />}
              services={services}
              toothId='17'
            />
            <ToothView
              icon={<IconTooth16 />}
              services={services}
              toothId='16'
            />
            <ToothView
              icon={<IconTooth15 />}
              services={services}
              toothId='15'
            />
            <ToothView
              icon={<IconTooth14 />}
              services={services}
              toothId='14'
            />
            <ToothView
              icon={<IconTooth13 />}
              services={services}
              toothId='13'
            />
            <ToothView
              icon={<IconTooth12 />}
              services={services}
              toothId='12'
            />
            <ToothView
              icon={<IconTooth11 />}
              services={services}
              toothId='11'
            />
          </div>
          <div className='top-right'>
            <ToothView
              icon={<IconTooth21 />}
              services={services}
              toothId='21'
            />
            <ToothView
              icon={<IconTooth22 />}
              services={services}
              toothId='22'
            />
            <ToothView
              icon={<IconTooth23 />}
              services={services}
              toothId='23'
            />
            <ToothView
              icon={<IconTooth24 />}
              services={services}
              toothId='24'
            />
            <ToothView
              icon={<IconTooth25 />}
              services={services}
              toothId='25'
            />
            <ToothView
              icon={<IconTooth26 />}
              services={services}
              toothId='26'
            />
            <ToothView
              icon={<IconTooth27 />}
              services={services}
              toothId='27'
            />
            <ToothView
              icon={<IconTooth28 />}
              services={services}
              toothId='28'
            />
          </div>
          <div className='bottom-left'>
            <ToothView
              icon={<IconTooth48 />}
              services={services}
              toothId='48'
              direction='top'
            />
            <ToothView
              icon={<IconTooth47 />}
              services={services}
              toothId='47'
              direction='top'
            />
            <ToothView
              icon={<IconTooth46 />}
              services={services}
              toothId='46'
              direction='top'
            />
            <ToothView
              icon={<IconTooth45 />}
              services={services}
              toothId='45'
              direction='top'
            />
            <ToothView
              icon={<IconTooth44 />}
              services={services}
              toothId='44'
              direction='top'
            />
            <ToothView
              icon={<IconTooth43 />}
              services={services}
              toothId='43'
              direction='top'
            />
            <ToothView
              icon={<IconTooth42 />}
              services={services}
              toothId='42'
              direction='top'
            />
            <ToothView
              icon={<IconTooth41 />}
              services={services}
              toothId='41'
              direction='top'
            />
          </div>
          <div className='bottom-right'>
            <ToothView
              icon={<IconTooth31 />}
              services={services}
              toothId='31'
              direction='top'
            />
            <ToothView
              icon={<IconTooth32 />}
              services={services}
              toothId='32'
              direction='top'
            />
            <ToothView
              icon={<IconTooth33 />}
              services={services}
              toothId='33'
              direction='top'
            />
            <ToothView
              icon={<IconTooth34 />}
              services={services}
              toothId='34'
              direction='top'
            />
            <ToothView
              icon={<IconTooth35 />}
              services={services}
              toothId='35'
              direction='top'
            />
            <ToothView
              icon={<IconTooth36 />}
              services={services}
              toothId='36'
              direction='top'
            />
            <ToothView
              icon={<IconTooth37 />}
              services={services}
              toothId='37'
              direction='top'
            />
            <ToothView
              icon={<IconTooth38 />}
              services={services}
              toothId='38'
              direction='top'
            />
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

            {selectedServices.length === 0 && (
              <span className='no-data-label'>
                {textForKey('No selected services')}
              </span>
            )}

            {selectedServices.map(service => (
              <FinalServiceItem key={service.id} service={service} />
            ))}

            {selectedServices.length > 0 && (
              <span className='total-price'>
                {textForKey('Total')}: {getTotalPrice()} MDL
              </span>
            )}

            <LoadingButton
              disabled={selectedServices.length === 0}
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
            patient={patient}
            showTabs={[TabId.appointments, TabId.xRay, TabId.notes]}
          />
        )}
      </div>
    </div>
  );
};

export default DoctorPatientDetails;
