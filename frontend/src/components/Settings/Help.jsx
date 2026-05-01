import { SettingsLayout } from "./SettingsLayout";

const Help = () => {
  return (
    <SettingsLayout title="Help center">

      <div className="p-4 bg-[var(--card)] rounded-xl">
        <p className="text-sm">Need help?</p>
        <p className="text-xs opacity-60 mt-1">
          Contact support@chatapp.com
        </p>
      </div>

    </SettingsLayout>
  );
};

export default Help;