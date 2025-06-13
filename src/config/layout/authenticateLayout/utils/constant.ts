import React from 'react';

interface SideData {
  title: string;
  description: React.ReactNode;
}

export const getSideData = (pathname: string): SideData => {
  const descriptions: Record<string, string> = {
    "/login": "Login description here",
    "/register": "Register description here",
    "/forgot-password": "Forgot Password description here",
    "/create/company": "Create Company description here",
  };

  return pathname.startsWith("/reset-password/")
    ? {
        title: `Reset Password Page`,
        description: 'Reset Description here',
      }
    : pathname.startsWith("/create/company/")
    ? {
        title: `Create Company`,
        description: 'Create Company description here',
      }
    : {
        description: descriptions[pathname] || "Default description here",
        title: {
          "/login": "Login Page",
          "/register": "Register Page",
          "/forgot-password": "Forgot Password Page",
          "/create/company": "Create Company Page",
        }[pathname] || "Sanjana kapoliya",
      };
};
