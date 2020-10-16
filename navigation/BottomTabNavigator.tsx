import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import SheetsScreen from "../screens/SheetsScreen";
import TabTwoScreen from "../screens/TabTwoScreen";
import ChannelTabScreen from "../screens/ChannelTabScreen";
import ChannelScreen from "../screens/ChannelScreen";
import {
  BottomTabParamList,
  SheetsNavigatorParamList,
  TabTwoParamList,
  ChannelNavigatorParamList,
} from "../types";

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Channels"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}
    >
      <BottomTab.Screen
        name="Channels"
        component={ChannelTabNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-code" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Sheets"
        component={SheetsNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-code" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="TabTwo"
        component={TabTwoNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-code" color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: string; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const SheetsStack = createStackNavigator<SheetsNavigatorParamList>();

function SheetsNavigator() {
  return (
    <SheetsStack.Navigator>
      <SheetsStack.Screen
        name="SheetsScreen"
        component={SheetsScreen}
        options={{ headerTitle: "Sheets" }}
      />
    </SheetsStack.Navigator>
  );
}

const TabTwoStack = createStackNavigator<TabTwoParamList>();

function TabTwoNavigator() {
  return (
    <TabTwoStack.Navigator>
      <TabTwoStack.Screen
        name="TabTwoScreen"
        component={TabTwoScreen}
        options={{ headerTitle: "Tab Two Title" }}
      />
    </TabTwoStack.Navigator>
  );
}

const ChannelTabStack = createStackNavigator<ChannelNavigatorParamList>();
function ChannelTabNavigator() {
  return (
    <ChannelTabStack.Navigator>
      <ChannelTabStack.Screen
        name="ChannelListScreen"
        component={ChannelTabScreen}
        options={{ headerTitle: "Channels" }}
      />
      <ChannelTabStack.Screen
        name="ChannelScreen"
        component={ChannelScreen}
        options={{ headerTitle: "Single Channel" }}
      />
    </ChannelTabStack.Navigator>
  );
}
