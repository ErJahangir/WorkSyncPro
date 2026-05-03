import {useState} from 'react';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {useAppDispatch} from './useAppSelector';
import {loginWithGoogle} from '@/store/slices';
import {showToast} from '@/utils';

export const useGoogleLogin = () => {
  const dispatch = useAppDispatch();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const signInWithGoogle = async () => {
    setIsGoogleLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      if (userInfo.data?.idToken) {
        await dispatch(loginWithGoogle(userInfo.data.idToken));
      }
    } catch (err: any) {
      if (err.code === statusCodes.SIGN_IN_CANCELLED) {
        showToast('error', 'User cancelled');
      } else if (err.code === statusCodes.IN_PROGRESS) {
        showToast('error', 'Operation in progress');
      } else if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        showToast('error', 'Play services not available');
      } else {
        showToast('error', 'Something went wrong with Google Login');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return {
    signInWithGoogle,
    isGoogleLoading,
  };
};
