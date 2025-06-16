import { useState } from "react";
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel } from "@material-tailwind/react";
import ChangePasswordForm from "../forms/ChangePassword.form";
import ChangeEmailForm from "../forms/ChangeEmail.form";
import DeleteAccountForm from "../forms/DeleteAccount.form";
import { DataProfileSettingTabs } from "../../../interface/ParticipationTypes";

export const SettingsTabsPanel = () => {
  const [activeTab, setActiveTab] = useState("tab1");

  const data:DataProfileSettingTabs[] = [
    { label: "Changer le mot de passe", value: "tab1", component: <ChangePasswordForm /> },
    { label: "Changer le mail", value: "tab2", component: <ChangeEmailForm /> },
    { label: "Supprimer le compte", value: "tab3", component: <DeleteAccountForm /> },
  ];

  return (
    <div className="p-4">
      <Tabs value={activeTab} onChange={setActiveTab} className="rounded-lg ">
        
        {/* Tabs Header - Vertical on Mobile, Horizontal on Desktop */}
        <TabsHeader className="flex flex-col sm:flex-row sm:w-auto w-full border-r sm:border-none bg-gray-100 p-2 rounded-lg">
          {data.map(({ label, value }) => (
            <Tab key={value} value={value} className="font-semibold px-4 py-2 sm:px-6 sm:py-3 w-full sm:w-auto text-center">
              {label}
            </Tab>
          ))}
        </TabsHeader>

        {/* Tabs Body */}
        <TabsBody className="flex-1 bg-white p-4">
          {data.map(({ value, component }) => (
            <TabPanel key={value} value={value}>
              {component}
            </TabPanel>
          ))}
        </TabsBody>

      </Tabs>
    </div>
  );
};
