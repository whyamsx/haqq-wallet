export enum I18N {
  ledgerBluetoothAllow,
  ledgerBluetoothTitleUnknown,
  ledgerBluetoothTitleDisabled,
  ledgerBluetoothDescriptionUnknown,
  ledgerBluetoothDescriptionDisabled,
  transactionLedgerBluetoothDisabled,
  transactionLedgerBluetoothConfirmation,
  createAgreementText,
  createAgreementTitle,
  createAgreementAgree,
  termsAgreement,
  termsPrivacyPolicy,
  restoreAgreementText,
  restoreAgreementTitle,
  restoreAgreementAgree,
  ledgerAgreementText,
  ledgerAgreementTitle,
  ledgerAgreementAgree,
}

export function getText(key: I18N): string {
  return en[key];
}

const en: Record<I18N, string> = {
  [I18N.ledgerBluetoothAllow]: 'Allow',
  [I18N.ledgerBluetoothTitleUnknown]: 'Allow using Bluetooth',
  [I18N.ledgerBluetoothTitleDisabled]: 'No access to Bluetooth',
  [I18N.ledgerBluetoothDescriptionUnknown]:
    'App uses bluetooth to find, connect and communicate with Ledger Nano devices',
  [I18N.ledgerBluetoothDescriptionDisabled]:
    'The app does not have access to your Bluetooth. Please go to your phone settings and allow the app to use Bluetooth. Without this, we will not be able to find your Ledger Nano X',
  [I18N.transactionLedgerBluetoothDisabled]: 'No access to Bluetooth',
  [I18N.transactionLedgerBluetoothConfirmation]:
    'Open Ethereum app on your Ledger and Confirm the transaction by pressing both buttons together',
  [I18N.createAgreementTitle]: 'Islm - DeFi Wallet',
  [I18N.createAgreementText]:
    'Islm Wallet does not store, transfer, transmit, convert, hold, or otherwise interact with any of the Virtual Currencies you may use with the Islm Wallet App. Any transfer or transaction occurs on the Haqq Network(s). Islm Wallet cannot block, freeze or take any kind of control over your Virtual Currency.',
  [I18N.createAgreementAgree]: 'Agree',
  [I18N.termsPrivacyPolicy]: 'Privacy Policy',
  [I18N.termsAgreement]: 'By clicking Agree you agree to ',
  // 'By clicking Agree you agree to the Terms of Service and',
  [I18N.restoreAgreementTitle]:
    'Do you have your recovery phrase or private key?',
  [I18N.restoreAgreementText]:
    'The recovery phrase is a 12-word phrase that you received when you created the wallet. A private key is a key created by you in the application',
  [I18N.restoreAgreementAgree]: 'Agree',
  [I18N.ledgerAgreementTitle]: 'Connect your Ledger',
  [I18N.ledgerAgreementText]:
    'If you have a Ledger Nano X, then you can connect it via Bluetooth to Islm Wallet. You will be able to manage funds from Ledger using Islm Wallet',
  [I18N.ledgerAgreementAgree]: 'Connect',
};
