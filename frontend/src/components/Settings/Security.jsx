import { useState } from "react";
import { SettingsLayout, ToggleItem } from "./SettingsLayout";

const Security = () => {
  const [lock, setLock] = useState(false);

  return (
    <SettingsLayout title="Security">

      <ToggleItem
        label="App lock"
        value={lock}
        onChange={() => setLock(!lock)}
      />

      <ToggleItem label="Fingerprint lock" value={false} onChange={() => {}} />

    </SettingsLayout>
  );
};

export default Security;