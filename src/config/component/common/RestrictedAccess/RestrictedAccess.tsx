import { Box, Button, Flex, Icon, Text } from "@chakra-ui/react";
import { LockIcon } from "@chakra-ui/icons";
import React from "react";

interface RestrictedAccessProps {
    onBack?: () => void;
}

const RestrictedAccess: React.FC<RestrictedAccessProps> = ({
    onBack = () => window.history.back(),
}) => {
    return (
        <Flex minH="70vh" align="center" justify="center">
            <Box p={8} textAlign="center" w="100%">
                <Flex direction="column" align="center" gap={3}>
                    <Icon as={LockIcon} boxSize={10} color="gray.400" />

                    <Text fontSize="lg" fontWeight="semibold">
                        Restricted Access
                    </Text>

                    <Text fontSize="sm" color="gray.600">
                        This section isn’t available for your account yet. If you believe this
                        is a mistake, please contact support.
                    </Text>

                    <Button mt={3} size="sm" colorScheme="blue" onClick={onBack}>
                        Go Back
                    </Button>
                </Flex>
            </Box>
        </Flex>
    );
};

export default RestrictedAccess;
