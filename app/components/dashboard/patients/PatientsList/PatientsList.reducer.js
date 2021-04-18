import { generateReducerActions } from "../../../../../utils/helperFuncs";

export const initialState = {
  isLoading: false,
  isUploading: false,
  showUploadModal: false,
  showDeleteDialog: false,
  patients: { data: [], total: 0 },
  rowsPerPage: 25,
  page: 0,
  showCreateModal: false,
  searchQuery: '',
  patientToDelete: null,
  isDeleting: false,
};

const reducerTypes = {
  setIsLoading: 'setIsLoading',
  setIsUploading: 'setIsUploading',
  setPatients: 'setPatients',
  setRowsPerPage: 'setRowsPerPage',
  setPage: 'setPage',
  setShowUploadModal: 'setShowUploadModal',
  setShowCreateModal: 'setShowCreateModal',
  setSearchQuery: 'setSearchQuery',
  setShowDeleteDialog: 'setShowDeleteDialog',
  setPatientToDelete: 'setPatientToDelete',
  setIsDeleting: 'setIsDeleting',
  setInitialQuery: 'setInitialQuery',
};

export const actions = generateReducerActions(reducerTypes);

/**
 * Patients list reducer
 * @param {Object} state
 * @param {{ type: string, payload: any }} action
 */
export const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setIsLoading:
      return { ...state, isLoading: action.payload };
    case reducerTypes.setIsUploading:
      return { ...state, isUploading: action.payload };
    case reducerTypes.setShowUploadModal:
      return { ...state, showUploadModal: action.payload };
    case reducerTypes.setPatients:
      return { ...state, patients: action.payload };
    case reducerTypes.setPage:
      return { ...state, page: action.payload };
    case reducerTypes.setRowsPerPage:
      return { ...state, rowsPerPage: action.payload, page: 0 };
    case reducerTypes.setShowCreateModal:
      return { ...state, showCreateModal: action.payload };
    case reducerTypes.setSearchQuery:
      return { ...state, searchQuery: action.payload };
    case reducerTypes.setShowDeleteDialog:
      return { ...state, showDeleteDialog: action.payload };
    case reducerTypes.setPatientToDelete:
      return {
        ...state,
        patientToDelete: action.payload,
        showDeleteDialog: Boolean(action.payload),
        isDeleting: false,
      };
    case reducerTypes.setIsDeleting:
      return { ...state, isDeleting: action.payload };
    case reducerTypes.setInitialQuery: {
      const { page, rowsPerPage } = action.payload;
      return {
        ...state,
        page,
        rowsPerPage,
      }
    }
    default:
      return state;
  }
};
