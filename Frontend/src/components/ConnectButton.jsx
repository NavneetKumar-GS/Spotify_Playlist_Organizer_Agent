export default function ConnectButton() {
  const handleLogin = () => {
    // This points to the backend route you now need to build
    window.location.href = "http://localhost:8000/login";
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Spotify Organizer</h2>
      <p style={styles.subtext}>Connect your account to sort your Liked Songs.</p>
      <button style={styles.button} onClick={handleLogin}>
        Connect with Spotify
      </button>
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
    letterSpacing: "-0.5px",
  },
  subtext: {
    color: "#a7a7a7",
    marginBottom: "2rem",
    fontSize: "1rem",
  },
  button: {
    backgroundColor: "#1DB954",
    color: "#000000",
    border: "none",
    borderRadius: "50px",
    padding: "12px 32px",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "transform 0.2s ease, background-color 0.2s ease",
  }
};