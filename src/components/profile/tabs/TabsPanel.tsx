import React from "react";
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel } from "@material-tailwind/react";
import UserInformation from "./UserInformation";
import { AdjustmentsHorizontalIcon, Bars3Icon, UserCircleIcon } from "@heroicons/react/16/solid";
import { SettingsTabsPanel } from "./SettingsTabsPanel";
import { DataProfileTabs } from "../../../interface/ParticipationTypes";


export function TabsPanel() {
  const [activeTab, setActiveTab] = React.useState<string>("tab1");
  const [activeAsider, setActiveAsider] = React.useState<boolean>(false); 


  const data:DataProfileTabs[] = [
    { label: "Profil", value: "tab1", component: <UserInformation />, icon: <UserCircleIcon className="h-6 w-6 text-gray-500" /> },
    { label: "Paramètres", value: "tab2", component: <SettingsTabsPanel />, icon: <AdjustmentsHorizontalIcon className="h-6 w-6 text-gray-500" /> },

  ];

  return (
    <Tabs orientation="vertical" value={activeTab} onChange={setActiveTab} className="relative flex sm:flex-row h-full min-h-72 rounded-t-4xl-">

      <span onClick={() => setActiveAsider(!activeAsider)} className="sm:hidden absolute top-4 z-50 left-4 bg-blue-gray-500 rounded-md p-2">
        <Bars3Icon className="h-6 w-6 text-white" />
      </span>
      {/*transform and transition for sliding effect */}
      <TabsHeader className={`sm:max-w-48 sm:min-w-fit w-56 bg-blue-gray-200 !opacity-100 pt-16 sm:pt-1 sm:rounded-es-4xl- sm:rounded-ee-none sm:rounded-t-none h-full
        ${activeAsider ? 'translate-x-0' : '-translate-x-[105%]'} 
        sm:translate-x-0 transform transition-transform duration-300 ease-in-out
        fixed sm:relative z-40 bg-opacity-100`}>

        {data.map(({ label, value, icon }) => (
          <Tab key={value} value={value} className="flex justify-start w-full h-auto py-2"
            onClick={() => {
              setActiveTab(value);
              if (window.innerWidth < 640) setActiveAsider(false);
            }}>
            <span className="flex gap-2">
              {icon}
              {label}
            </span>
          </Tab>
        ))}
      </TabsHeader>
      {/* overlay effect when asider is active */}
      <div className={`fixed inset-0 bg-black/50 z-30 sm:hidden ${activeAsider ? 'block' : 'hidden'}`}
        onClick={() => setActiveAsider(false)}></div>
      {/*brightness transition for body */}
      <TabsBody className={`flex-1 bg-blue-gray-50 rounded-ee-4xl- transition-all duration-300
        ${activeAsider ? 'brightness-75 sm:brightness-100' : 'brightness-100'}`}>
        {data.map(({ value, component }) => (
          <TabPanel key={value} value={value} className="m-0 p-0">
            {component}
          </TabPanel>
        ))}
      </TabsBody>
    </Tabs>
  );
}