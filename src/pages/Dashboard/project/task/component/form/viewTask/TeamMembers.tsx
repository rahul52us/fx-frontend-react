import { useColorModeValue } from "@chakra-ui/react";
import ParticipantCard from "../../../../../../../config/component/common/showParticipants/ShowParticipantCard";

const TeamMember = ({ member }: { member: any }) => {

  const cardHoverBgColor = useColorModeValue("gray.100", "gray.600");
  const textColor = useColorModeValue("gray.700", "gray.300");

  return (
    <ParticipantCard participant={member} textColor={textColor} boxHoverBg={cardHoverBgColor} />
  );
};

export default TeamMember;