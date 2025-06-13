import { observer } from "mobx-react-lite";
import store from "../../../../store/store";
import TripUserDetail from "./user/TripUserDetail";
import TripAdminDetails from "./admin";
import PermissionDeniedPage from "../../../../config/component/commonPages/PermissionDeniedPage";

const index = observer(() => {
  const {
    auth: { user, checkPermission, hasComponentAccess },
  } = store;

  if (hasComponentAccess()) {
    return (
      <PermissionDeniedPage show={!checkPermission("trip", "view")}>
        <TripAdminDetails />
      </PermissionDeniedPage>
    );
  } else {
    return (
      <PermissionDeniedPage show={!checkPermission("trip", "view")}>
        <TripUserDetail
          userId={user._id}
        />
      </PermissionDeniedPage>
    );
  }
});

export default index;
