import PropTypes from "prop-types";

export default PropTypes.shape({
  id: PropTypes.number,
  created: PropTypes.string,
  lastUpdated: PropTypes.string,
  messageSnippet: PropTypes.string,
  source: PropTypes.string,
  sourceDescription: PropTypes.string,
  contact: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
    phoneNumber: PropTypes.string,
    photoUrl: PropTypes.string
  }),
  patient: PropTypes.shape({
    id: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    phoneWithCode: PropTypes.string,
  }),
  state: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    color: PropTypes.string,
    orderId: PropTypes.number,
    deleteable: PropTypes.bool,
    type: PropTypes.string,
  }),
  assignedTo: PropTypes.shape({
    id: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }),
  service: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    price: PropTypes.number,
    currency: PropTypes.string,
  }),
  schedule: PropTypes.shape({
    id: PropTypes.number,
    created: PropTypes.string,
    dateAndTime: PropTypes.string,
    endTime: PropTypes.string,
    doctor: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
  }),
})
