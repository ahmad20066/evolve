import { Platform } from 'react-native';
import RNGoSell from '@tap-payments/gosell-sdk-react-native';

const {
  Languages,
  PaymentTypes,
  AllowedCadTypes,
  TrxMode,
  SDKMode,
  UiDisplayModes,
  SDKAppearanceMode,
} = RNGoSell.goSellSDKModels;

// App credentials
export const appCredentials: RNGoSell.goSellSDKModels.AppCredentials = {
  sandbox_secrete_key: 'sk_test_xFbqWnkJS5P3A2Xz6lshuI1R',
  production_secrete_key: 'sk_live_j2wEV41qnaUh9dJ7LTDPycKi',
  bundleID: 'com.evolveFitness',
  language: Languages.EN,
};

export const shipping: RNGoSell.goSellSDKModels.Shipping[] = [
  {
    name: 'Standard Shipping',
    description: 'Delivers in 5–7 days',
    amount: 5.0,
  },
];

export const customer: RNGoSell.goSellSDKModels.Customer = {
  isdNumber: '965',
  number: '00000000',
  customerId: 'customer_001',
  first_name: 'John',
  middle_name: '', // Will be cleaned later
  last_name: 'Doe',
  email: 'john.doe@example.com',
};

export const paymentReference: RNGoSell.goSellSDKModels.PaymentReference = {
  track: 'track_001',
  payment: 'payment_001',
  gateway: 'gateway_001',
  acquirer: 'acquirer_001',
  transaction: 'trans_001',
  order: 'order_001',
  gosellID: '', // Will be cleaned later
};

// Helper: Clean null/empty strings from objects
const cleanObject = (obj: any) => {
  const cleaned: any = {};
  for (const key in obj) {
    if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
      cleaned[key] = obj[key];
    }
  }
  return cleaned;
};

export const createSessionParameters = (
  amount: number,
  paymentItems: RNGoSell.goSellSDKModels.PaymentItem[],
): RNGoSell.goSellSDKModels.SessionParameters => {
  const totalAmount =
    paymentItems.reduce(
      (sum, item) => sum + parseFloat(item.amount || '0'),
      0,
    ) + shipping.reduce((sum, s) => sum + s.amount, 0);
  const session: RNGoSell.goSellSDKModels.SessionParameters = {
    paymentStatementDescriptor: 'Evolve Fitness',
    transactionCurrency: 'KWD',
    amount: String(totalAmount),
    isUserAllowedToSaveCard: true,
    paymentType: PaymentTypes.ALL,
    shipping,
    allowedCadTypes: AllowedCadTypes.ALL,
    paymentItems,
    paymentMetaData: { app: 'evolve-fitness' },
    applePayMerchantID: 'merchant.com.evolveFitness',
    trxMode: TrxMode.PURCHASE,
    SDKMode: SDKMode.Sandbox,
    UIRequiredResponseType: UiDisplayModes.DARK,
    appearanceMode: SDKAppearanceMode.Windowed,
    customer: cleanObject(customer), // Cleaned
    paymentReference: cleanObject(paymentReference), // Cleaned
    isRequires3DSecure: false,
    receiptSettings: {
      email: true,
      sms: false,
      id: 'receipt_001',
    },
    allowsToSaveSameCardMoreThanOnce: false,
    supportedPaymentMethods: ['CARD', 'APPLE_PAY', 'GOOGLE_PAY'],
    merchantID: '67757680',
    merchant: {
      id: '67757680', // 👈 required
    },
  };

  // 🔍 LOG Session Parameters
  console.log(
    '🔍 Session Parameters before returning:',
    JSON.stringify(session, null, 2),
  );

  return session;
};

export const createSDKConfigurations = (
  amount: number,
  paymentItems: RNGoSell.goSellSDKModels.PaymentItem[],
): RNGoSell.goSellSDKModels.SdkConfigurations => {
  const config: RNGoSell.goSellSDKModels.SdkConfigurations = {
    appCredentials,
    sessionParameters: createSessionParameters(amount, paymentItems),
  };

  // 🔍 LOG SDK Configurations
  console.log('🔍 SDK Configurations:', JSON.stringify(config, null, 2));

  return config;
};
