import React from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import ManufacturerPanel from "./roles/ManufacturerPanel";
import DistributorPanel from "./roles/DistributorPanel";
import PlantPanel from "./roles/PlantPanel";
import MaintenancePanel from "./roles/MaintenancePanel";
import RepairPanel from "./roles/RepairPanel";
import AuditorPanel from "./roles/AuditorPanel";

const RoleTabs = () => (
  <Tabs variant="enclosed" mt={4}>
    <TabList>
      <Tab>Manufacturer</Tab>
      <Tab>Distributor</Tab>
      <Tab>Plant</Tab>
      <Tab>Maintenance</Tab>
      <Tab>Repair</Tab>
      <Tab>Auditor</Tab>
    </TabList>
    <TabPanels>
      <TabPanel>
        <ManufacturerPanel />
      </TabPanel>
      <TabPanel>
        <DistributorPanel />
      </TabPanel>
      <TabPanel>
        <PlantPanel />
      </TabPanel>
      <TabPanel>
        <MaintenancePanel />
      </TabPanel>
      <TabPanel>
        <RepairPanel />
      </TabPanel>
      <TabPanel>
        <AuditorPanel />
      </TabPanel>
    </TabPanels>
  </Tabs>
);

export default RoleTabs;
