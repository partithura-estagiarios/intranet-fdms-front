import { useI18n } from "vue-i18n";

import { positiveNotify, negativeNotify } from "../helpers";

export function useNotify() {
  const { t, te } = useI18n();

  const notifyResponse = (
    result: { success: boolean; message: string },
    namespace = "action",
  ): boolean => {
    const messageKey = `${namespace}.${result.message}`;

    if (result.success) {
      const successMessage = te(messageKey)
        ? t(messageKey)
        : t(`action.successDefault`);

      positiveNotify(successMessage);
      return true;
    }

    if (te(messageKey)) {
      negativeNotify(t(messageKey));
      return false;
    }
    console.error("[i18n] Erro de sistema não mapeado:", result.message);
    negativeNotify(t(`${namespace}.unknownError`));

    return false;
  };

  return { notifyResponse };
}
