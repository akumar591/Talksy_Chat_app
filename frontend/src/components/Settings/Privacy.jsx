import { useState } from "react";
import { SettingsLayout, SettingItem, ToggleItem } from "./SettingsLayout";

const Privacy = () => {
  const [readReceipts, setReadReceipts] = useState(true);

  return (
    <SettingsLayout title="Privacy">

      <SettingItem label="Last seen & online" value="Everyone" />
      <SettingItem label="Profile photo" value="My contacts" />
      <SettingItem label="About" value="Everyone" />
      <SettingItem label="Status" value="My contacts" />

      <ToggleItem
        label="Read receipts"
        value={readReceipts}
        onChange={() => setReadReceipts(!readReceipts)}
      />

      <SettingItem label="Blocked contacts" value="2 contacts" />

    </SettingsLayout>
  );
};

export default Privacy;