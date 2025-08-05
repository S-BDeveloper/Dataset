import { useMemo } from "react";
import {
  sanitizeDataArray,
  type SanitizedIslamicData,
} from "../utils/dataSanitizer";
import type { IslamicData } from "../types/Types";

// Hook for providing sanitized, neutral educational data
export const useSanitizedData = (data: IslamicData[]) => {
  const sanitizedData = useMemo(() => {
    return sanitizeDataArray(data);
  }, [data]);

  return sanitizedData;
};

// Hook for individual data item sanitization
export const useSanitizedItem = (item: IslamicData): SanitizedIslamicData => {
  const sanitizedItem = useMemo(() => {
    const { sanitizeIslamicData } = require("../utils/dataSanitizer");
    return sanitizeIslamicData(item);
  }, [item]);

  return sanitizedItem;
};

// Hook for checking if content needs sanitization
export const useContentNeedsSanitization = (text: string) => {
  const needsSanitization = useMemo(() => {
    const { hasInterpretiveContent } = require("../utils/dataSanitizer");
    return hasInterpretiveContent(text);
  }, [text]);

  return needsSanitization;
};
