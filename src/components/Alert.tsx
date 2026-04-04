// src/components/Alert.tsx
"use client";

import React from "react";
import clsx from "clsx";
import {
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

interface AlertProps {
  type?: "info" | "success" | "warning" | "error";
  children: React.ReactNode;
}

export function Alert({ type = "info", children }: AlertProps) {
  const baseClasses =
    "rounded-md p-4 mb-6 border text-sm font-medium flex items-start gap-3";

  const styles = {
    info: "bg-blue-50 text-blue-800 border-blue-200",
    success: "bg-green-50 text-green-800 border-green-200",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
    error: "bg-red-50 text-red-800 border-red-200",
  };

  const icons: Record<string, JSX.Element> = {
    info: <InformationCircleIcon className="h-5 w-5 text-blue-600" />,
    success: <CheckCircleIcon className="h-5 w-5 text-green-600" />,
    warning: <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />,
    error: <XCircleIcon className="h-5 w-5 text-red-600" />,
  };

  return (
    <div className={clsx(baseClasses, styles[type])}>
      <span>{icons[type]}</span>
      <div>{children}</div>
    </div>
  );
}
