export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
};

export type BottomTabParamList = {
  Sheets: undefined;
  TabTwo: undefined;
  Channels: undefined;
};

export type SheetsNavigatorParamList = {
  SheetsScreen: undefined;
};

export type TabTwoParamList = {
  TabTwoScreen: undefined;
};

export type ChannelNavigatorParamList = {
  ChannelListScreen: undefined;
  ChannelScreen: ChannelScreenParamList;
};

export type ChannelScreenParamList = {
  url: string;
};
