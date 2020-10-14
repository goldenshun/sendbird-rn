export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
};

export type BottomTabParamList = {
  TabOne: undefined;
  TabTwo: undefined;
  Channels: undefined;
};

export type TabOneParamList = {
  TabOneScreen: undefined;
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
