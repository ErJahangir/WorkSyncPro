/**
 * WorkSync Pro - Root Application Component
 * Configures providers: Redux, Theme, Navigation, Toast
 */

import React, {useEffect} from 'react';
import {StatusBar, LogBox} from 'react-native';
import {Provider} from 'react-redux';
import Toast from 'react-native-toast-message';
import {PersistGate} from 'redux-persist/integration/react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

import {useAppDispatch, useAppSelector} from '@/hooks';
import {ThemeProvider, useTheme} from '@/theme';
import {initializeAuth} from '@/store/slices';
import {GOOGLE_IOS_CLIENT_ID, GOOGLE_WEB_CLIENT_ID} from '@/constants';
import {setupNotifications} from '@/services';
import {SplashScreen} from '@/screens';
import {navigationRef} from '@/navigation/navigationRef';
import {RootNavigator} from '@/navigation/RootNavigator';
import {toastConfig} from '@/utils';
import {persistor, store} from '@/store';

LogBox.ignoreAllLogs();

// Inner component that has access to theme context
const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const {theme, isDark} = useTheme();
  const {isInitialized, user} = useAppSelector(state => state.auth);
  const [showSplash, setShowSplash] = React.useState(true);
  const [isAppReady, setIsAppReady] = React.useState(false);
  useEffect(() => {
    dispatch(initializeAuth());

    // Configure Google Sign-In
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      iosClientId: GOOGLE_IOS_CLIENT_ID,
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });

    let unsubscribe: any;
    const initNotifications = async () => {
      unsubscribe = await setupNotifications(user?.id);
    };

    initNotifications();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [dispatch, user?.id]);

  // Minimum splash screen duration timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppReady(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showSplash && (
        <SplashScreen
          isLoading={!isAppReady || !isInitialized}
          onAnimationEnd={() => setShowSplash(false)}
        />
      )}
      {isInitialized && (
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
      )}
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
