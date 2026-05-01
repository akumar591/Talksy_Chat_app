import { useState } from "react";
import { SettingsLayout, SettingItem, ToggleItem } from "./SettingsLayout";

const ChatsSettings = () => {
  const [enterSend, setEnterSend] = useState(true);

  return (
    <SettingsLayout title="Chats">

      <SettingItem label="Theme" value="Dark" />
      <SettingItem label="Wallpaper" value="Default" />

      <ToggleItem
        label="Enter is send"
        value={enterSend}
        onChange={() => setEnterSend(!enterSend)}
      />

    </SettingsLayout>
  );
};

export default ChatsSettings;