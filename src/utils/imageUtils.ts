/**
 * WorkSync Pro - Image Utilities
 * Helpers for image picking, processing, and validation
 */

import {launchImageLibrary, launchCamera, Asset} from 'react-native-image-picker';
import {Alert} from 'react-native';

/**
 * Open the device image library to pick a photo
 */
export const pickImageFromLibrary = async (
  maxWidth = 800,
  maxHeight = 800,
): Promise<Asset | null> => {
  try {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      maxWidth,
      maxHeight,
      includeBase64: true,
    });

    if (result.didCancel) {
      return null;
    }

    if (result.errorCode) {
      Alert.alert('Error', result.errorMessage || 'Failed to pick image');
      return null;
    }

    const asset = result.assets?.[0];
    if (!asset || !asset.uri) {
      return null;
    }

    return asset;
  } catch (error: any) {
    Alert.alert('Error', error.message || 'An unexpected error occurred while picking an image');
    return null;
  }
};

/**
 * Open the device camera to take a photo
 */
export const takePhotoWithCamera = async (
  maxWidth = 800,
  maxHeight = 800,
): Promise<Asset | null> => {
  try {
    const result = await launchCamera({
      mediaType: 'photo',
      quality: 0.8,
      maxWidth,
      maxHeight,
      saveToPhotos: true,
      includeBase64: true,
    });

    if (result.didCancel) {
      return null;
    }

    if (result.errorCode) {
      if (result.errorCode === 'camera_unavailable') {
        Alert.alert('Error', 'Camera is not available on this device');
      } else if (result.errorCode === 'permission') {
        Alert.alert('Permission Denied', 'Please grant camera permissions in settings');
      } else {
        Alert.alert('Error', result.errorMessage || 'Failed to capture image');
      }
      return null;
    }

    const asset = result.assets?.[0];
    if (!asset || !asset.uri) {
      return null;
    }

    return asset;
  } catch (error: any) {
    Alert.alert('Error', error.message || 'An unexpected error occurred while capturing an image');
    return null;
  }
};

/**
 * Simple base64 decoder for environments without atob()
 */
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

export const decodeBase64 = (base64: string): ArrayBuffer => {
  let str = base64.replace(/=+$/, '');
  let len = str.length;
  let bytes = new Uint8Array((len * 3) >> 2);
  let p = 0;

  for (let i = 0; i < len; i += 4) {
    let c1 = chars.indexOf(str[i]);
    let c2 = chars.indexOf(str[i + 1]);
    let c3 = i + 2 < len ? chars.indexOf(str[i + 2]) : -1;
    let c4 = i + 3 < len ? chars.indexOf(str[i + 3]) : -1;

    bytes[p++] = (c1 << 2) | (c2 >> 4);
    if (c3 !== -1) bytes[p++] = ((c2 & 0xf) << 4) | (c3 >> 2);
    if (c4 !== -1) bytes[p++] = ((c3 & 0x3) << 6) | c4;
  }

  return bytes.buffer;
};
