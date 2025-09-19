import { Global, css } from "@emotion/react";
import { primaryColor, whiteTextColor,litePrimaryColor } from "./globalColors";

const globalStyles = css`
  /* Customize scrollbar styles */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: transparent; /* subtle, avoids heavy background */
  }

  ::-webkit-scrollbar-thumb {
    background: ${litePrimaryColor};
    border-radius: 10px;
    border: 2px solid transparent; /* creates padding effect */
    background-clip: content-box;
    transition: background 0.3s ease;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${whiteTextColor}; /* hover contrast */
  }

  ::-webkit-scrollbar-corner {
    background: transparent;
  }

  /* Firefox support */
  * {
    scrollbar-width: thin;
    scrollbar-color: ${litePrimaryColor} transparent;
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
