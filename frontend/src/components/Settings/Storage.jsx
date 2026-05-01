import { SettingsLayout, SettingItem, ToggleItem } from "./SettingsLayout";

const Storage = () => {
  return (
    <SettingsLayout title="Storage and data">

      <SettingItem label="Manage storage" value="2.3 GB used" />
      <SettingItem label="Network usage" value="1.1 GB" />

      <ToggleItem label="Use less data for calls" value={false} onChange={() => {}} />

    </SettingsLayout>
  );
};

export default Storage;