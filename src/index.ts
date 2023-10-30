import { useCallback, useEffect, useState } from "react";

declare const window: Window &
  typeof globalThis & {
    cookieStore: {
      get: (name: string) => Promise<{ value: string }>;
    };
  };

const getCFZeroTrustToken = async () => {
  try {
    return JSON.parse(
      atob(
        (await window.cookieStore.get("CF_Authorization")).value.split(".")[1],
      ),
    );
  } catch (e) {
    return null;
  }
};

type Token<T> = {
  aud: string[];
  email: string;
  exp: number;
  iat: number;
  nbf: number;
  iss: string;
  type: "app";
  identity_nonce: string;
  sub: string;
  custom: T | undefined;
  country: string;
} | null;

const useCFZeroTrustToken = <T>() => {
  const [token, setToken] = useState<Token<T>>(null);

  useEffect(() => {
    getCFZeroTrustToken().then((token) => setToken(token));
  }, []);

  const signOut = useCallback(() => {
    window.open("/cdn-cgi/access/logout", "_self");
  }, []);

  return {
    token,
    signOut,
  };
};

export default useCFZeroTrustToken;
