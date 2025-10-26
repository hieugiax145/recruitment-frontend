import React from "react";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import LoadingOverlay from "./ui/LoadingOverlay";

export default function GlobalLoadingIndicator() {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  const isLoading = isFetching > 0 || isMutating > 0;

  return <LoadingOverlay show={isLoading} />;
}
