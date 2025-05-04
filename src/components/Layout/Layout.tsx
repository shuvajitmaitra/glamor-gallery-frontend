import React from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      <Sidebar />
      {children}
    </div>
  );
}
