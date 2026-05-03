/**
 * WorkSync Pro - Toast Utility
 * Simple toast message wrapper
 */

import Toast, {
  ToastConfig,
  ToastConfigParams,
} from 'react-native-toast-message';
import {View} from 'react-native';
import React from 'react';
import {RNText} from '@/components/common';

type ToastType = 'success' | 'error' | 'info';

export const showToast = (
  type: ToastType,
  message: string,
  duration = 3000,
) => {
  Toast.show({
    type,
    text1: message,
    position: 'top',
    visibilityTime: duration,
    topOffset: 50,
  });
};

export const toastConfig: ToastConfig = {
  success: ({text1}: ToastConfigParams<any>) => (
    <View
      style={{
        backgroundColor: '#10B981',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
      }}>
      <RNText style={{color: '#fff', fontSize: 14, fontWeight: '600'}}>
        ✓ {text1}
      </RNText>
    </View>
  ),
  error: ({text1}: ToastConfigParams<any>) => (
    <View
      style={{
        backgroundColor: '#F43F5E',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
      }}>
      <RNText style={{color: '#fff', fontSize: 14, fontWeight: '600'}}>
        ⚠️ {text1}
      </RNText>
    </View>
  ),
  info: ({text1}: ToastConfigParams<any>) => (
    <View
      style={{
        backgroundColor: '#0EA5E9',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
      }}>
      <RNText style={{color: '#fff', fontSize: 14, fontWeight: '600'}}>
        ℹ️ {text1}
      </RNText>
    </View>
  ),
};
