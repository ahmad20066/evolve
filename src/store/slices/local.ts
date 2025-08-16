import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface LocalState {
  access_token: string | undefined;
  fcm_token: string | undefined;
  user: {
    name: string;
    email: string;
    phone: string;
    role: string;
    gender: string;
    age: string;
    height: string;
  };
  language: boolean;
}

const initialState: LocalState = {
  access_token: undefined,
  fcm_token: undefined,
  user: {
    name: '',
    email: '',
    phone: '',
    role: '',
    gender: '',
    age: '',
    height: '',
  },
  language: false,
};

const localSlice = createSlice({
  name: 'local',
  initialState,
  reducers: {
    setAccessToken: (
      state,
      action: PayloadAction<LocalState['access_token']>,
    ) => {
      state.access_token = action.payload;
    },
    setFCMToken: (state, action: PayloadAction<LocalState['fcm_token']>) => {
      state.fcm_token = action.payload;
    },
    removeAccessToken: state => {
      state.access_token = undefined;
    },
    setUser: (state, action: PayloadAction<LocalState['user']>) => {
      state.user = action.payload;
    },
    toggleLanguage: state => {
      state.language = !state.language;
    },
  },
});

export const {setAccessToken, removeAccessToken, setFCMToken, setUser} =
  localSlice.actions;

export default localSlice;
