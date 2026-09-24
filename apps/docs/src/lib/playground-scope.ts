"use client";

import * as React from "react";
import * as Stackly from "@stacklyui/ui";

/**
 * The scope handed to the live playground. Anything referenced in editable
 * snippets must be here: React + hooks and every StacklyUI export.
 */
export const playgroundScope: Record<string, unknown> = {
  React,
  useState: React.useState,
  useRef: React.useRef,
  useEffect: React.useEffect,
  useMemo: React.useMemo,
  ...Stackly,
};
