import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import API from "../api/axios";

// ===============================
// 🔥 CONTEXT
// ===============================
const GroupContext =
  createContext();

// ===============================
// 🔥 PROVIDER
// ===============================
export const GroupProvider = ({
  children,
}) => {

  // ===============================
  // 🔥 STATES
  // ===============================
  const [groups, setGroups] =
    useState([]);

  const [
    selectedGroup,
    setSelectedGroup,
  ] = useState(null);

  const [
    groupDetails,
    setGroupDetails,
  ] = useState(null);

  const [loading, setLoading] =
    useState(false);

  // ===============================
  // 🔥 FETCH MY GROUPS
  // ===============================
  const fetchGroups =
    async () => {

      try {

        setLoading(true);

        const res =
          await API.get(
            "/groups/my"
          );

        // 🔥 support both formats
        const data =
          res.data?.data ||
          res.data ||
          [];

        // 🔥 map groups
        const mapped =
          data.map((group) => ({

            id: group.id,

            name:
              group.name || "Group",

            about:
              group.about || "",

            avatar:
              group.avatar || "",

            // 🔥 IMPORTANT
            conversationId:
              group.conversationId,

            createdById:
              group.createdById,

            createdByName:
              group.createdByName,

            createdByAvatar:
              group.createdByAvatar,

            members:
              group.members || [],

            memberCount:
              group.memberCount || 0,

            createdAt:
              group.createdAt,

            // 🔥 NEW
            isGroup: true,
          }));

        setGroups(mapped);

      } catch (error) {

        console.error(
          "Fetch groups error:",
          error
        );

      } finally {

        setLoading(false);
      }
    };

  // ===============================
  // 🔥 FETCH GROUP DETAILS
  // ===============================
  const fetchGroupById =
    async (groupId) => {

      try {

        setLoading(true);

        const res =
          await API.get(
            `/groups/${groupId}`
          );

        const data =
          res.data?.data ||
          res.data;

        setGroupDetails(
          data
        );

        return data;

      } catch (error) {

        console.error(
          "Fetch group error:",
          error
        );

      } finally {

        setLoading(false);
      }
    };

  // ===============================
  // 🔥 CREATE GROUP
  // ===============================
  const createGroup =
    async (groupData) => {

      try {

        const res =
          await API.post(
            "/groups/create",
            groupData
          );

        // 🔥 refresh groups
        await fetchGroups();

        return {
          success: true,
          data:
            res.data?.data ||
            res.data,
        };

      } catch (error) {

        console.error(
          "Create group error:",
          error
        );

        return {
          success: false,
          message:
            error.response?.data
              ?.message ||
            "Failed to create group",
        };
      }
    };

  // ===============================
  // 🔥 UPDATE GROUP
  // ===============================
  const updateGroup =
    async (
      groupId,
      payload
    ) => {

      try {

        const res =
          await API.put(
            `/groups/${groupId}`,
            payload
          );

        // 🔥 refresh details
        await fetchGroupById(
          groupId
        );

        // 🔥 refresh sidebar
        await fetchGroups();

        return {
          success: true,
          data:
            res.data?.data ||
            res.data,
        };

      } catch (error) {

        console.error(
          "Update group error:",
          error
        );

        return {
          success: false,
          message:
            error.response?.data
              ?.message ||
            "Failed to update group",
        };
      }
    };

  // ===============================
  // 🔥 ADD MEMBER
  // ===============================
  const addMember =
    async (
      groupId,
      memberId
    ) => {

      try {

        await API.post(
          `/groups/${groupId}/add-member/${memberId}`
        );

        await fetchGroupById(
          groupId
        );

        await fetchGroups();

        return {
          success: true,
        };

      } catch (error) {

        console.error(
          "Add member error:",
          error
        );

        return {
          success: false,
          message:
            error.response?.data
              ?.message ||
            "Failed to add member",
        };
      }
    };

  // ===============================
  // 🔥 REMOVE MEMBER
  // ===============================
  const removeMember =
    async (
      groupId,
      memberId
    ) => {

      try {

        await API.delete(
          `/groups/${groupId}/remove-member/${memberId}`
        );

        await fetchGroupById(
          groupId
        );

        await fetchGroups();

        return {
          success: true,
        };

      } catch (error) {

        console.error(
          "Remove member error:",
          error
        );

        return {
          success: false,
          message:
            error.response?.data
              ?.message ||
            "Failed to remove member",
        };
      }
    };

  // ===============================
  // 🔥 MAKE ADMIN
  // ===============================
  const makeAdmin =
    async (
      groupId,
      memberId
    ) => {

      try {

        await API.put(
          `/groups/${groupId}/make-admin/${memberId}`
        );

        await fetchGroupById(
          groupId
        );

        return {
          success: true,
        };

      } catch (error) {

        console.error(
          "Make admin error:",
          error
        );

        return {
          success: false,
          message:
            error.response?.data
              ?.message ||
            "Failed to make admin",
        };
      }
    };

  // ===============================
  // 🔥 REMOVE ADMIN
  // ===============================
  const removeAdmin =
    async (
      groupId,
      memberId
    ) => {

      try {

        await API.put(
          `/groups/${groupId}/remove-admin/${memberId}`
        );

        await fetchGroupById(
          groupId
        );

        return {
          success: true,
        };

      } catch (error) {

        console.error(
          "Remove admin error:",
          error
        );

        return {
          success: false,
          message:
            error.response?.data
              ?.message ||
            "Failed to remove admin",
        };
      }
    };

  // ===============================
  // 🔥 LEAVE GROUP
  // ===============================
  const leaveGroup =
    async (groupId) => {

      try {

        await API.delete(
          `/groups/${groupId}/leave`
        );

        // 🔥 remove local state
        setGroups((prev) =>
          prev.filter(
            (g) =>
              g.id !== groupId
          )
        );

        setSelectedGroup(null);

        setGroupDetails(null);

        return {
          success: true,
        };

      } catch (error) {

        console.error(
          "Leave group error:",
          error
        );

        return {
          success: false,
          message:
            error.response?.data
              ?.message ||
            "Failed to leave group",
        };
      }
    };

  // ===============================
  // 🔥 DELETE GROUP
  // ===============================
  const deleteGroup =
    async (groupId) => {

      try {

        await API.delete(
          `/groups/${groupId}`
        );

        // 🔥 remove local state
        setGroups((prev) =>
          prev.filter(
            (g) =>
              g.id !== groupId
          )
        );

        setSelectedGroup(null);

        setGroupDetails(null);

        return {
          success: true,
        };

      } catch (error) {

        console.error(
          "Delete group error:",
          error
        );

        return {
          success: false,
          message:
            error.response?.data
              ?.message ||
            "Failed to delete group",
        };
      }
    };

  // ===============================
  // 🔥 AUTO FETCH GROUPS
  // ===============================
  useEffect(() => {

    fetchGroups();

  }, []);

  // ===============================
  // 🔥 VALUE
  // ===============================
  const value = {

    // 🔥 states
    groups,
    setGroups,

    selectedGroup,
    setSelectedGroup,

    groupDetails,
    setGroupDetails,

    loading,

    // 🔥 methods
    fetchGroups,
    fetchGroupById,

    createGroup,
    updateGroup,

    addMember,
    removeMember,

    makeAdmin,
    removeAdmin,

    leaveGroup,
    deleteGroup,
  };

  return (
    <GroupContext.Provider
      value={value}
    >
      {children}
    </GroupContext.Provider>
  );
};

// ===============================
// 🔥 CUSTOM HOOK
// ===============================
export const useGroup =
  () => {

    return useContext(
      GroupContext
    );
  };