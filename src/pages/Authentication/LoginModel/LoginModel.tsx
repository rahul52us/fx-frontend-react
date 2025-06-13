import { observer } from "mobx-react-lite";
import FormModel from "../../../config/component/common/FormModel/FormModel";
import store from "../../../store/store";
import Login from "../Login/Login";

const LoginModel = observer(() => {
  const {
    auth: { loginModel, openLoginModel },
  } = store;
  return (
    <FormModel open={loginModel} close={openLoginModel}>
      <Login />
    </FormModel>
  );
});

export default LoginModel;