import { globalStyles } from "@/styles/globalStyles";
import React, { useEffect, useState } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import Right from "@/assets/svg/smallright.svg";
import { Text, theme } from "@/components/theme";
import RNBounceable from "@freakycoder/react-native-bounceable";
import BaseButton from "@/components/baseBtn";
import { AppNavigationProps } from "@/navigators/navigation";
import WorkoutSelector from "@/components/workoutSelector";
import PackageSkeleton from "@/components/packageSkeleton";
import { IWorkoutPlans, useWorkoutPlans } from "@/hooks/useWorkoutPlans";
import { useTranslation } from "react-i18next";
import { showToast } from "@/components/toast";
import useRevenueCat from "@/hooks/useRevenueCat";
import Purchases, { PurchasesPackage } from "react-native-purchases";
import { useSubscribeExercise } from "@/hooks/useSubscribeExercise";
import { CommonActions } from "@react-navigation/native";

interface IWorkoutPlansWithRC extends IWorkoutPlans {
  rcPackage?: PurchasesPackage;
}

const WorkoutPlan = ({ navigation }: AppNavigationProps<"WorkoutPlan">) => {
  const { t, i18n } = useTranslation();
  const [active, setActive] = useState<number>();
  const { data, isPending } = useWorkoutPlans();

  const [item, setItem] = useState<IWorkoutPlansWithRC | undefined>();
  const [enhancedData, setEnhancedData] = useState<IWorkoutPlansWithRC[]>([]);
  const { currentOffering, customerInfo } = useRevenueCat();
  const [isRevenueCatLoading, setIsRevenueCatLoading] = useState(false);

  // Also fix the onError callback to prevent infinite loops
  const { isPending: subPending, mutate: subExercise } = useSubscribeExercise({
    onSuccess() {
      if (Platform.OS === "ios") {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "MainTab" }],
          })
        );
      }
    },
    onError(err: any) {
      console.log("SubExercise error:", err);
      // Prevent infinite loops by not calling setState repeatedly
      if (err?.errors?.[0]?.message) {
        showToast("errorToast", err.errors[0].message, "top");
      } else {
        showToast("errorToast", "Subscription failed", "top");
      }
      // Don't trigger any other state updates that could cause loops
    },
  });

  // ...existing code...

  const handleItemClicked = React.useCallback(
    (item: IWorkoutPlans) => {
      const enriched = enhancedData.find((d) => d.id === item.id);
      if (Platform.OS === "ios" && !enriched?.rcPackage) {
        showToast(
          "errorToast",
          "This plan is not available for purchase",
          "top"
        );
        return;
      }
      setActive(Number(item.id));
      setItem(enriched || item); // Android = original, iOS = enriched
      
      // Navigate directly to package details
      if (!item.pricings) {
        showToast("errorToast", "Please select a plan", "top");
        return;
      }
      navigation.navigate("PackageDetails", {
        id: Number(item.id),
      });
    },
    [enhancedData, navigation]
  );

  // ...existing code...

  // ...existing code...

  useEffect(() => {
    if (!data) {
      setEnhancedData([]);
      return;
    }

    if (Platform.OS === "ios") {
      setIsRevenueCatLoading(true);
    }

    if (Platform.OS === "ios" && currentOffering?.availablePackages) {
      console.log("=== RevenueCat Package Matching Debug ===");

      const updatedData = data.map((backendItem): IWorkoutPlansWithRC => {
        const matchingRcPackage = currentOffering.availablePackages.find(
          (rcPackage) => {
            const productId = rcPackage.product.identifier.toLowerCase();
            const productTitle = rcPackage.product.title.toLowerCase();

            return (
              backendItem.pricings?.some(
                (pricing) =>
                  String(pricing.package_id).toLowerCase() === productId ||
                  String(pricing.id).toLowerCase() === productId
              ) ||
              backendItem.name.toLowerCase() === productTitle ||
              productId.includes(backendItem.name.toLowerCase())
            );
          }
        );

        if (matchingRcPackage) {
          console.log(
            `✅ Match found: ${backendItem.name} <-> ${matchingRcPackage.product.identifier}`
          );
        } else {
          console.log(
            `❌ No RC package found for: ${backendItem.name} (ID: ${backendItem.id})`
          );
        }

        return {
          ...backendItem,
          rcPackage: matchingRcPackage ?? undefined, // only set for iOS
        };
      });

      setEnhancedData(updatedData);
      setIsRevenueCatLoading(false);
    } else {
      // Android → leave as is
      setEnhancedData(data.map((item) => ({ ...item })));
      setIsRevenueCatLoading(false);
    }
  }, [currentOffering, data]);

  // ...existing code...

  const handlePurchase = async (selectedItem: IWorkoutPlans) => {
    try {
      if (!selectedItem.rcPackage) {
        showToast("errorToast", "Invalid package selected", "top");
        return;
      }

      // Check if user is already subscribed before attempting purchase
      if (
        customerInfo?.entitlements.active &&
        Object.keys(customerInfo.entitlements.active).length > 0
      ) {
        console.log(
          "User already has active subscription:",
          Object.keys(customerInfo.entitlements.active)
        );

        console.log(
          "User wants to upgrade/change plan. Attempting purchase..."
        );
        // Don't restore - let them upgrade/change their plan
        // Continue to purchase flow instead of returning
      }

      const purchaseResult = await Purchases.purchasePackage(
        selectedItem.rcPackage
      );

      console.log("Purchase result:", purchaseResult);

      // Check if the purchase was successful and user has active entitlements
      const hasActiveEntitlements =
        purchaseResult.customerInfo.entitlements.active &&
        Object.keys(purchaseResult.customerInfo.entitlements.active).length > 0;

      if (hasActiveEntitlements) {
        console.log("Purchase successful, active entitlements found");
        showToast("successToast", "Subscription updated successfully!", "top");

        // Call backend API with the NEW selected package (not the old one)
        subExercise({
          package_id: Number(selectedItem.pricings[0].package_id),
          pricing_id: selectedItem.pricings[0].id,
          payment_method: "iap",
          app_user_id: customerInfo?.originalAppUserId,
          coupon_code: undefined,
          apple_receipt: "a",
          expected_entitlement: Object.keys(
            purchaseResult.customerInfo.entitlements.active
          )[0],
        });
      } else {
        console.log("Purchase completed but no active entitlements found");
        showToast(
          "errorToast",
          "Purchase completed but subscription not active",
          "top"
        );
      }
    } catch (error: any) {
      console.error("Purchase error:", error);

      // Handle specific error cases
      if (error.userCancelled) {
        console.log("User cancelled purchase");
        showToast("errorToast", "Purchase cancelled", "top");
      } else if (error.code === "PURCHASE_NOT_ALLOWED_ERROR") {
        console.log("Purchases not allowed on device");
        showToast("errorToast", "Purchases not allowed on this device", "top");
      } else if (error.code === "PAYMENT_PENDING_ERROR") {
        console.log("Payment is pending");
        showToast("errorToast", "Payment is pending", "top");
      } else if (error.code === "PRODUCT_ALREADY_PURCHASED_ERROR") {
        console.log("Product already purchased");

        // Check if this is the SAME product they already have
        const currentEntitlements = Object.keys(
          customerInfo?.entitlements.active || {}
        );
        const isUpgrade = !currentEntitlements.some((entitlement) =>
          entitlement.toLowerCase().includes(selectedItem.name.toLowerCase())
        );

        if (isUpgrade) {
          // They're trying to upgrade - show error since they already own this specific product
          showToast(
            "errorToast",
            "You already own this subscription plan",
            "top"
          );
        } else {
          // They're trying to buy the same plan they already have - restore it
          try {
            subExercise({
              package_id: Number(selectedItem.pricings[0].package_id),
              pricing_id: selectedItem.pricings[0].id,
              payment_method: "iap",
              app_user_id: customerInfo?.originalAppUserId,
              coupon_code: undefined,
              apple_receipt: "a",
              expected_entitlement: currentEntitlements[0],
            });

            showToast(
              "successToast",
              "Subscription restored successfully!",
              "top"
            );
          } catch (restoreError) {
            showToast("errorToast", "Failed to restore subscription", "top");
          }
        }
      } else if (error.code === "RECEIPT_ALREADY_IN_USE_ERROR") {
        console.log("Receipt already in use");
        showToast(
          "errorToast",
          "This purchase is already associated with another account",
          "top"
        );
      } else {
        console.log("Unknown purchase error:", error.message);
        showToast("errorToast", error.message || "Purchase failed", "top");
      }
    }
  };

  // Update the restore function to not automatically select the first item
  const handleRestorePurchases = async () => {
    try {
      console.log("Restoring purchases...");
      const restoredCustomerInfo = await Purchases.restorePurchases();

      if (
        restoredCustomerInfo.entitlements.active &&
        Object.keys(restoredCustomerInfo.entitlements.active).length > 0
      ) {
        console.log(
          "Active entitlements found after restore:",
          Object.keys(restoredCustomerInfo.entitlements.active)
        );

        showToast("successToast", "Purchases restored successfully!", "top");

        // Navigate to main tab since they have active subscriptions
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "MainTab" }],
          })
        );
      } else {
        showToast("errorToast", "No purchases found to restore", "top");
      }
    } catch (error: any) {
      console.error("Restore error:", error);
      showToast("errorToast", "Failed to restore purchases", "top");
    }
  };

  // ...existing code...

  return (
    <View style={globalStyles.container}>
      <View style={styles.header}>
        <View style={[globalStyles.line2, styles.headerContent]}>
          <Text variant="poppins18black_semibold">{t("choose_fitness")}</Text>
          <RNBounceable
            style={globalStyles.line}
            onPress={() => navigation.navigate("Exercises", { id: active! })}
          >
            <Text me="s" variant="poppins14black_regular" color="gray">
              {t("show_exercises")}
            </Text>
            <Right color={theme.colors.black} />
          </RNBounceable>
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {isPending ? (
          <View style={styles.skeletonContainer}>
            <PackageSkeleton />
            <PackageSkeleton />
            <PackageSkeleton />
          </View>
        ) : (
          enhancedData?.map((item) => (
            <WorkoutSelector
              key={item.id}
              item={item}
              active={active}
              setActive={setActive}
              onItemSelected={handleItemClicked}
            />
          ))
        )}
        {Platform.OS === "ios" && (
          <View style={styles.restoreContainer}>
            <RNBounceable onPress={handleRestorePurchases}>
              <Text variant="poppins14black_regular" color="apptheme">
                {t("restore_purchases", "Restore Purchases")}
              </Text>
            </RNBounceable>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: "5%",
    paddingTop: "5%",
    paddingBottom: "3%",
  },
  headerContent: {
    marginTop: "2%",
  },
  scrollContent: {
    paddingHorizontal: "5%",
    paddingBottom: "5%",
  },
  skeletonContainer: {
    gap: 16,
  },
  restoreContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
});

export default WorkoutPlan;
