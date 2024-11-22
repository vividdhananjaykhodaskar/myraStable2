"use client";
import { useAppDispatch } from "@/redux";
import { handleUser } from "@/redux/indSourceSlice";
import React from "react";

const ClientInit = ({ user }: { user: any }) => {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (user) {
      dispatch(handleUser(user.data));
    }
  }, [user]);

  return null;
};

export default ClientInit;
