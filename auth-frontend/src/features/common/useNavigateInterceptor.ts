import { useNavigate } from "react-router-dom";

let navigateTo: (path: string) => void;

export const useInterceptNavigate = (): void => {
  navigateTo = useNavigate();
};

export const navigate = (path: string): void => {
  if (navigateTo) {
    navigateTo(path);
  } else {
    window.location.href = path;
  }
};
