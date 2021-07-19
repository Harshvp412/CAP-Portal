const getCookieToken = () => {
    
    if (!document.cookie) return null;

    const token = document.cookie
        .split(";")
        .filter((str) => str.trim().startsWith("ECELL_CAP_LOGGED_IN"))[0];

    if (!token) return null;

    const tokenVal = token.split("=")[1];
    return tokenVal;
};

export default getCookieToken;