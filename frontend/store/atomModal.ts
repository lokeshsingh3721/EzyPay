import { atom } from "recoil";

export const modalState = atom({
  key: "modalState",
  default: false,
});

export const atomModalDetailsState = atom({
  key: "atomModalDetailsState",
  default: {
    _id: undefined,
    firstName: undefined,
    lastName: undefined,
  },
});
