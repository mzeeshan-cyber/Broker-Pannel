import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// project import
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
import Snackbar from 'components/@extended/Snackbar';

// auth-provider
import Customization from 'components/Customization';
import Router from 'routes';
import { Provider } from 'react-redux';
import store, { persistor } from 'store/reducers/store';
import { PersistGate } from 'redux-persist/integration/react';
import "./index.css"
// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

export default function App() {
  return (
    <ThemeCustomization>
        <ScrollTop>
          <>
            <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                <Router />
                <Customization />
              </PersistGate>
            </Provider>
            <Snackbar />
          </>
        </ScrollTop>
    </ThemeCustomization>
  );
}
