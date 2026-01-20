"use client";

import { useState, useEffect } from "react";

const useToken = (key: string, defaultValue = null) => {
  const [token, setToken] = useState(defaultValue);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = window.localStorage.getItem(key);
      if (storedToken) {
        setToken(JSON.parse(storedToken));
      }
    }
  }, [key]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (token === null) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(token));
      }
    }
  }, [token, key]);

  return [token, setToken, () => setToken(null)];
};

export default useToken;
