import { useState } from "react";
import { SettingsLayout, ToggleItem } from "./SettingsLayout";

const TwoStep = () => {
  const [enabled, setEnabled] = useState(false);

  return (
    <SettingsLayout title="Two-step verification">

      <ToggleItem
        label="Enable Two-step verification"
        value={enabled}
        onChange={() => setEnabled(!enabled)}
      />

    </SettingsLayout>
  );
};

export default TwoStep;