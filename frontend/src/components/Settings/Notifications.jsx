import { useState } from "react";
import { SettingsLayout, ToggleItem } from "./SettingsLayout";

const Notifications = () => {
  const [sound, setSound] = useState(true);

  return (
    <SettingsLayout title="Notifications">

      <ToggleItem
        label="Message notifications"
        value={sound}
        onChange={() => setSound(!sound)}
      />

      <ToggleItem label="Group notifications" value={true} onChange={() => {}} />
      <ToggleItem label="Vibration" value={true} onChange={() => {}} />

    </SettingsLayout>
  );
};

export default Notifications;