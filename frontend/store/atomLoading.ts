import { atom } from "recoil";

export const atomLoadingState = atom({
  key: "atomLoadingState",
  default: {
    loading: true,
    error: null,
  },
});
