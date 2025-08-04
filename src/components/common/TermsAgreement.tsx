import React, { useState } from "react";

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
  if (!isOpen) return null;

  const title = type === "terms" ? "Terms of Use" : "Privacy Policy";
  const content =
    type === "terms" ? (
      <div className="space-y-4 max-h-96 overflow-y-auto">
        <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-200">
          Terms of Use
        </h3>
        <p className="text-sm text-stone-600 dark:text-stone-400">
          By using the Islamic Dataset Interface, you accept and agree to be
          bound by the terms and provision of this agreement.
        </p>
        <div className="space-y-2 text-sm text-stone-600 dark:text-stone-400">
          <p>
            <strong>Key Points:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Personal, non-commercial use only</li>
            <li>No modification or redistribution without permission</li>
            <li>No reverse engineering of software</li>
            <li>Accuracy of materials not guaranteed</li>
            <li>Service provided "as is" without warranties</li>
          </ul>
        </div>
        <p className="text-xs text-stone-500 dark:text-stone-500">
          For the complete terms, please visit our full Terms of Use page.
        </p>
      </div>
    ) : (
      <div className="space-y-4 max-h-96 overflow-y-auto">
        <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-200">
          Privacy Policy
        </h3>
        <p className="text-sm text-stone-600 dark:text-stone-400">
          We collect and use your information to provide and improve our
          services.
        </p>
        <div className="space-y-2 text-sm text-stone-600 dark:text-stone-400">
          <p>
            <strong>What We Collect:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Email address and name (if provided)</li>
            <li>Usage preferences and settings</li>
            <li>Technical information (browser, OS, IP)</li>
            <li>Search queries and interaction data</li>
          </ul>
          <p>
            <strong>Your Rights:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Access, correct, or delete your data</li>
            <li>Object to data processing</li>
            <li>Withdraw consent at any time</li>
          </ul>
        </div>
        <p className="text-xs text-stone-500 dark:text-stone-500">
          For the complete policy, please visit our full Privacy Policy page.
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
            Close
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
          I agree to the{" "}
          {showModal ? (
            <>
              <button
                type="button"
                onClick={() => openTermsModal("terms")}
                className="text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 underline"
              >
                Terms of Use
              </button>{" "}
              and{" "}
              <button
                type="button"
                onClick={() => openTermsModal("privacy")}
                className="text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 underline"
              >
                Privacy Policy
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
                Terms of Use
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 underline"
              >
                Privacy Policy
              </a>
            </>
          )}
          . By proceeding, you acknowledge that you have read and agree to our
          terms and conditions.
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
