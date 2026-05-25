import { FiAlertTriangle } from "react-icons/fi";

// ===============================
// 🔥 COMPONENT
// ===============================
const ConfirmModal = ({
  open,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = false,
  loading = false,
  onConfirm,
  onClose,
}) => {

  if (!open) return null;

  return (

    <div
      className="
        fixed
        inset-0
        z-[9999]

        bg-black/60
        backdrop-blur-sm

        flex
        items-center
        justify-center

        p-4
      "
    >

      {/* MODAL */}
      <div
        className="
          w-full
          max-w-sm

          rounded-3xl

          bg-[var(--card)]

          border
          border-[var(--border)]

          shadow-2xl

          overflow-hidden
        "
      >

        {/* TOP */}
        <div
          className="
            px-6
            pt-6
            flex
            flex-col
            items-center
            text-center
          "
        >

          {/* ICON */}
          <div
            className={`
              w-16
              h-16

              rounded-full

              flex
              items-center
              justify-center

              mb-4

              ${
                danger
                  ? "bg-red-500/15 text-red-400"
                  : "bg-[var(--primary)]/15 text-[var(--primary)]"
              }
            `}
          >

            <FiAlertTriangle className="text-3xl" />

          </div>

          {/* TITLE */}
          <h2
            className="
              text-xl
              font-semibold
            "
          >
            {title}
          </h2>

          {/* MESSAGE */}
          <p
            className="
              mt-2

              text-sm
              opacity-70

              leading-relaxed
            "
          >
            {message}
          </p>

        </div>

        {/* ACTIONS */}
        <div
          className="
            flex
            gap-3

            p-5
            mt-4
          "
        >

          {/* CANCEL */}
          <button
            onClick={onClose}
            disabled={loading}
            className="
              flex-1

              py-3

              rounded-2xl

              border
              border-[var(--border)]

              hover:bg-white/5

              transition
            "
          >
            {cancelText}
          </button>

          {/* CONFIRM */}
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`
              flex-1

              py-3

              rounded-2xl

              font-medium

              transition

              ${
                danger
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-[var(--primary)] text-black"
              }

              disabled:opacity-50
            `}
          >

            {loading
              ? "Please wait..."
              : confirmText}

          </button>

        </div>

      </div>

    </div>
  );
};

export default ConfirmModal;