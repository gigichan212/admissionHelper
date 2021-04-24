import React, { useEffect, useRef } from "react";
import { Route, Switch } from "react-router-dom";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "./store";
import { checkLogin } from "./redux/auth/actions";
// @ts-ignore
import { Helmet } from "react-helmet";
// Components
import Login from "./component/Login/Login";
import FormStep1 from "./component/formPage/FormStep1";
import Footer from "./component/general/Footer";
import SelectType from "./component/SelectType";
import { EditChoicePage } from "./component/editPages/EditChoicePage";
import { UploadDepositSlip } from "./component/editPages/UploadDepositSlip";
import ResultPage from "./component/resultPages/ResultPage";
import TypeLandingPage from "./component/TypeLandingPage";
import FormStep2 from "./component/formPage/FormStep2";
import EditForm from "./component/editPages/EditForm";
import NavBar from "./component/general/NavBar";
import FormStep3 from "./component/formPage/FormStep3";
import ErrorComponent from "./component/general/Error";
import { fetchPeriod } from "./redux/period/thunkActions";
import LoginRequest from "./component/Login/LoginRequest";
import LoadingComponent from "./component/general/Loading";
import logo from "../src/assets/img/logo.png";
import { addRecentPhotoPreview } from "./redux/application/actions";
import AlertComponent from "./component/general/AlertMsg";
import ScrollToTop from "./component/general/ScollToTop";

function App() {
  const dispatch = useDispatch();

  // Get user Login Status from the store
  const isAuthenticated = useSelector((state: IRootState) => state.auth.isAuth);

  //Get login/ logout status from the store, for login/ logout alert
  const isLoginSuccess = useSelector(
    (state: IRootState) => state.auth.effect?.isLoginSuccess
  );
  const isLogoutSuccess = useSelector(
    (state: IRootState) => state.auth.effect?.isLogoutSuccess
  );
  //Check if the user is logged in
  useEffect(() => {
    dispatch(checkLogin());
    dispatch(fetchPeriod());
  }, [dispatch]);

  //get input file value from the store
  const fileInput = useRef(null);
  const selectedImage = useSelector(
    (state: IRootState) =>
      state.application.payload.application.recentPhoto.selectedImage
  );
  useEffect(() => {
    if (selectedImage == null) {
      const current = fileInput.current as any;
      current.value = null;
    }
  }, [selectedImage]);

  //Stop the component from rendering before check login is done
  if (isAuthenticated === null) {
    return <LoadingComponent />;
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>入學申請 | 香城學校</title>
        <link id="favicon" rel="icon" href={logo} type="image/x-icon" />
      </Helmet>

      {/* NavBar */}
      <ScrollToTop />

      {/* NavBar */}
      <NavBar />

      {/* Login / Logout Alert Message */}
      {isLoginSuccess && <AlertComponent type={"login"} />}
      {isLogoutSuccess && <AlertComponent type={"logout"} />}

      <Switch>
        <Route exact path="/">
          {isAuthenticated ? <EditChoicePage /> : <SelectType />}
        </Route>
        <Route exact path="/form">
          <SelectType />
        </Route>
        {/** login request  */}
        <Route exact path="/login-request/token/:token">
          {isAuthenticated ? <SelectType /> : <LoginRequest />}
        </Route>

        {/** normal / interim admission  */}
        <Route exact path="/form/normal-landing">
          {<TypeLandingPage type="normal" />}
        </Route>
        <Route exact path="/form/interim-landing">
          {<TypeLandingPage type="interim" />}
        </Route>

        {/** Form step */}
        <Route exact path="/form/:type/step1">
          <FormStep1 />
        </Route>
        <Route exact path="/form/:type/step2">
          <FormStep2 />
        </Route>
        <Route exact path="/form/:type/step3">
          <FormStep3 />
        </Route>

        {/** Edit Form */}
        <Route exact path="/edit">
          {isAuthenticated ? (
            <EditChoicePage />
          ) : (
            <Login type="editSelecting" />
          )}
        </Route>
        <Route exact path="/edit/edit-form">
          {isAuthenticated ? <EditForm /> : <Login type="editSelecting" />}
        </Route>
        <Route exact path="/edit/upload-deposit-slip">
          {isAuthenticated ? (
            <UploadDepositSlip />
          ) : (
            <Login type="editSelecting" />
          )}
        </Route>

        <Route exact path="/result">
          {isAuthenticated ? <ResultPage /> : <Login type="checkResult" />}
        </Route>
        <Route>
          <ErrorComponent type="404 Not Found" />
        </Route>
      </Switch>
      <input
        style={{ display: "none" }}
        className="form-control form-control-lg"
        type="file"
        ref={fileInput} //reset input value to null if user deletes image
        id="recent_photo"
        name="recent_photo"
        accept=".png, .jpg, .jpeg"
        onChange={(e) => {
          console.log("App.tsx upload file");
          if (e.target.files) {
            console.log("App.tsx: ", e.target.files);
            dispatch(addRecentPhotoPreview(e.target.files));
          }
        }}
      />
      <Footer />
    </>
  );
}

export default App;
