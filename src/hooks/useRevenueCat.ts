import { useEffect, useState } from "react";
import Purchases, {
  CustomerInfo,
  PurchasesOffering,
} from "react-native-purchases";

const APIKeys = { apple: "appl_HwxkOdCWHtzoIvCoKSDlKHlIdVv" };
const typesofMemberships = { basic: "basic", premium: "premium" };
function useRevenueCat() {
  const [currentOffering, setCurrentOffering] =
    useState<PurchasesOffering | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const isProMember = customerInfo?.entitlements.active.pro;

  useEffect(() => {
    const fetchData = async () => {
      await Purchases.configure({ apiKey: APIKeys.apple });
      const offerings = await Purchases.getOfferings();
      const customerInfo = await Purchases.getCustomerInfo();
      setCurrentOffering(offerings.current);
      setCustomerInfo(customerInfo);
    };
    fetchData().catch((error) => {
      console.error("Error fetching data from RevenueCat:", error);
    });
  }, []);

  useEffect(() => {
    const customerInfoUpdated = async (info: CustomerInfo) => {
      setCustomerInfo(info);
    };
    Purchases.addCustomerInfoUpdateListener(customerInfoUpdated);
  }, []);
  return { currentOffering, customerInfo, isProMember };
}

export default useRevenueCat;
