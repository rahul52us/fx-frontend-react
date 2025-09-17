import { Global, css } from "@emotion/react";
import { primaryColor, whiteTextColor } from "./globalColors";

const globalStyles = css`
  /* Customize scrollbar styles */
  ::-webkit-scrollbar {
    width: 5px;
    height:8px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: var(--chakra-colors-blue-500);
    /* border-radius: 10px; */
  }

  ::-webkit-scrollbar-track {
    background-color: var(--chakra-colors-gray-100);
  }
`;

export const GlobalStyles = () => <Global styles={globalStyles} />;

export const glassCardStyle = {
  bg: "rgba(255, 255, 255, 0.8)",
  backdropFilter: "blur(12px)",
  borderRadius: "2xl",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
  border: "1px solid rgba(255, 255, 255, 0.6)",
};

export const  primaryButtonHoverStyle = {
  color:primaryColor,
  borderColor:primaryColor,
  backgroundColor:"transparent",
}
export const primaryButtonStyle = {  
  backgroundColor:primaryColor,
  color:whiteTextColor,
  borderColor:whiteTextColor,
}
