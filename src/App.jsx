import { useState,useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ConnectWallet from "./connectwallet";
import { WalletProvider, useWallet } from "./context";
import { mint, burn, transfer } from "./contracts/integrate";
import "./App.css";

// Futuristic Button Component
const FuturisticButton = ({ label, color, onClick }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.1, boxShadow: `0px 0px 15px ${color}` }}
    whileTap={{ scale: 0.95 }}
    className={`relative px-6 py-3 text-lg font-bold uppercase tracking-wider rounded-xl transition-all duration-300 bg-gray-900/50 border-2 border-[${color}] text-amber-400 shadow-lg`}
  >
    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.2)] to-transparent opacity-10 rounded-xl" />
    <span className="relative z-10">{label}</span>
  </motion.button>
);

// Shooting Stars Background Animation
const BackgroundAnimation = () => {

  const [coins, setCoins] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const positions = [
        { x: 50, y: 0, angle: 30 }, // Top-Left
        { x: window.innerWidth / 2, y: 0, angle: 0 }, // Top-Center
        { x: window.innerWidth-50, y: 0, angle: -30 }, // Top-Right
      ];

      const newCoin = positions[Math.floor(Math.random() * positions.length)];

      setCoins((prev) => [
        ...prev,
        {
          id: Math.random(),
          x: newCoin.x,
          y: newCoin.y,
          delay: Math.random() * 1.5,
          duration: 1.5 + Math.random(),
          angle: newCoin.angle,
        },
      ]);

      if (coins.length > 50) {
        setCoins((prev) => prev.slice(5));
      }
    }, 200);

    return () => clearInterval(interval);
  }, [coins]);

  return (
    <div className="absolute w-full h-full overflow-hidden pointer-events-none">
      {coins.map((coin) => (
        <motion.div
          key={coin.id}
          initial={{ x: coin.x, y: coin.y, opacity: 0, scale: 0.5 }}
          animate={{
            x: coin.x + (coin.angle === 30 ? 300 : coin.angle === -30 ? -300 : 0), // Move diagonally
            y: coin.y + 600, // Fall down
            opacity: [0, 1, 0.5, 0],
            scale: [0.5, 1, 1.5],
          }}
          transition={{ duration: coin.duration, delay: coin.delay, ease: "easeOut" }}
          className="absolute w-5 h-5 bg-indigo-400 rounded-full shadow-lg"
          style={{ transform: `rotate(${coin.angle}deg)` }}
        />
      ))}
    </div>
  );
};

// Reusable Action Button Component
const ActionButton = ({ label, color, onClick }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className={`px-6 py-3 w-32 text-lg font-semibold rounded-xl transition-all duration-300 ${color} shadow-lg`}
  >
    {label}
  </motion.button>
);

function AppContent() {
  const { account } = useWallet();
  const [activeSection, setActiveSection] = useState(null);
  const [formData, setFormData] = useState({ amount: "", address: "" });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!account) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      console.log(`Submitting ${activeSection} action with`, formData);
      switch (activeSection) {
        case "Mint":
          await mint(account, formData.amount);
          break;
        case "Burn":
          await burn(formData.amount);
          break;
        case "Transfer":
          await transfer(account, formData.address, formData.amount);
          break;
        default:
          throw new Error("Invalid action");
      }
      setFormData({ amount: "", address: "" });
      setActiveSection(null);
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transaction failed. Check console for details.");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-black to-gray-900 text-white">
      <BackgroundAnimation />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center bg-gray-900/80 p-8 rounded-2xl shadow-2xl"
      >
        {/* Header Section */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <img src="img.png" alt="Logo" className="w-60 h-60 object-contain mb-4" />
          <ConnectWallet />
        </motion.header>

        {/* Action Buttons */}
        <motion.section
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 flex gap-6"
        >
          <FuturisticButton label="Mint" color="#AAD5FF" onClick={() => setActiveSection("Mint")} />
  <FuturisticButton label="Burn" color="#00DCDA" onClick={() => setActiveSection("Burn")} />
  <FuturisticButton label="Transfer" color="#E794FF" onClick={() => setActiveSection("Transfer")} />

        </motion.section>

        {/* Form Section with Animations */}
        <AnimatePresence>
          {activeSection && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-6 bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md"
            >
              <h2 className="text-2xl font-semibold mb-4">{activeSection} Tokens</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <motion.input
                  type="number"
                  name="amount"
                  placeholder="Amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="px-4 py-2 rounded-md text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  required
                  whileFocus={{ scale: 1.02 }}
                />
                {activeSection === "Transfer" && (
                  <motion.input
                    type="text"
                    name="address"
                    placeholder="Recipient Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="px-4 py-2 rounded-md text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                    whileFocus={{ scale: 1.02 }}
                  />
                )}
                <div className="flex justify-between">
                  <motion.button
                    type="submit"
                    className="px-6 py-2 bg-indigo-700 hover:bg-cyan-600 rounded-md shadow-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Submit
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setActiveSection(null)}
                    className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function App() {
  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  );
}

export default App;
