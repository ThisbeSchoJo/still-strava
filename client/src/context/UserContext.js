import { createContext, useState, useEffect } from "react";
import { getApiUrl } from "../utils/api";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null); // null means "not logged in"

  // On app load, check for a token and fetch user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(getApiUrl("/me"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Token invalid");
          return res.json();
        })
        .then((user) => setUser(user))
        .catch((err) => {
          console.error("Auto-login failed:", err);
          localStorage.removeItem("token");
        });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
