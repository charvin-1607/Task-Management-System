import React from "react";

function GlobalLoader() {
    return (
        <div style={styles.overlay}>
            <div className="text-center text-white">
                <div className="spinner-border mb-3 spinner-border text-danger" role="status"></div>
                <p>Please wait...</p>
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
    },
};

export default GlobalLoader;