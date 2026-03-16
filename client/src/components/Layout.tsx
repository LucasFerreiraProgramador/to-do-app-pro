/**
 * Layout principal da aplicação
 * Combina Header, Sidebar e área de conteúdo
 */

import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { motion } from "framer-motion";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [currentSection, setCurrentSection] = useState("tasks");

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar onNavigate={setCurrentSection} currentSection={currentSection} />

        {/* Content Area */}
        <motion.main
          className="flex-1 overflow-auto flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex-1">{children}</div>
          <Footer />
        </motion.main>
      </div>
    </div>
  );
};

export default Layout;
