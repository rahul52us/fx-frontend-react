import { observer } from "mobx-react-lite";
import WorkTimingForm from "./component/WorkTimingForm";

const WorkTiming = observer(({selectedPolicy, selectCompany} : any) => {
  return <WorkTimingForm selectedPolicy={selectedPolicy} selectCompany={selectCompany}/>;
});

export default WorkTiming;