import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

export interface AppNavigationProps<RouteName extends keyof AppRoutes> {
  navigation: StackNavigationProp<AppRoutes, RouteName>;
  route: RouteProp<AppRoutes, RouteName>;
}

export type AppRoutes = {
  Login: undefined;
  Onboard: undefined;
  Signup: undefined;
  Gender: {token: string};
  Age: {token: string; gender: 'male' | 'female'};
  Weight: {token: string; gender: 'male' | 'female'; age: string};
  Height: {
    token: string;
    gender: 'male' | 'female';
    age: string;
    weight: number;
  };
  Sport: {
    token: string;
    gender: 'male' | 'female';
    age: string;
    weight: number;
    height: string;
  };
  About: {
    token: string;
    gender: 'male' | 'female';
    age: string;
    weight: number;
    height: string;
    sport: number;
  };
  Success: {
    token: string;
    gender: 'male' | 'female';
    age: string;
    weight: number;
    height: string;
    sport: number;
    about: {goal: string; time: string; location: string};
  };
  SuccessHome: undefined;
  VerifyIdentity: {email?: string; forget?: boolean};
  VerificationOtp: {
    email?: string;
    method?: 'email' | 'phone';
    forget?: boolean;
  };
  ResetPassword: {otp: number; email: string};
  MainTab: undefined;
  Notification: undefined;
  Home: undefined;
  Meals: undefined;
  WorkoutPlan: undefined;
  Workout?: {id: number; home_date: string};
  Leaderboard: {id: number; label: string};
  Profile: undefined;
  Subscription: undefined;
  Menu: undefined;
  DeliveryTime: {meal_plan_id: number};
  MyMeals: undefined;
  Payment: {
    pricing_id?: number;
    package_id?: number;
    meal_plan_id?: number;
    delivery_id?: number | undefined;
    pay_details: {
      title: string;
      price: number;
      number_of_days: number;
    };
    address?: {
      street: string;
      city: string;
      address_label?: string;
      building: string;
      postal_code: string;
      delivery_notes?: string;
      state: string;
    };
  };
  Dish: {id: number};
  Exercise: {id: number; workout_id?: number};
  Info: undefined;
  Info2: undefined;
  Info3: undefined;
  Exercises: {id: number};
  Location: {meal_plan_id: number; delivery_id: number | undefined};
  TermsnPolicy: {policy: boolean};
  Faq: undefined;
  Order: undefined;
  OrderDetail: {id: number};
  Chat: undefined;
};
