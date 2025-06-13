import { observer } from "mobx-react-lite";
import store from "../../../../../../../store/store";
import React, { useEffect, useState, useCallback } from "react";
import { Box, Text } from "@chakra-ui/react";
import DrawerLoader from "../../../../../../../config/component/Loader/DrawerLoader";
import CustomDrawer from "../../../../../../../config/component/Drawer/CustomDrawer";
import PolicyContainer from "./PolicyContainer";

interface PolicyCompanyProps {
  data: {
    _id: string;
  };
}

const CompanyPolicies = observer(({ data }: PolicyCompanyProps) => {
  const [selectedPolicies, setSelectedPolicies] = useState({
    open: false,
    data: null,
  });
  const [policies, setPolicies] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const {
    company: { getPolicies },
  } = store;

  const fetchPolicies = useCallback(() => {
    if (data?._id) {
      setLoading(true);
      setError(null);
      getPolicies({ company: data._id })
        .then((response: any) => {
          setPolicies(response);
        })
        .catch(() => {
          setError("Failed to fetch policies");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [getPolicies, data]);

  useEffect(() => {
    fetchPolicies();
  }, [fetchPolicies]);

  if (loading) {
    return (
      <DrawerLoader loading={loading}>
        <></>
      </DrawerLoader>
    );
  }

  if (error) {
    return (
      <Box>
        <Text color="red.500" textAlign={"center"}>
          {error}
        </Text>
      </Box>
    );
  }

  return (
    <React.Fragment>
      <Box>
        {policies.length > 0 ? (
          policies.map((policy, index) => (
            <Box
              key={index}
              p={2}
              borderBottom="1px solid #eee"
              cursor="pointer"
              onClick={() => setSelectedPolicies({ open: true, data: policy })}
            >
              <Text fontWeight="500">{`Policy ${index + 1}: ${
                policy.title || "Unnamed Policy"
              }`}</Text>
            </Box>
          ))
        ) : (
          <Text textAlign="center" fontWeight="bold">
            No policies found for this company.
          </Text>
        )}
      </Box>
      <CustomDrawer
        open={selectedPolicies.open}
        close={() => setSelectedPolicies({ open: false, data: null })}
        width="95%"
      >
        <PolicyContainer selectedPolicy={selectedPolicies}/>
      </CustomDrawer>
    </React.Fragment>
  );
});

export default CompanyPolicies;