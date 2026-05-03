/**
 * WorkSync Pro - Navigation Reference
 * Allows navigation from outside React components (e.g., notification handlers)
 */

import {createNavigationContainerRef} from '@react-navigation/native';
import {RootStackParamList} from '@/types';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export const navigate = (name: keyof RootStackParamList, params?: object) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name as any, params as any);
  }
};

export const goBack = () => {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
};

export const reset = (routeName: keyof RootStackParamList) => {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{name: routeName}],
    });
  }
};
