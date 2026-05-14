import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";

import API from "../api/axios";

import toast from "react-hot-toast";

// ===============================
// 🔥 CONTEXT
// ===============================
const StatusContext = createContext();

// ===============================
// 🔥 PROVIDER
// ===============================
export const StatusProvider = ({
  children,
}) => {

  // ===============================
  // 🔥 STATES
  // ===============================
  const [
    feedStatuses,
    setFeedStatuses,
  ] = useState([]);

  const [
    myStatuses,
    setMyStatuses,
  ] = useState([]);

  const [
    selectedStatus,
    setSelectedStatus,
  ] = useState(null);

  const [loading, setLoading] =
    useState(false);

  const [
    uploading,
    setUploading,
  ] = useState(false);

  // ===============================
  // 🔥 LOCKS
  // ===============================
  const feedLock =
    useRef(false);

  const myStatusLock =
    useRef(false);

  const uploadLock =
    useRef(false);

  // ===============================
  // 🔥 FORMAT STATUS
  // ===============================
  const formatStatus =
    useCallback((status) => {

      if (!status) return null;

      return {

        id: status.id,

        userId:
          status.userId,

        name:
          status.name ||
          "Unknown",

        avatar:
          status.avatar ||
          "",

        media:
          status.media ||
          status.mediaUrl ||
          "",

        type:
          status.type ||
          "IMAGE",

        caption:
          status.caption ||
          "",

        seen:
          status.seen ||
          false,

        views:
          status.views ||
          [],

        time:
          status.time ||
          "Just now",

        createdAt:
          status.createdAt ||
          null,
      };
    }, []);

  // ===============================
  // 🔥 FETCH FEED
  // ===============================
  const fetchFeedStatuses =
    useCallback(async () => {

      try {

        if (
          feedLock.current
        ) {
          return;
        }

        feedLock.current =
          true;

        setLoading(true);

        const res =
          await API.get(
            "/status/feed"
          );

        const data =
          res?.data?.data ||
          [];

        const mapped =
          data.map(
            formatStatus
          );

        setFeedStatuses(
          mapped
        );

        return mapped;

      } catch (err) {

        console.log(err);

        toast.error(
          "Failed to load statuses"
        );

        return [];

      } finally {

        feedLock.current =
          false;

        setLoading(false);
      }
    }, [formatStatus]);

  // ===============================
  // 🔥 FETCH MY STATUS
  // ===============================
  const fetchMyStatuses =
    useCallback(async () => {

      try {

        if (
          myStatusLock.current
        ) {
          return;
        }

        myStatusLock.current =
          true;

        const res =
          await API.get(
            "/status/my"
          );

        const data =
          res?.data?.data ||
          [];

        const mapped =
          data.map(
            formatStatus
          );

        setMyStatuses(
          mapped
        );

        return mapped;

      } catch (err) {

        console.log(err);

        return [];

      } finally {

        myStatusLock.current =
          false;
      }
    }, [formatStatus]);

  // ===============================
  // 🔥 UPLOAD FILE
  // ===============================
  const uploadStatusFile =
    useCallback(async (
      file
    ) => {

      try {

        if (
          !file ||
          uploadLock.current
        ) {

          return null;
        }

        uploadLock.current =
          true;

        setUploading(true);

        const formData =
          new FormData();

        formData.append(
          "file",
          file
        );

        formData.append(
          "type",
          "status"
        );

        const res =
          await API.post(
            "/file/upload",
            formData,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        const uploaded =
          res?.data?.data;

        if (!uploaded?.url) {

          throw new Error(
            "Upload failed"
          );
        }

        return uploaded;

      } catch (err) {

        console.log(err);

        toast.error(
          "Upload failed"
        );

        return null;

      } finally {

        uploadLock.current =
          false;

        setUploading(false);
      }
    }, []);

  // ===============================
  // 🔥 CREATE STATUS
  // ===============================
  const createStatus =
    useCallback(async ({
      file = null,
      caption = "",
      type = "TEXT",
    }) => {

      try {

        setUploading(true);

        let mediaUrl = "";

        let finalType = type;

        // ===============================
        // 🔥 FILE UPLOAD
        // ===============================
        if (file) {

          const uploaded =
            await uploadStatusFile(
              file
            );

          if (!uploaded) {

            throw new Error(
              "Upload failed"
            );
          }

          mediaUrl =
            uploaded.url;

          finalType =
            uploaded.type;
        }

        // ===============================
        // 🔥 CREATE API
        // ===============================
        const payload = {

          mediaUrl,

          caption,

          type: finalType,
        };

        const res =
          await API.post(
            "/status/create",
            payload
          );

        const newStatus =
          formatStatus(
            res?.data?.data
          );

        if (!newStatus) {

          throw new Error(
            "Status creation failed"
          );
        }

        // ===============================
        // 🔥 UPDATE LOCAL STATE
        // ===============================
        setMyStatuses(
          (prev) => [

            newStatus,

            ...prev,
          ]
        );

        setFeedStatuses(
          (prev) => [

            newStatus,

            ...prev,
          ]
        );

        toast.success(
          "Status uploaded ✅"
        );

        return {
          success: true,
          data: newStatus,
        };

      } catch (err) {

        console.log(err);

        toast.error(
          "Failed to create status"
        );

        return {
          success: false,
          message:
            err?.response?.data
              ?.message ||
            "Failed to create status",
        };

      } finally {

        setUploading(false);
      }
    }, [
      uploadStatusFile,
      formatStatus,
    ]);

  // ===============================
  // 🔥 MARK VIEWED
  // ===============================
  const markViewed =
    useCallback(async (
      statusId
    ) => {

      try {

        if (!statusId)
          return;

        await API.post(
          `/status/view/${statusId}`
        );

        // 🔥 LOCAL UPDATE
        setFeedStatuses(
          (prev) =>
            prev.map((s) =>

              s.id === statusId

                ? {
                  ...s,
                  seen: true,
                }

                : s
            )
        );

      } catch (err) {

        console.log(err);
      }
    }, []);

  // ===============================
  // 🔥 GET STATUS VIEWERS
  // ===============================
  const getStatusViewers =
    useCallback(async (
      statusId
    ) => {

      try {

        const res =
          await API.get(
            `/status/viewers/${statusId}`
          );

        return (
          res?.data?.data || []
        );

      } catch (err) {

        console.log(err);

        toast.error(
          "Failed to load viewers"
        );

        return [];
      }

    }, []);

  // ===============================
  // 🔥 DELETE STATUS
  // ===============================
  const deleteStatus =
    useCallback(async (
      statusId
    ) => {

      try {

        await API.delete(
          `/status/${statusId}`
        );

        setMyStatuses(
          (prev) =>
            prev.filter(
              (s) =>
                s.id !==
                statusId
            )
        );

        setFeedStatuses(
          (prev) =>
            prev.filter(
              (s) =>
                s.id !==
                statusId
            )
        );

        toast.success(
          "Status deleted"
        );

        return true;

      } catch (err) {

        console.log(err);

        toast.error(
          "Failed to delete status"
        );

        return false;
      }
    }, []);

  // ===============================
  // 🔥 REACT TO STATUS
  // ===============================
  const reactToStatus =
    useCallback(async (
      statusId,
      reaction,
      statusData
    ) => {

      try {

        if (
          !statusId ||
          !reaction
        ) {

          return false;
        }

        await API.post(
          `/status/react/${statusId}`,
          {
            reaction,

            // 🔥 IMPORTANT
            statusMedia:
              statusData?.media || "",

            statusType:
              statusData?.type || "",

            statusCaption:
              statusData?.caption || "",
          }
        );

        toast.success(
          "Reaction sent 🔥"
        );

        return true;

      } catch (err) {

        console.log(err);

        toast.error(
          "Failed to react"
        );

        return false;
      }
    }, []);

  // ===============================
  // 🔥 REPLY TO STATUS
  // ===============================
  const replyToStatus =
    useCallback(async (
      statusId,
      reply,
      statusData
    ) => {

      try {

        if (
          !statusId ||
          !reply?.trim()
        ) {

          return false;
        }

        await API.post(
          `/status/reply/${statusId}`,
          {
            reply,

            // 🔥 IMPORTANT
            statusMedia:
              statusData?.media || "",

            statusType:
              statusData?.type || "",

            statusCaption:
              statusData?.caption || "",
          }
        );

        toast.success(
          "Reply sent 🔥"
        );

        return true;

      } catch (err) {

        console.log(err);

        toast.error(
          "Failed to send reply"
        );

        return false;
      }
    }, []);

  // ===============================
  // 🔥 RESET
  // ===============================
  const resetStatusState =
    () => {

      setFeedStatuses([]);

      setMyStatuses([]);

      setSelectedStatus(
        null
      );
    };

  // ===============================
  // 🔥 VALUE
  // ===============================
  const value = {

    // 🔥 states
    feedStatuses,
    myStatuses,
    selectedStatus,

    loading,
    uploading,

    // 🔥 setters
    setFeedStatuses,
    setMyStatuses,
    setSelectedStatus,

    // 🔥 methods
    fetchFeedStatuses,
    fetchMyStatuses,

    createStatus,
    uploadStatusFile,

    markViewed,

    // 🔥 VIEWERS
    getStatusViewers,

    // 🔥 DELETE
    deleteStatus,

    // 🔥 STATUS REACTION + REPLY
    reactToStatus,
    replyToStatus,

    // 🔥 RESET
    resetStatusState,
  };

  return (

    <StatusContext.Provider
      value={value}
    >

      {children}

    </StatusContext.Provider>
  );
};

// ===============================
// 🔥 CUSTOM HOOK
// ===============================
export const useStatus =
  () => {

    return useContext(
      StatusContext
    );
  };