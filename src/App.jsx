/* ==========================================
   AMIOUT ENTERPRISE - APP
========================================== */

import GlobalPageLoader from "./components/common/GlobalPageLoader";
import AppRoutes from "./routes/AppRoutes";

/* ==========================================
   APP COMPONENT
========================================== */

const App = () => {
  return (
    <>
      {/* GLOBAL API LOADING INDICATOR */}
      <GlobalPageLoader />

      {/* ALL EXISTING APPLICATION ROUTES */}
      <AppRoutes />
    </>
  );
};

export default App;
