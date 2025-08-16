import { globalStyles } from '@/styles/globalStyles';
import React, { useCallback, useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import AddNewCardModal from './components/addNewCardModal';
import Back from '@/assets/svg/arrow-left.svg';
import RoundButton from '@/components/roundButton';
import { Text, theme } from '@/components/theme';
import { AppNavigationProps } from '@/navigators/navigation';
import BaseButton from '@/components/baseBtn';
import Gpay from '@/assets/svg/GooglePay.svg';
import Apple from '@/assets/svg/apple-pay.svg';
import Paypal from '@/assets/svg/PayPal.svg';
import { useSubscribeMeals } from '@/hooks/useSubscribetoMeal';
import { showToast } from '@/components/toast';
import { useSubscribeExercise } from '@/hooks/useSubscribeExercise';
import { useTranslation } from 'react-i18next';
import TextInput from '@/components/textinput';
import { useMealCoupon } from '@/hooks/useMealCoupon';
import { useFitnessCoupon } from '@/hooks/useFitnessCoupon';
import { calculateMonths } from '@/utils/month';
import RNGoSell from '@tap-payments/gosell-sdk-react-native';
import {
  createSDKConfigurations,
  createSessionParameters,
} from '@/utils/sdkConfig';
// import {
//   PurchaseError,
//   requestSubscription,
//   useIAP,
//   validateReceiptIos,
// } from 'react-native-iap';

const list = [
  { key: 1, sport: 'PayPal', icon: <Paypal /> },
  { key: 2, sport: 'Google Pay', icon: <Gpay /> },
  { key: 3, sport: 'Apple Pay', icon: <Apple /> },
];

const Payment = ({ navigation, route }: AppNavigationProps<'Payment'>) => {
  const { t } = useTranslation();
  const {
    delivery_id,
    meal_plan_id,
    address,
    package_id,
    pricing_id,
    pay_details,
  } = route.params;
  const [visible, setvisible] = useState(false);
  const [active, setactive] = useState(1);
  const [coupon, setcoupon] = useState('');
  const [discount, setdiscount] = useState<number>();
  const [newPrice, setnewPrice] = useState<number>();

  const handleResult = (error: any, status: any) => {
    if (!status) {
      console.error('Status is null or undefined', error);
      showToast('errorToast', 'Payment cancelled or no response.', 'top');
      return;
    }

    console.log('GoSell status:', status.sdk_result);

    switch (status.sdk_result) {
      case 'SUCCESS':
        console.log('Payment successful');
        handleConfirmClicked();
        break;
      case 'FAILED':
        console.error('Payment failed:', status.sdk_error_message);
        showToast('errorToast', 'Payment failed. Please try again.', 'top');
        break;
      case 'SDK_ERROR':
        console.error(
          'SDK Error:',
          status.sdk_error_message || 'Unknown error',
        );
        showToast(
          'errorToast',
          'Payment service error. Please try again.',
          'top',
        );
        break;
      case 'CANCELLED':
        console.warn('Payment was cancelled by user.');
        showToast('errorToast', 'Payment cancelled.', 'top');
        break;
      default:
        console.log('Unknown payment status:', status.sdk_result);
        showToast('errorToast', `Unknown status: ${status.sdk_result}`, 'top');
        break;
    }
  };

  const startPayment = () => {
    const amount = 1 + 1.99;

    // 🔍 LOG Amount
    console.log('🔍 Amount:', { amount, type: typeof amount });

    if (!amount || amount <= 0) {
      showToast('errorToast', 'Invalid payment amount', 'top');
      return;
    }

    const paymentItems: RNGoSell.goSellSDKModels.PaymentItem[] = [
      {
        amount: String(amount),
        description: 'Evolve Subscription',
        name: 'Subscription Plan',
        quantity: '1',
        discount: {
          type: 'F',
          value: '0',
        },
      },
    ];

    // 🔍 LOG Payment Items
    console.log('🔍 Payment Items:', paymentItems);

    const sdkConfigurations = createSDKConfigurations(amount, paymentItems);
    console.log({ sdkConfigurations });

    RNGoSell.goSellSDK.startPayment(sdkConfigurations, amount, handleResult);
  };
  const testMinimalPayment = () => {
    try {
      console.log(
        '🔍 Available GoSell methods:',
        Object.keys(RNGoSell.goSellSDK),
      );

      // Use the correct Tap Payments SDK configuration format
      const tapConfig = {
        // SDK Configuration
        transactionCurrency: 'USD',

        // Customer details
        customerFirstName: 'John',
        customerLastName: 'Doe',
        customerEmail: 'test@example.com',
        customerPhone: '+12345678901',

        // Payment settings
        paymentReference: `ref_${Date.now()}`,
        paymentDescription: 'Test Payment',
        paymentStatementDescriptor: 'EVOLVE FITNESS',

        // Merchant settings
        merchantID: '67757680',

        // SDK settings
        sdkLanguage: 'en',
        allowedCadTypes: 'ALL',

        // Environment
        environment: 'sandbox', // or 'production'

        // Optional settings
        isUserAllowedToSaveCard: true,
        paymentType: 'CARD',

        // Payment items (if required)
        paymentItems: [
          {
            amount: 23,
            description: 'Test Payment',
            name: 'Test Item',
            quantity: 1,
            discount: {
              type: 'F',
              value: 0,
            },
          },
        ],
      };

      const amount = 23;

      console.log(
        '🔍 Corrected Tap Config:',
        JSON.stringify(tapConfig, null, 2),
      );
      console.log('🔍 Amount:', amount);
      console.log('🔍 About to call startPayment with corrected format...');

      // Call with 3 parameters
      RNGoSell.goSellSDK.startPayment(tapConfig, amount, handleResult);
    } catch (error) {
      console.error('❌ Caught error:', error);
      console.error('❌ Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }
  };

  useEffect(() => {
    console.log('🔍 SDK Debugging:', {
      RNGoSellExists: !!RNGoSell,
      goSellSDKExists: !!RNGoSell?.goSellSDK,
      startPaymentExists: !!RNGoSell?.goSellSDK?.startPayment,
      configureAppExists: !!RNGoSell?.goSellSDK?.configureApp,
      SDKMethods: RNGoSell?.goSellSDK
        ? Object.keys(RNGoSell.goSellSDK)
        : 'SDK not available',
    });

    // Try to configure the SDK with proper credentials
    if (RNGoSell?.goSellSDK?.configureApp) {
      try {
        // You might need to configure with your actual Tap API keys
        const appConfig = {
          // Add your configuration here - you might be missing API keys
          // sandbox: true, // for testing
          // apiKey: 'your_tap_api_key',
          // bundleId: 'your.app.bundle.id',
        };

        console.log('🔍 Configuring SDK with:', appConfig);
        RNGoSell.goSellSDK.configureApp(appConfig);
        console.log('✅ SDK configured successfully');
      } catch (error) {
        console.error('❌ SDK configuration failed:', error);
      }
    }
  }, []);

  const handleBackToDashboardClicked = React.useCallback(() => {
    setvisible(false);
  }, []);
  const { mutate, isPending } = useSubscribeMeals({
    onSuccess(data) {
      showToast('successToast', data.message, 'top');
      navigation.navigate('SuccessHome');
    },
    onError(err: any) {
      showToast('errorToast', err.errors[0].message, 'top');
    },
  });
  const { mutate: subExercise, isPending: subPending } = useSubscribeExercise({
    onSuccess(data) {
      showToast('successToast', data.message, 'top');
      navigation.navigate('SuccessHome');
    },
    onError(err: any) {
      showToast('errorToast', err.errors[0].message, 'top');
    },
  });
  const { mutate: mealCoupon, isPending: mealPending } = useMealCoupon({
    onSuccess(data) {
      showToast('successToast', data.message, 'top');
    },
    onError(err: any) {
      showToast('errorToast', err.errors[0].message, 'top');
    },
  });
  const { mutate: fitnessCoupon, isPending: fitnessPending } = useFitnessCoupon(
    {
      onSuccess(data) {
        showToast('successToast', data.message, 'top');
        setdiscount(data.discount);
        setnewPrice(data.new_total);
      },
      onError(err: any) {
        showToast('errorToast', err.errors[0].message, 'top');
      },
    },
  );

  const handleCouponClicked = useCallback(() => {
    if (package_id != null && pricing_id != null) {
      fitnessCoupon({ package_id, pricing_id, coupon_code: coupon });
    } else {
      mealCoupon({
        meal_plan_id: delivery_id,
        coupon_code: coupon,
      });
    }
  }, [coupon, package_id, pricing_id, delivery_id]);

  const handleConfirmClicked = React.useCallback(() => {
    if (package_id != null && package_id != null)
      subExercise({ package_id, pricing_id });
    else
      mutate({
        meal_plan_id: delivery_id,
        delivery_time_id: meal_plan_id,
        street: address?.street,
        city: address?.city,
        address_label: address?.address_label,
        building: address?.building,
        postal_code: address?.postal_code,
        delivery_notes: address?.delivery_notes,
        state: address?.state,
      });
  }, [delivery_id, meal_plan_id, address, package_id, pricing_id]);
  // const errorLog = ({message, error}) => {
  //   console.error('An error happened', message, error);
  // };

  // const isIos = Platform.OS === 'ios';

  // //product id from appstoreconnect app->subscriptions
  // const subscriptionSkus = Platform.select({
  //   ios: ['evolveFitness123', 'evolveFitnessPro'],
  // });

  // //useIAP - easy way to access react-native-iap methods to
  // //get your products, purchases, subscriptions, callback
  // //and error handlers.
  // const {
  //   connected,
  //   subscriptions, //returns subscriptions for this app.
  //   getSubscriptions, //Gets available subsctiptions for this app.
  //   currentPurchase, //current purchase for the tranasction
  //   finishTransaction,
  //   purchaseHistory, //return the purchase history of the user on the device (sandbox user in dev)
  //   getPurchaseHistory, //gets users purchase history
  // } = useIAP();

  // const [loading, setLoading] = useState(false);

  // const handleGetPurchaseHistory = async () => {
  //   try {
  //     await getPurchaseHistory();
  //   } catch (error) {
  //     errorLog({message: 'handleGetPurchaseHistory', error});
  //   }
  // };

  // useEffect(() => {
  //   handleGetPurchaseHistory();
  // }, [connected]);

  // const handleGetSubscriptions = async () => {
  //   try {
  //     await getSubscriptions({skus: subscriptionSkus});
  //   } catch (error) {
  //     errorLog({message: 'handleGetSubscriptions', error});
  //   }
  // };

  // useEffect(() => {
  //   handleGetSubscriptions();
  // }, [connected]);

  // useEffect(() => {
  //   // ... listen if connected, purchaseHistory and subscriptions exist
  //   if (
  //     purchaseHistory.find(
  //       x => x.productId === (subscriptionSkus[0] || subscriptionSkus[1]),
  //     )
  //   ) {
  //     navigation.navigate('Home');
  //   }
  // }, [connected, purchaseHistory, subscriptions]);

  // const handleBuySubscription = async productId => {
  //   try {
  //     await requestSubscription({
  //       sku: productId,
  //     });
  //     setLoading(false);
  //   } catch (error) {
  //     setLoading(false);
  //     if (error instanceof PurchaseError) {
  //       errorLog({message: `[${error.code}]: ${error.message}`, error});
  //     } else {
  //       errorLog({message: 'handleBuySubscription', error});
  //     }
  //   }
  // };

  // useEffect(() => {
  //   const checkCurrentPurchase = async purchase => {
  //     if (purchase) {
  //       try {
  //         const receipt = purchase.transactionReceipt;
  //         if (receipt) {
  //           if (Platform.OS === 'ios') {
  //             const isTestEnvironment = __DEV__;

  //             //send receipt body to apple server to validete
  //             const appleReceiptResponse = await validateReceiptIos(
  //               {
  //                 'receipt-data': receipt,
  //                 password: '4503989042d143bc9a09f520893244ab',
  //               },
  //               isTestEnvironment,
  //             );

  //             //if receipt is valid
  //             if (appleReceiptResponse) {
  //               const {status} = appleReceiptResponse;
  //               if (status) {
  //                 navigation.navigate('Home');
  //               }
  //             }

  //             return;
  //           }
  //         }
  //       } catch (error) {
  //         console.log('error', error);
  //       }
  //     }
  //   };
  //   checkCurrentPurchase(currentPurchase);
  // }, [currentPurchase, finishTransaction]);

  // console.log({subscriptions});

  return (
    <View style={globalStyles.container}>
      <View style={[globalStyles.line2, styles.container]}>
        <RoundButton onPress={() => navigation.goBack()}>
          <Back color={theme.colors.black} />
        </RoundButton>
        <Text variant="poppins18black_semibold" me="s">
          {t('payment')}
        </Text>
        <View />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        {/* <Text variant="poppins14black_medium" mb="m">
          {t('saved')}
        </Text>
        <View style={globalStyles.line}>
          <RNBounceable style={styles.add} onPress={() => setvisible(true)}>
            <Text variant="poppinsTitle20black_regular" fontSize={24}>
              +
            </Text>
          </RNBounceable>
        </View>
        <Text variant="poppins14black_medium" marginVertical="m">
          {t('other_payment')}
        </Text>
        {list.map(item => (
          <RNBounceable
            style={[globalStyles.line2, styles.item, globalStyles.shadow]}
            onPress={() => setactive(item.key)}
            key={item.key}>
            <View style={globalStyles.line}>
              {item.icon}
              <Text variant="poppins14black_regular" ms="m" color="gray">
                {item.sport}
              </Text>
            </View>
            <View
              style={[
                styles.circle,
                {
                  borderColor:
                    active == item.key
                      ? theme.colors.apptheme
                      : theme.colors.mediumGray,
                },
              ]}>
              {active === item.key && <View style={styles.smallCircle} />}
            </View>
          </RNBounceable>
        ))} */}
        <Text variant="poppins14black_medium" mt="s" mb="m">
          {t('payment_details')}
        </Text>
        <View style={[globalStyles.shadow, styles.details]}>
          <View style={[globalStyles.line2, styles.margin]}>
            <Text variant="poppins14black_regular" color="gray">
              {t('plan')}
            </Text>
            <Text variant="poppins14black_regular">{pay_details?.title}</Text>
          </View>
          <View style={[globalStyles.line2, styles.margin]}>
            <Text variant="poppins14black_regular" color="gray">
              {t('subscription')}
            </Text>
            <Text variant="poppins14black_regular">
              {calculateMonths(pay_details?.number_of_days || 0)} month
              {calculateMonths(pay_details?.number_of_days || 0) > 1 ? 's' : ''}
            </Text>
          </View>
          <View style={[globalStyles.line2, styles.margin]}>
            <Text variant="poppins14black_regular" color="gray">
              {t('price')}
            </Text>
            <Text variant="poppins14black_regular">{pay_details?.price}</Text>
          </View>
          <View style={styles.line} />
          <View style={[globalStyles.line2, styles.margin]}>
            <Text variant="poppins14black_regular" color="gray">
              {t('amount')}
            </Text>
            <Text variant="poppins14black_regular">{pay_details?.price}</Text>
          </View>
          {discount ? (
            <View style={[globalStyles.line2, styles.margin]}>
              <Text variant="poppins14black_semibold" color="red">
                {t('discount')}
              </Text>
              <Text variant="poppins14black_semibold" color="red">
                -{discount}
              </Text>
            </View>
          ) : null}
          <View style={[globalStyles.line2, styles.margin]}>
            <Text variant="poppins14black_regular" color="gray">
              {t('tax')}
            </Text>
            <Text variant="poppins14black_regular">1.99</Text>
          </View>
          <View style={styles.line} />
          <View style={globalStyles.line2}>
            <Text variant="poppins14black_regular" color="gray">
              {t('total')}
            </Text>
            <Text variant="poppins14black_regular">
              {discount ? newPrice : (pay_details?.price || 0) + 1.99}
            </Text>
          </View>
          <TextInput
            placeholder="Coupon Code"
            rightText="Apply"
            onChangeText={setcoupon}
            isLoading={mealPending || fitnessPending}
            onPress={handleCouponClicked}
          />
        </View>
      </ScrollView>
      <View style={[globalStyles.shadow, styles.padd]}>
        <BaseButton
          isLoading={isPending || subPending}
          disabled={isPending || subPending}
          label={t('confirm_payment')}
          // onPress={handleConfirmClicked}
          onPress={startPayment} // Use the GoSell SDK payment method
          // onPress={() => {
          //   setLoading(true);
          //   // handleBuySubscription(subscription.productId);
          // }}
        />
      </View>
      <AddNewCardModal
        visible={visible}
        onBackToDashboardClicked={handleBackToDashboardClicked}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: '4%' },
  padd: { paddingHorizontal: '5%', paddingVertical: '3%' },
  add: {
    width: 58,
    height: 135,
    borderRadius: 14,
    backgroundColor: theme.colors.softGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    height: 55,
    borderRadius: 8,
    backgroundColor: theme.colors.white,
    paddingHorizontal: '5%',
    marginBottom: '4%',
  },
  circle: {
    borderColor: theme.colors.apptheme,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  details: { padding: '5%', borderRadius: 12, marginBottom: '5%' },
  line: {
    backgroundColor: theme.colors.softGray,
    height: 1,
    marginBottom: '4%',
    marginTop: '2%',
  },
  smallCircle: {
    width: 10,
    height: 10,
    backgroundColor: theme.colors.apptheme,
    borderRadius: 5,
  },
  margin: { marginBottom: '4%' },
});

export default Payment;
