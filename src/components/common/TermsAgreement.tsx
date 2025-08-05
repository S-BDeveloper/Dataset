import React, { useState } from "react";
import { useLanguage } from "../../hooks/useContext";

interface TermsAgreementProps {
  agreed: boolean;
  onAgreementChange: (agreed: boolean) => void;
  showModal?: boolean;
  className?: string;
}

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "terms" | "privacy";
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, type }) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const title =
    type === "terms" ? t("terms.termsTitle") : t("terms.privacyTitle");
  const content =
    type === "terms" ? (
      <div className="space-y-4 max-h-96 overflow-y-auto">
        <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-200">
          {t("terms.termsTitle")}
        </h3>
        <p className="text-sm text-stone-600 dark:text-stone-400">
          {t("terms.termsDescription")}
        </p>
        <div className="space-y-2 text-sm text-stone-600 dark:text-stone-400">
          <p>
            <strong>{t("terms.keyPoints")}</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>{t("terms.personalUse")}</li>
            <li>{t("terms.noModification")}</li>
            <li>{t("terms.noReverseEngineering")}</li>
            <li>{t("terms.noGuarantee")}</li>
            <li>{t("terms.asIs")}</li>
          </ul>
        </div>
        <p className="text-xs text-stone-500 dark:text-stone-500">
          {t("terms.completeTerms")}
        </p>
      </div>
    ) : (
      <div className="space-y-4 max-h-96 overflow-y-auto">
        <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-200">
          {t("terms.privacyTitle")}
        </h3>
        <p className="text-sm text-stone-600 dark:text-stone-400">
          {t("terms.privacyDescription")}
        </p>
        <div className="space-y-2 text-sm text-stone-600 dark:text-stone-400">
          <p>
            <strong>{t("terms.whatWeCollect")}</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>{t("terms.emailName")}</li>
            <li>{t("terms.preferences")}</li>
            <li>{t("terms.technicalInfo")}</li>
            <li>{t("terms.searchQueries")}</li>
          </ul>
          <p>
            <strong>{t("terms.yourRights")}</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>{t("terms.accessData")}</li>
            <li>{t("terms.objectProcessing")}</li>
            <li>{t("terms.withdrawConsent")}</li>
          </ul>
        </div>
        <p className="text-xs text-stone-500 dark:text-stone-500">
          {t("terms.completePolicy")}
        </p>
      </div>
    );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-stone-800 rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-stone-800 dark:text-stone-200">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        {content}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            {t("terms.close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export const TermsAgreement: React.FC<TermsAgreementProps> = ({
  agreed,
  onAgreementChange,
  showModal = true,
  className = "",
}) => {
  const { t } = useLanguage();
  const [termsModal, setTermsModal] = useState<{
    isOpen: boolean;
    type: "terms" | "privacy";
  }>({
    isOpen: false,
    type: "terms",
  });

  const openTermsModal = (type: "terms" | "privacy") => {
    if (showModal) {
      setTermsModal({ isOpen: true, type });
    }
  };

  const closeTermsModal = () => {
    setTermsModal({ isOpen: false, type: "terms" });
  };

  return (
    <>
      <div
        className={`flex items-start space-x-3 p-4 bg-stone-50 dark:bg-stone-700/50 rounded-lg border border-stone-200 dark:border-stone-600 ${className}`}
      >
        <input
          id="agreeToTerms"
          name="agreeToTerms"
          type="checkbox"
          checked={agreed}
          onChange={(e) => onAgreementChange(e.target.checked)}
          className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-stone-300 rounded"
          required
        />
        <label
          htmlFor="agreeToTerms"
          className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed"
        >
          {t("terms.agreeTo")}{" "}
          {showModal ? (
            <>
              <button
                type="button"
                onClick={() => openTermsModal("terms")}
                className="text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 underline"
              >
                {t("terms.termsOfUse")}
              </button>{" "}
              {t("terms.and")}{" "}
              <button
                type="button"
                onClick={() => openTermsModal("privacy")}
                className="text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 underline"
              >
                {t("terms.privacyPolicy")}
              </button>
            </>
          ) : (
            <>
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 underline"
              >
                {t("terms.termsOfUse")}
              </a>{" "}
              {t("terms.and")}{" "}
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 underline"
              >
                {t("terms.privacyPolicy")}
              </a>
            </>
          )}
          . {t("terms.acknowledge")}
        </label>
      </div>

      {showModal && (
        <TermsModal
          isOpen={termsModal.isOpen}
          onClose={closeTermsModal}
          type={termsModal.type}
        />
      )}
    </>
  );
};

export default TermsAgreement;
