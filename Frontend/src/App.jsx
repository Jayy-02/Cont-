import { useState } from "react";
import abi from "./abi.json";
import { ethers } from "ethers";

const contractAddress = "0x9D1eb059977D71E1A21BdebD1F700d4A39744A70";

function App() {
  const [text, setText] = useState("");
  const [receivedMessage, setReceivedMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState("");

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  const handleSet = async () => {
    try {
      if (!text) {
        alert("Please enter a message before setting.");
        return;
      }

      if (window.ethereum) {
        await requestAccount();
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        const tx = await contract.setMessage(text);
        const txReceipt = await tx.wait();
        console.log("Transaction successful:", txReceipt);
      } else {
        setErrorMessage(
          "MetaMask not found. Please install MetaMask to use this application."
        );
      }
    } catch (error) {
      // console.error("Error setting message:", error);
      setErrorMessage(error.message || error);
    }
  };

  const handleGet = async () => {
    try {
      if (window.ethereum) {
        await requestAccount();
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        const message = await contract.getMessage();
        const txReceipt = await message.wait();
        setReceivedMessage(message);
        console.log("Transaction successful:", txReceipt);
      } else {
        setErrorMessage(
          "MetaMask not found. Please install MetaMask to use this application."
        );
      }
    } catch (error) {
      console.error("Error setting message:", error);
      setErrorMessage(error.message || error);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Set Message on Smart Contract</h1>
      <div style={{ color: "red" }}>Error: {errorMessage}</div>
      <input
        type="text"
        placeholder="Set message"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleSet}>Set Message</button>
      <br />
      <button onClick={handleGet}>Get Message</button>
      <input
        type="text"
        placeholder="Set message"
        value={receivedMessage}
        disabled
      />
    </div>
  );
}

export default App;
