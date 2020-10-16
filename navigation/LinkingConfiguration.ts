import * as Linking from "expo-linking";

export default {
  prefixes: [Linking.makeUrl("/")],
  config: {
    screens: {
      Root: {
        screens: {
          Sheets: {
            screens: {
              SheetsScreen: "sheets",
            },
          },
          TabTwo: {
            screens: {
              TabTwoScreen: "two",
            },
          },
          Channels: {
            screens: {
              ChannelListScreen: "channels",
              ChannelScreen: "channel",
            },
          },
        },
      },
      NotFound: "*",
    },
  },
};
