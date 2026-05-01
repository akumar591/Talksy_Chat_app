import { useState } from "react";
import { SettingsLayout } from "./SettingsLayout";

const ChangeNumber = () => {
  const [oldNumber, setOldNumber] = useState("");
  const [newNumber, setNewNumber] = useState("");

  const handleSubmit = () => {
    if (!oldNumber || !newNumber) {
      alert("Please fill both fields");
      return;
    }

    alert("Number updated successfully ✅");
  };

  return (
    <SettingsLayout title="Change number">

      {/* 🔥 CENTER CONTENT LIKE SETTINGS */}
      <div className="max-w-xl mx-auto w-full space-y-3">

        <div className="bg-[var(--card)] p-4 rounded-xl space-y-3">

          <input
            type="text"
            placeholder="Old phone number"
            value={oldNumber}
            onChange={(e) => setOldNumber(e.target.value)}
            className="w-full p-3 rounded-lg bg-transparent border border-[var(--border)] outline-none"
          />

          <input
            type="text"
            placeholder="New phone number"
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
            className="w-full p-3 rounded-lg bg-transparent border border-[var(--border)] outline-none"
          />

          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-[var(--primary)] text-black rounded-lg mt-2 font-medium"
          >
            Update Number
          </button>

        </div>

      </div>

    </SettingsLayout>
  );
};

export default ChangeNumber;