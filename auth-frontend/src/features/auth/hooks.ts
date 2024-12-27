import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "./api";
import type { AuthResponse, SignInData, SignUpData } from "./types";

import {
  getValueFromLocalStorage,
  removeToken as removeTokenUtil,
  setToken as setTokenUtil,
  TOKEN_KEY,
} from "@/lib/utils";
import { AxiosResponse } from "axios";

interface AuthTokenHook {
  token: string | null;
  isAuthenticated: boolean;
  handleAuthSuccess: (token: string) => void;
  handleSignOut: () => void;
}

interface AuthMutationHook {
  signIn: (data: SignInData) => void;
  isLoading: boolean;
  error: string | null;
}

interface SignUpMutationHook {
  signUp: (data: SignUpData) => void;
  isLoading: boolean;
  error: string | null;
}

export const useAuthToken = (): AuthTokenHook => {
  const [token, setTokenState] = useState<string | null>(() => {
    return getValueFromLocalStorage(TOKEN_KEY);
  });

  const isAuthenticated = Boolean(token);

  const handleAuthSuccess = useCallback((token: string) => {
    setTokenUtil(token);
    setTokenState(token);
  }, []);

  const handleSignOut = useCallback(() => {
    removeTokenUtil();
    setTokenState(null);
  }, []);

  return {
    token,
    isAuthenticated,
    handleAuthSuccess,
    handleSignOut,
  };
};

export const useSignIn = (): AuthMutationHook => {

  const navigate = useNavigate();
  const { handleAuthSuccess } = useAuthToken();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (data: SignInData) => authApi.signIn(data),
    onSuccess: (response: AxiosResponse<AuthResponse>): void => {
      const token = response.data.jwt;
      if (token) {
        handleAuthSuccess(token);
        navigate("/welcome");
      } else {
        setError("Invalid token received");
      }
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "Failed to sign in");
    },
  });

  return {
    signIn: mutation.mutate,
    isLoading: mutation.isPending,
    error,
  };
};

export const useSignUp = (): SignUpMutationHook => {
  const navigate = useNavigate();

  const { handleAuthSuccess } = useAuthToken();

  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (data: SignUpData) => authApi.signUp(data),
    onSuccess: (response: AxiosResponse<AuthResponse>): void => {
      const token = response.data.jwt;
      if (token) {
        handleAuthSuccess(token);
        navigate("/welcome");
      } else {
        setError("Invalid token received");
      }
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "Failed to sign up");
    },
  });

  return {
    signUp: mutation.mutate,
    isLoading: mutation.isPending,
    error,
  };
};
