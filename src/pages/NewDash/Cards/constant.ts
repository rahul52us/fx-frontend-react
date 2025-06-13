import { IoTicketOutline } from "react-icons/io5";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { TbTicketOff } from "react-icons/tb";
import { HiMiniUsers } from "react-icons/hi2";

export const cardData = [
    {
      title: "Total tickets sold",
      value: 2310,
      icon: IoTicketOutline,
      iconBgColor: "blue.100",  
      iconColor: "blue.400",
      trendValue: 7.3,
    },
    {
      title: "Total Revenue",
      value: 624,
      icon: MdOutlineCurrencyRupee,
      iconBgColor: "purple.100",
      iconColor: "purple.400",
      trendValue: -3.1,
    },
    {
      title: "Tickets Cancelled",
      value: 7364,
      icon: TbTicketOff,
      iconBgColor: "orange.100",
      iconColor: "orange.400",
      trendValue: -4.7,
    },
    {
      title: "Total No of Users",
      value: "21,767",
      icon: HiMiniUsers,
      iconBgColor: "pink.100",
      iconColor: "pink.400",
      trendValue: 2.7,
    },
  ];