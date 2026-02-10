import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
import Customization from 'components/Customization';
import Router from 'routes';

import { Provider } from 'react-redux';
import store, { persistor } from 'store/reducers/store';
import { PersistGate } from 'redux-persist/integration/react';

import { SnackbarProvider } from 'notistack';

import "./index.css";
import Snackbar from 'components/@extended/Snackbar';

export default function App() {
  return (
    <ThemeCustomization>
      <ScrollTop>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>

            {/* ✅ NOTISTACK PROVIDER */}
            <SnackbarProvider
              maxSnack={4}
              autoHideDuration={4000}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              preventDuplicate
            >
              <Router />
              <Customization />
            </SnackbarProvider>

          </PersistGate>
        </Provider>
        <Snackbar />
      </ScrollTop>
    </ThemeCustomization>
  );
}
