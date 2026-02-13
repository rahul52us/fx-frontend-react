import { Select, useToast, Flex, Text, Box, Icon } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";
import { FiEye } from "react-icons/fi";
import store from "../../../../../store/store";

const AdminUserSelect = observer(() => {
    const {
        auth: { viewAsUserId, setViewAsUserId },
        User,
    } = store;

    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [localViewAsId, setLocalViewAsId] = useState("");
    const toast = useToast();

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await User.getUsersWithAuth({ search: "", role: "user" });
            const usersList = Array.isArray(response?.data)
                ? response.data
                : Array.isArray(response)
                    ? response
                    : [];

            const formattedData = usersList.map((user: any) => ({
                ...user,
                ...(user.basicDetails || {}),
                _id: user._id, // Explicitly preserve the root _id
            }));

            // console.log("Fetched Users:", formattedData);
            setUsers(formattedData);

            // Default select the first user if no user is selected
            if (!viewAsUserId && formattedData.length > 0) {
                // console.log("Setting default ViewAsUserId:", formattedData[0].userId);
                setViewAsUserId(formattedData[0].userId);
                setLocalViewAsId(formattedData[0].userId);
            } else if (
                viewAsUserId &&
                !formattedData.find((u: any) => u.userId === viewAsUserId) &&
                formattedData.length > 0
            ) {
                // console.log(
                //   "ViewAsUserId not in list, resetting to:",
                //   formattedData[0].userId
                // );
                setViewAsUserId(formattedData[0].userId);
                setLocalViewAsId(formattedData[0].userId);
            } else if (viewAsUserId) {
                setLocalViewAsId(viewAsUserId);
            }
        } catch (error: any) {
            console.error("Failed to fetch users", error);
            toast({
                title: "Error fetching users",
                description: error?.message || "Something went wrong",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (store.auth.user?.role === "admin") {
            fetchUsers();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (viewAsUserId) {
            setLocalViewAsId(viewAsUserId);
        }
    }, [viewAsUserId]);

    if (store.auth.user?.role !== "admin") return null;

    return (
        <Flex
            alignItems="center"
            bg="whiteAlpha.300"
            backdropFilter="blur(16px)"
            p={2}
            pl={4}
            borderRadius="xl"
            boxShadow="0 0 15px rgba(255, 255, 255, 0.15)"
            border="2px solid"
            borderColor="whiteAlpha.600"
            _hover={{
                boxShadow: "0 0 20px rgba(255, 255, 255, 0.25)",
                borderColor: "white",
                bg: "whiteAlpha.400",
                transform: "translateY(-1px)"
            }}
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        >
            <Flex alignItems="center" mr={3}>
                <Icon as={FiEye} color="white" mr={2} boxSize={4} />
                <Text
                    fontWeight="700"
                    color="white"
                    fontSize="sm"
                    letterSpacing="wider"
                    textTransform="uppercase"
                    textShadow="0 2px 4px rgba(0,0,0,0.2)"
                >
                    Select User
                </Text>
            </Flex>

            <Box position="relative">
                <Select
                    width="280px"
                    placeholder="Select User"
                    value={localViewAsId}
                    onChange={(e) => {
                        setLocalViewAsId(e.target.value);
                        setViewAsUserId(e.target.value);
                    }}
                    bg="blackAlpha.200"
                    size="sm"
                    variant="filled"
                    borderRadius="md"
                    height="36px"
                    fontSize="sm"
                    fontWeight="600"
                    color="white"
                    _hover={{ bg: "blackAlpha.300" }}
                    _focus={{
                        bg: "blackAlpha.400",
                        borderColor: "white",
                        boxShadow: "none"
                    }}
                    _placeholder={{ color: "whiteAlpha.800" }}
                    isDisabled={loading}
                    iconColor="white"
                    sx={{
                        "> option": {
                            background: "#2D3748",
                            color: "white",
                            fontWeight: "500"
                        },
                    }}
                >
                    {users.map((user: any) => (
                        <option key={user._id} value={user.userId}>
                            {user.basicDetails?.email ||
                                user.email ||
                                `${user.firstName} ${user.lastName}`}
                        </option>
                    ))}
                </Select>
            </Box>
        </Flex>
    );
});

export default AdminUserSelect;
