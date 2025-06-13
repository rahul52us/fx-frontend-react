import { observer } from "mobx-react-lite";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Box } from "@chakra-ui/react";
import HolidaysDetailTable from "../../../../Holidays/Holidays";
import WorkLocationDetails from "../../../../workLocation/WorkLocation";
import WorkTiming from "../../../../WorkTiming/WorkTiming";
import CompanyOtherPolicyData from "../../../../CompanyOtherPolicyData/CompanyOtherPolicyData";

const PolicyContainer = observer(({ selectedPolicy }: any) => {
  return (
    <Box width="100%">
      <Tabs
        justifyContent="space-between"
        variant="soft-rounded"
        colorScheme="teal"
      >
        <TabList>
          <Tab>Holidays</Tab>
          <Tab>Work Timings</Tab>
          <Tab>Work Locations</Tab>
          <Tab>Other</Tab>
        </TabList>

        <TabPanels>
          {/* Holidays Tab */}
          <TabPanel>
            <HolidaysDetailTable
              selectedPolicy={selectedPolicy?.data?._id}
              selectCompany={selectedPolicy?.data?.company}
            />
          </TabPanel>

          {/* Work Timings Tab */}
          <TabPanel>
            <WorkTiming
              selectedPolicy={selectedPolicy?.data?._id}
              selectCompany={selectedPolicy?.data?.company}
            />
          </TabPanel>

          {/* Work Locations Tab */}
          <TabPanel>
            <WorkLocationDetails
              selectedPolicy={selectedPolicy?.data?._id}
              selectCompany={selectedPolicy?.data?.company}
            />
          </TabPanel>

          {/* Other Tab */}
          <TabPanel>
            <CompanyOtherPolicyData
              selectedPolicy={selectedPolicy?.data?._id}
              selectCompany={selectedPolicy?.data?.company}
              initialValues={{
                gracePeriodMinutesEarly:
                  selectedPolicy?.data?.gracePeriodMinutesEarly,
                gracePeriodMinutesLate:
                  selectedPolicy?.data?.gracePeriodMinutesLate,
              }}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
});

export default PolicyContainer;
