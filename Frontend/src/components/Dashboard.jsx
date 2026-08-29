import { useState, useEffect } from "react";
import ConnectButton from "./ConnectButton";

export default function Dashboard() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const urlToken = queryParams.get("token");

    if (urlToken) {
      setToken(urlToken);
      localStorage.setItem("spotify_token", urlToken);
      // Clean the token out of the URL bar immediately
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      const savedToken = localStorage.getItem("spotify_token");
      if (savedToken) {
        setToken(savedToken);
      }
    }
  }, []);

  if (!token) {
    return <ConnectButton />;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Connected to Spotify 🎧</h2>
      <p style={styles.subtext}>Token acquired. Ready for Milestone 2.</p>
      <div style={styles.tokenBox}>
        Token active: {token.substring(0, 10)}...
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#121212",
    color: "#ffffff",
    fontFamily: "system-ui, sans-serif",
  },
  heading: {
    fontSize: "2rem",
    marginBottom: "0.5rem",
    fontWeight: "600",
  },
  subtext: {
    color: "#a7a7a7",
    marginBottom: "1rem",
  },
  tokenBox: {
    backgroundColor: "#282828",
    padding: "10px 20px",
    borderRadius: "8px",
    fontFamily: "monospace",
    fontSize: "0.9rem",
    color: "#1DB954",
  },
};