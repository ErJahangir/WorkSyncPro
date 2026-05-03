import {useEffect, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';

import {useAppDispatch} from './useAppSelector';
import {setNetworkAvailable} from '@/store/slices';

export const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const connected = state.isConnected ?? true;
      setIsConnected(connected);
      dispatch(setNetworkAvailable(connected));
    });
    return () => unsubscribe();
  }, [dispatch]);

  return isConnected;
};
