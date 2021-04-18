import { generateReducerActions } from "../../../../../../utils/helperFuncs";
import cloneDeep from "lodash/cloneDeep";

export const diagnosisClass = [1, 2, 3];
export const diagnosisOcclusion = [
  'Inverse',
  'Anterior',
  'Posterior',
  'Deep',
  'Open',
  'Normal',
  'General',
  'Space',
  'Crowding',
  'Supernumerary',
  'Transposition',
];
export const radiographic = ['Orthopantomogram', 'Cephalometric'];
export const fallenBracketsList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const PlanType = {
  mandible: 'Mandible',
  maxillary: 'Maxillary',
};

export const initialState = {
  isLoading: true,
  isSaving: false,
  planType: PlanType.mandible,
  bracketsPlan: {
    Mandible: {
      classes: [],
      occlusions: [],
      radiographs: [],
      braces: [],
      services: [],
      fallenBraces: [],
      note: '',
      angleClasses: {
        molarCaninMolar: 0,
        molarCaninCanin: 0,
        caninMolarCanin: 0,
        caninMolarMolar: 0,
      },
    },
    Maxillary: {
      classes: [],
      occlusions: [],
      radiographs: [],
      braces: [],
      services: [],
      fallenBraces: [],
      note: '',
      angleClasses: {
        molarCaninMolar: 0,
        molarCaninCanin: 0,
        caninMolarCanin: 0,
        caninMolarMolar: 0,
      },
    },
  },
};

const reducerTypes = {
  setPlanType: 'setPlanType',
  setBracketsPlan: 'setBracketsPlan',
  setMalocclusion: 'setMalocclusion',
  setMolarCaninMolar: 'setMolarCaninMolar',
  setMolarCaninCanin: 'setMolarCaninCanin',
  setCaninMolarMolar: 'setCaninMolarMolar',
  setCaninMolarCanin: 'setCaninMolarCanin',
  setIsLoading: 'setIsLoading',
  setIsSaving: 'setIsSaving',
};

export const actions = generateReducerActions(reducerTypes);

export const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setIsLoading:
      return { ...state, isLoading: action.payload };
    case reducerTypes.setIsSaving:
      return { ...state, isSaving: action.payload };
    case reducerTypes.setPlanType:
      return { ...state, planType: action.payload };
    case reducerTypes.setMolarCaninMolar: {
      const plan = cloneDeep(state.bracketsPlan);
      const { planTypeName, value } = action.payload;
      const planType = plan[planTypeName];
      return {
        ...state,
        bracketsPlan: {
          ...plan,
          [planTypeName]: {
            ...planType,
            angleClasses: {
              ...planType.angleClasses,
              molarCaninMolar: value,
            },
          },
        },
      };
    }
    case reducerTypes.setMolarCaninCanin: {
      const plan = cloneDeep(state.bracketsPlan);
      const { planTypeName, value } = action.payload;
      const planType = plan[planTypeName];
      return {
        ...state,
        bracketsPlan: {
          ...plan,
          [planTypeName]: {
            ...planType,
            angleClasses: {
              ...planType.angleClasses,
              molarCaninCanin: value,
            },
          },
        },
      };
    }
    case reducerTypes.setCaninMolarMolar: {
      const plan = cloneDeep(state.bracketsPlan);
      const { planTypeName, value } = action.payload;
      const planType = plan[planTypeName];
      return {
        ...state,
        bracketsPlan: {
          ...plan,
          [planTypeName]: {
            ...planType,
            angleClasses: {
              ...planType.angleClasses,
              caninMolarMolar: value,
            },
          },
        },
      };
    }
    case reducerTypes.setCaninMolarCanin: {
      const plan = cloneDeep(state.bracketsPlan);
      const { planTypeName, value } = action.payload;
      const planType = plan[planTypeName];
      return {
        ...state,
        bracketsPlan: {
          ...plan,
          [planTypeName]: {
            ...planType,
            angleClasses: {
              ...planType.angleClasses,
              caninMolarCanin: value,
            },
          },
        },
      };
    }
    case reducerTypes.setBracketsPlan: {
      const plan = cloneDeep(state.bracketsPlan);
      const { planTypeName, data } = action.payload;
      const planType = plan[planTypeName];
      return {
        ...state,
        bracketsPlan: {
          ...plan,
          [planTypeName]: {
            ...planType,
            ...data,
          },
        },
      };
    }
    default:
      return state;
  }
};
