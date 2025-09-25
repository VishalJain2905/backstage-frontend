import React, { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LandingPage } from "./components/LandingPage";
import { LoginPage } from "./components/LoginPage";
import { Dashboard } from "./components/Dashboard";
import { AIChat } from "./components/AIChat";
import { AIHumanizer } from "./components/AIHumanizer";
import { AdminPage } from "./components/AdminPage";
import { RequestAccessPage } from "./components/RequestAccessPage";
import { WalletConnectionModal } from "./components/WalletConnectionModal";
import { WalletRegistrationModal } from "./components/WalletRegistrationModal";
import { ConnectWalletPromptModal } from "./components/ConnectWalletPromptModal";

type Screen =
  | "landing"
  | "login"
  | "request-access"
  | "dashboard"
  | "ai-chat"
  | "ai-humanizer"
  | "admin";

function AppContent() {
  const [currentScreen, setCurrentScreen] =
    useState<Screen>("landing");
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showWalletRegistration, setShowWalletRegistration] = useState(false);
  const [showConnectWalletPrompt, setShowConnectWalletPrompt] = useState(false);
  const [pendingWalletAddress, setPendingWalletAddress] = useState<string>("");
  const { completeWalletRegistration } = useAuth();

  const handleNavigation = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleLogin = () => {
    setCurrentScreen("dashboard");
  };

  const handleDirectToDashboard = () => {
    setCurrentScreen("dashboard");
  };

  const handleLogout = () => {
    setCurrentScreen("landing");
  };

  const handleOpenTool = (toolId: string) => {
    if (toolId === "ai-chat") {
      setCurrentScreen("ai-chat");
    } else if (toolId === "ai-humanizer") {
      setCurrentScreen("ai-humanizer");
    }
  };

  const handleBackToDashboard = () => {
    setCurrentScreen("dashboard");
  };

  const handleBackToLanding = () => {
    setCurrentScreen("landing");
  };

  const handleWalletConnect = (walletId: string) => {
    console.log(`Connecting with wallet: ${walletId}`);
    // Wallet selection logged, no redirect
  };

  const handleOpenWalletModal = () => {
    setShowWalletModal(true);
  };

  const handleCloseWalletModal = () => {
    setShowWalletModal(false);
  };

  // Render screens
  if (currentScreen === "landing") {
    return (
      <>
        <LandingPage
          onLogin={() => handleNavigation("login")}
          onDirectToDashboard={handleDirectToDashboard}
          onRequestAccess={() =>
            handleNavigation("request-access")
          }
          onWalletConnect={handleOpenWalletModal}
        />
        <WalletConnectionModal
          isOpen={showWalletModal}
          onClose={handleCloseWalletModal}
          onConnect={handleWalletConnect}
          onWalletConnected={(address) => {
            console.log('Wallet connected:', address);
            setCurrentScreen("dashboard");
          }}
          onRegistrationNeeded={(address) => {
            setPendingWalletAddress(address);
            setShowWalletRegistration(true);
          }}
        />
        <WalletRegistrationModal
          isOpen={showWalletRegistration}
          walletAddress={pendingWalletAddress}
          onClose={() => setShowWalletRegistration(false)}
          onComplete={async (data) => {
            try {
              await completeWalletRegistration({
                walletAddress: pendingWalletAddress,
                ...data
              });
              setShowWalletRegistration(false);
              setCurrentScreen("dashboard");
            } catch (error) {
              console.error('Wallet registration failed:', error);
            }
          }}
        />
        <ConnectWalletPromptModal
          isOpen={showConnectWalletPrompt}
          onClose={() => setShowConnectWalletPrompt(false)}
          onConnectWallet={() => {
            setShowConnectWalletPrompt(false);
            setShowWalletModal(true);
          }}
          onSkip={() => setShowConnectWalletPrompt(false)}
        />
      </>
    );
  }

  if (currentScreen === "login") {
    return (
      <LoginPage
        onBack={handleBackToLanding}
        onLogin={handleLogin}
        onRequestAccess={() =>
          handleNavigation("request-access")
        }
        onShowWalletPrompt={() => setShowConnectWalletPrompt(true)}
      />
    );
  }

  if (currentScreen === "request-access") {
    return <RequestAccessPage onBack={handleBackToLanding} />;
  }

  if (currentScreen === "dashboard") {
    return (
      <Dashboard
        onLogout={handleLogout}
        onOpenTool={handleOpenTool}
      />
    );
  }

  if (currentScreen === "ai-chat") {
    return <AIChat onBack={handleBackToDashboard} />;
  }

  if (currentScreen === "ai-humanizer") {
    return <AIHumanizer onBack={handleBackToDashboard} />;
  }

  if (currentScreen === "admin") {
    return <AdminPage onBack={handleBackToDashboard} />;
  }

  // Default fallback
  return (
    <>
      <LandingPage
        onLogin={() => handleNavigation("login")}
        onDirectToDashboard={handleDirectToDashboard}
        onRequestAccess={() =>
          handleNavigation("request-access")
        }
        onWalletConnect={handleOpenWalletModal}
      />
      <WalletConnectionModal
        isOpen={showWalletModal}
        onClose={handleCloseWalletModal}
        onConnect={handleWalletConnect}
        onWalletConnected={(address) => {
          console.log('Wallet connected:', address);
          setCurrentScreen("dashboard");
        }}
        onRegistrationNeeded={(address) => {
          setPendingWalletAddress(address);
          setShowWalletRegistration(true);
        }}
      />
      <WalletRegistrationModal
        isOpen={showWalletRegistration}
        walletAddress={pendingWalletAddress}
        onClose={() => setShowWalletRegistration(false)}
        onComplete={async (data) => {
          try {
            await completeWalletRegistration({
              walletAddress: pendingWalletAddress,
              ...data
            });
            setShowWalletRegistration(false);
            setCurrentScreen("dashboard");
          } catch (error) {
            console.error('Wallet registration failed:', error);
          }
        }}
      />
      <ConnectWalletPromptModal
        isOpen={showConnectWalletPrompt}
        onClose={() => setShowConnectWalletPrompt(false)}
        onConnectWallet={() => {
          setShowConnectWalletPrompt(false);
          setShowWalletModal(true);
        }}
        onSkip={() => setShowConnectWalletPrompt(false)}
      />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}