import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "@/screens/home";
import Meals from "@/screens/meals";
import Profile from "@/screens/profile";
import Homeicon from "@/assets/svg/home.svg";
import Mealsicon from "@/assets/svg/burger.svg";
import Workouticon from "@/assets/svg/dumbbell.svg";
import Profileicon from "@/assets/svg/profile.svg";
import { Text, theme } from "@/components/theme";
import { AppRoutes } from "./navigation";
import WorkoutPlan from "@/screens/workout_plan";
import Workout from "@/screens/workout";
import { useCheckSubs } from "@/hooks/useCheckSubsrciption";
import MyMeals from "@/screens/my_meals";
import { useTranslation } from "react-i18next";

const Tab = createBottomTabNavigator<AppRoutes>();

const CustomTabBarIcon = ({
  focused,
  IconComponent,
  label,
}: {
  focused: boolean;
  IconComponent: ReactNode;
  label: string;
}) => {
  const iconColor = focused ? theme.colors.apptheme : theme.colors.mediumGray;
  return (
    <View style={styles.tabContainer}>
      <View style={styles.iconWrapper}>
        {focused && <View style={styles.semicircleBackground} />}
        {React.isValidElement(IconComponent) &&
          React.cloneElement(IconComponent as React.ReactElement, {
            color: iconColor, // Pass color prop only if supported
          })}
        {focused && <View style={styles.greenDot} />}
      </View>
      <Text
        fontSize={10}
        variant="poppins12black_regular"
        color={focused ? "apptheme" : "mediumGray"}
      >
        {label}
      </Text>
    </View>
  );
};

const MainTab = () => {
  const { data } = useCheckSubs();
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        headerShown: false,
        tabBarIcon: ({ focused }) => {
          let IconComponent;
          let label = "";

          switch (route.name) {
            case "Home":
              IconComponent = <Homeicon />;
              label = t("home");
              break;
            case "Meals":
              IconComponent = <Mealsicon />;
              label = t("meals");
              break;
            case "MyMeals":
              IconComponent = <Mealsicon />;
              label = t("meals");
              break;
            case "WorkoutPlan":
              IconComponent = <Workouticon />;
              label = t("work");
              break;
            case "Workout":
              IconComponent = <Workouticon />;
              label = t("work");
              break;
            case "Profile":
              IconComponent = <Profileicon />;
              label = t("profile");
              break;
          }

          return (
            <CustomTabBarIcon
              focused={focused}
              IconComponent={IconComponent}
              label={label}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      {data?.dietSubscription ? (
        <Tab.Screen name="MyMeals" component={MyMeals} />
      ) : (
        <Tab.Screen name="Meals" component={Meals} />
      )}
      {data?.fitnessSubscription ? (
        <Tab.Screen name="Workout" component={Workout} />
      ) : (
        <Tab.Screen name="WorkoutPlan" component={WorkoutPlan} />
      )}
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    backgroundColor: theme.colors.white,
    borderTopWidth: 0,
    elevation: 5,
  },
  tabContainer: {
    alignItems: "center",
    flex: 1,
  },
  semicircleBackground: {
    width: 48, // Adjust for size
    height: 24, // Half the width for a semicircle
    borderTopLeftRadius: 24, // Half the width for a perfect semicircle
    borderTopRightRadius: 24,
    backgroundColor: theme.colors.white, // Light green with transparency
    position: "absolute",
    top: -15, // Adjust the vertical positioning
    zIndex: -1, // Place behind the icon
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.lightGreen,
    position: "absolute",
    top: -5,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  iconWrapper: {
    justifyContent: "center", // Centers the icon and background vertically
    alignItems: "center",
    height: 40, // Ensure enough height for alignment adjustments
  },
});

export default MainTab;
