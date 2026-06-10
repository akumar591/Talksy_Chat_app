import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

import API from "../api/axios";
import toast from "react-hot-toast";
import { useChat } from "./ChatContext";

// ===============================
// 🔥 CONTEXT
// ===============================
const GroupContext = createContext();

// ===============================
// 🔥 PROVIDER
// ===============================
export const GroupProvider = ({ children }) => {
  // ===============================
  // 🔥 STATES
  // ===============================

  const { resetChatState } = useChat();

  const [groups, setGroups] = useState([]);

  const [selectedGroup, setSelectedGroup] = useState(null);

  const [groupDetails, setGroupDetails] = useState(null);

  const [loading, setLoading] = useState(false);

  const [groupMedia, setGroupMedia] = useState([]);

  const [hasFetchedGroups, setHasFetchedGroups] = useState(false);

  // ===============================
  // 🔥 GET CURRENT USER
  // ===============================
  const getCurrentUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      return Number(user?.id);
    } catch {
      return null;
    }
  };

  // ===============================
  // 🔥 MAP GROUP
  // ===============================
  const mapGroup = useCallback((group) => {
    const currentUserId = getCurrentUserId();

    const members = group.members || [];

    const currentMember = members.find(
      (m) => Number(m.userId) === Number(currentUserId),
    );

    const isCreator = Number(group.createdById) === Number(currentUserId);

    return {
      // ===============================
      // 🔥 BASIC
      // ===============================
      id: group.id,

      name: group.name || "Group",

      about: group.about || "",

      avatar: group.avatar || "",

      // ===============================
      // 🔥 CHAT
      // ===============================
      isGroup: true,

      conversationId: group.conversationId || null,

      // ===============================
      // 🔥 CREATOR
      // ===============================
      createdById: group.createdById,

      createdByName: group.createdByName || "",

      createdByAvatar: group.createdByAvatar || "",

      // ===============================
      // 🔥 MEMBERS
      // ===============================
      members,

      memberCount: group.memberCount || members.length || 0,

      // ===============================
      // 🔥 CURRENT USER ROLE
      // ===============================
      isCreator,

      isAdmin: isCreator || currentMember?.role === "ADMIN",

      myRole: isCreator ? "CREATOR" : currentMember?.role || "MEMBER",

      // ===============================
      // 🔥 UI
      // ===============================
      online: false,

      unreadCount: group.unreadCount || 0,

      lastMessage: group.lastMessage || "",

      lastMessageTime: group.lastMessageTime || null,

      // ===============================
      // 🔥 TIME
      // ===============================
      createdAt: group.createdAt || null,
    };
  }, []);

  // ===============================
  // 🔥 SORT GROUPS
  // ===============================
  const sortGroups = useCallback((list) => {
    return [...list].sort((a, b) => {
      if (!a.lastMessageTime) return 1;

      if (!b.lastMessageTime) return -1;

      return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
    });
  }, []);

  // ===============================
  // 🔥 FETCH GROUPS
  // ===============================
  const fetchGroups = async (force = false) => {
    if (!force && hasFetchedGroups && groups.length > 0) {
      return;
    }
    try {
      setLoading(true);

      const res = await API.get("/groups/my");

      const data = res?.data?.data || [];

      const mapped = data.map(mapGroup);

      setGroups(sortGroups(mapped));

      setHasFetchedGroups(true);
    } catch (error) {
      console.log(error);

      // 🔥 IGNORE AUTH ERRORS
      if (error?.response?.status === 401 || error?.response?.status === 400) {
        return;
      }

      toast.error("Failed to load groups");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // 🔥 FETCH SINGLE GROUP
  // ===============================
  const fetchGroupById = useCallback(
    async (groupId) => {
      try {
        setLoading(true);

        const res = await API.get(`/groups/${groupId}`);

        const data = res?.data?.data;

        if (!data) {
          return null;
        }

        const mapped = mapGroup(data);

        setGroupDetails(mapped);

        // 🔥 UPDATE ACTIVE GROUP
        setSelectedGroup((prev) =>
          prev?.id === groupId
            ? {
                ...prev,
                ...mapped,
              }
            : prev,
        );

        // 🔥 UPDATE SIDEBAR
        setGroups((prev) =>
          prev.map((g) =>
            g.id === groupId
              ? {
                  ...g,
                  ...mapped,
                }
              : g,
          ),
        );

        return mapped;
      } catch (error) {
        console.log(error);

        if (
          error?.response?.status !== 400 &&
          error?.response?.status !== 404
        ) {
          toast.error("Failed to fetch group");
        }

        return null;
      } finally {
        setLoading(false);
      }
    },
    [mapGroup],
  );

  // ===============================
  // 🔥 CREATE GROUP
  // ===============================
  const createGroup = useCallback(
    async (payload) => {
      try {
        const res = await API.post("/groups/create", payload);

        await fetchGroups();

        return {
          success: true,

          data: res?.data?.data,
        };
      } catch (error) {
        console.log(error);

        return {
          success: false,

          message: error?.response?.data?.message || "Failed to create group",
        };
      }
    },
    [fetchGroups],
  );

  // ===============================
  // 🔥 UPDATE GROUP
  // ===============================
  const updateGroup = useCallback(
    async (groupId, payload) => {
      try {
        const res = await API.put(
          `/groups/${groupId}`,

          payload,
        );

        const updated = mapGroup(res?.data?.data);

        // 🔥 UPDATE GROUPS
        setGroups((prev) =>
          prev.map((g) =>
            g.id === groupId
              ? {
                  ...g,
                  ...updated,
                }
              : g,
          ),
        );

        // 🔥 UPDATE DETAILS
        setGroupDetails(updated);

        // 🔥 UPDATE SELECTED
        setSelectedGroup((prev) =>
          prev?.id === groupId
            ? {
                ...prev,
                ...updated,
              }
            : prev,
        );

        return {
          success: true,

          data: updated,
        };
      } catch (error) {
        console.log(error);

        return {
          success: false,

          message: error?.response?.data?.message || "Failed to update group",
        };
      }
    },
    [mapGroup],
  );

  // ===============================
  // 🔥 ADD MEMBER
  // ===============================
  const addMember = useCallback(
    async (groupId, memberId) => {
      try {
        await API.post(`/groups/${groupId}/add-member/${memberId}`);

        const updated = await fetchGroupById(groupId);

        return {
          success: true,
          data: updated,
        };
      } catch (error) {
        console.log(error);

        return {
          success: false,

          message: error?.response?.data?.message || "Failed to add member",
        };
      }
    },
    [fetchGroupById],
  );

  // ===============================
  // 🔥 REMOVE MEMBER
  // ===============================
  const removeMember = useCallback(
    async (groupId, memberId) => {
      try {
        await API.delete(`/groups/${groupId}/remove-member/${memberId}`);

        const updated = await fetchGroupById(groupId);

        return {
          success: true,
          data: updated,
        };
      } catch (error) {
        console.log(error);

        return {
          success: false,

          message: error?.response?.data?.message || "Failed to remove member",
        };
      }
    },
    [fetchGroupById],
  );

  // ===============================
  // 🔥 MAKE ADMIN
  // ===============================
  const makeAdmin = useCallback(
    async (groupId, memberId) => {
      try {
        await API.put(`/groups/${groupId}/make-admin/${memberId}`);

        const updated = await fetchGroupById(groupId);

        return {
          success: true,
          data: updated,
        };
      } catch (error) {
        console.log(error);

        return {
          success: false,

          message: error?.response?.data?.message || "Failed to make admin",
        };
      }
    },
    [fetchGroupById],
  );

  // ===============================
  // 🔥 REMOVE ADMIN
  // ===============================
  const removeAdmin = useCallback(
    async (groupId, memberId) => {
      try {
        await API.put(`/groups/${groupId}/remove-admin/${memberId}`);

        const updated = await fetchGroupById(groupId);

        return {
          success: true,
          data: updated,
        };
      } catch (error) {
        console.log(error);

        return {
          success: false,

          message: error?.response?.data?.message || "Failed to remove admin",
        };
      }
    },
    [fetchGroupById],
  );

  // ===============================
  // 🔥 LEAVE GROUP
  // ===============================
  const leaveGroup = useCallback(
    async (groupId) => {
      try {
        await API.delete(`/groups/${groupId}/leave`);

        // 🔥 REMOVE GROUP
        setGroups((prev) => prev.filter((g) => g.id !== groupId));

        // 🔥 RESET ACTIVE
        if (selectedGroup?.id === groupId) {
          // 🔥 RESET GROUP
          setSelectedGroup(null);

          setGroupDetails(null);

          // 🔥 RESET CHAT
          resetChatState();

          // 🔥 REMOVE STORAGE
          localStorage.removeItem("activeChat");
        }

        toast.success("Left group");

        return {
          success: true,
        };
      } catch (error) {
        console.log(error);

        return {
          success: false,

          message: error?.response?.data?.message || "Failed to leave group",
        };
      }
    },
    [selectedGroup],
  );

  // ===============================
  // 🔥 DELETE GROUP
  // ===============================
  const deleteGroup = useCallback(
    async (groupId) => {
      try {

        await API.delete(`/groups/${groupId}`);

        // 🔥 REMOVE GROUP
        setGroups((prev) => prev.filter((g) => g.id !== groupId));

        // 🔥 RESET ACTIVE
        if (selectedGroup?.id === groupId) {
          setSelectedGroup(null);

          setGroupDetails(null);

          localStorage.removeItem("activeChat");
        }

        toast.success("Group deleted");

        return {
          success: true,
        };
      } catch (error) {
        console.log(error);

        return {
          success: false,

          message: error?.response?.data?.message || "Failed to delete group",
        };
      }
    },
    [selectedGroup],
  );

  // ===============================
  // 🔥 FETCH GROUP MEDIA
  // ===============================
  const fetchGroupMedia = useCallback(async (conversationId) => {
    try {
      if (!conversationId) {
        setGroupMedia([]);

        return [];
      }

      const res = await API.get(`/messages/media/${conversationId}`);

      const media = res?.data?.data || [];

      setGroupMedia(media);

      return media;
    } catch (error) {
      console.log(error);

      setGroupMedia([]);

      return [];
    }
  }, []);

  // ===============================
  // 🔥 REFRESH GROUP
  // ===============================
  const refreshGroup = useCallback(
    async (groupId) => {
      if (!groupId) return null;

      return await fetchGroupById(groupId);
    },
    [fetchGroupById],
  );

  // ===============================
  // 🔥 AUTO FETCH
  // ===============================
  useEffect(() => {
    if (hasFetchedGroups) {
      return;
    }

    fetchGroups();
  }, [hasFetchedGroups]);

  // ===============================
  // 🔥 VALUE
  // ===============================
  const value = {
    // 🔥 STATES
    groups,
    setGroups,

    selectedGroup,
    setSelectedGroup,

    groupDetails,
    setGroupDetails,

    loading,

    groupMedia,
    setGroupMedia,

    // 🔥 METHODS
    fetchGroups,
    setHasFetchedGroups,
    fetchGroupById,

    createGroup,
    updateGroup,

    addMember,
    removeMember,

    makeAdmin,
    removeAdmin,

    leaveGroup,
    deleteGroup,

    refreshGroup,
    fetchGroupMedia,
  };

  return (
    <GroupContext.Provider value={value}>{children}</GroupContext.Provider>
  );
};

// ===============================
// 🔥 HOOK
// ===============================
export const useGroup = () => {
  return useContext(GroupContext);
};
