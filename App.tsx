/**
 * WorkSync Pro - Root Application Component
 * Configures providers: Redux, Theme, Navigation, Toast
 */

import React, {useEffect} from 'react';
import {StatusBar, LogBox} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import {toastConfig} from '@utils/toast';
import {ThemeProvider, useTheme} from '@theme/ThemeProvider';
import {useAppSelector, useAppDispatch} from '@hooks/useAppSelector';
import {setupNotifications} from '@services/notificationService';
import {SplashScreen} from '@screens/auth/SplashScreen';
import {navigationRef} from '@navigation/navigationRef';
import {RootNavigator} from '@navigation/RootNavigator';
import {persistor, store} from '@store/index';
import {initializeAuth} from '@store/slices/authSlice';

LogBox.ignoreLogs(['Require cycle:', 'EventEmitter.removeListener']);

// Inner component that has access to theme context
const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const {theme, isDark} = useTheme();
  const {isInitialized} = useAppSelector(state => state.auth);

  useEffect(() => {
    dispatch(initializeAuth());
    setupNotifications();
  }, [dispatch]);

  if (!isInitialized) {
    return <SplashScreen />;
  }

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
        translucent={false}
      />
      <NavigationContainer
        ref={navigationRef}
        theme={{
          dark: isDark,
          colors: {
            primary: theme.colors.primary,
            background: theme.colors.background,
            card: theme.colors.surface,
            text: theme.colors.text,
            border: theme.colors.border,
            notification: theme.colors.error,
          },
        }}>
        <RootNavigator />
      </NavigationContainer>
      <Toast config={toastConfig} />
    </>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={{flex: 1}}>
          <SafeAreaProvider>
            <ThemeProvider>
              <AppContent />
            </ThemeProvider>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
};

export default App;
