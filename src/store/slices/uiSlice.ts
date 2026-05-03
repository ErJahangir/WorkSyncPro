import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {UIState} from '@/types';

const initialState: UIState = {
  isNetworkAvailable: true,
  isDarkMode: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setNetworkAvailable: (state, action: PayloadAction<boolean>) => {
      state.isNetworkAvailable = action.payload;
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
  },
});

export const {setNetworkAvailable, setDarkMode} = uiSlice.actions;
export default uiSlice.reducer;
