import { Grid } from "@chakra-ui/react";
import React from "react";
import { IoPeopleSharp } from "react-icons/io5";
import { NewDashboardCard } from "../../../../NewDash/Cards/NewDashboardCard";

const cardColor = ["purple", "orange", "green", "red"];

const ManagerDashWidget = () => {
return (
    <Grid gap={4} templateColumns={"repeat(4, 1fr)"}>
    {[1, 2, 3, 4].map((item) => (
        <React.Fragment key={item}>
        <NewDashboardCard
            icon={<IoPeopleSharp fontSize="24px" />}
            value="1,475"
            label="No of Students"
            colorScheme={cardColor[item - 1]}
            bgColor={{
            light: `${cardColor[item - 1]}.100`,
            dark: "gray.700",
            }}
        />
        </React.Fragment>
    ))}
    </Grid>
);
};

export default ManagerDashWidget;