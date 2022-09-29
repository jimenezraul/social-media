import {Dispatch, SetStateAction } from "react";

export interface IProps {
    setErrors: Dispatch<SetStateAction<String>>;
  }