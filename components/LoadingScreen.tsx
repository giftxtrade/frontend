const LoadingScreen = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: "0px",
        left: "0px",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <span
          style={{
            backgroundImage: "url('/logos/logo_profile_rounded.svg')",
            width: "70px",
            height: "70px",
            backgroundSize: "70px 70px",
            display: "block",
          }}
        ></span>
      </div>
    </div>
  )
}

export default LoadingScreen
