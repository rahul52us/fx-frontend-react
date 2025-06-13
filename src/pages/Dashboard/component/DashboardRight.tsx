import { observer } from "mobx-react-lite";
import DashboardRecentNotification from "./DashboardRecentNotification";
import DashboardRightCard from "./DashboardRightCard";
import AddUserCard from "./AddUserCard";

const userData = [
  {
    id: 1,
    name: "John Doe",
    avatarSrc: "https://bit.ly/dan-abramov",
    access: "access",
  },
  {
    id: 2,
    name: "Kashish Systummmmm",
    avatarSrc: "https://bit.ly/dan-abramov",
    access: "access",
  },
  {
    id: 2,
    name: "Ayush Yadav",
    avatarSrc: "https://bit.ly/dan-abramov",
    access: "access",
  },
];

const DashboardRight = observer(() => {
  return (
    <div>
      <DashboardRecentNotification />
      <DashboardRightCard />
      <AddUserCard userData={userData} />
    </div>
  );
});

export default DashboardRight;
