import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { FAB, List } from "react-native-paper";
import styles from "./ChannelList.styles";
import { sb } from "../lib/sendbird";
import { Text, View } from "../components/Themed";
import { OpenChannel } from "sendbird";
import { Item } from "react-native-paper/lib/typescript/src/components/List/List";

const ChannelList = () => {
  const [channels, setChannels] = useState<OpenChannel[]>([]);

  useEffect(() => {
    sb.connect("sean", () => {
      const openChannelListQuery = sb.OpenChannel.createOpenChannelListQuery();
      openChannelListQuery.next((openChannels, error) => {
        setChannels(openChannels);
      });
    });
  }, []);

  const handleAddChannel = () => {
    sb.OpenChannel.createChannel((openChannel, error) => {
      console.log({ openChannel });
    });
  };

  const handlePressChannel = () => {
    console.log("handlePressChannel");
  };

  return (
    <View style={styles}>
      <FlatList<OpenChannel>
        data={channels}
        keyExtractor={(item, index) => item.url}
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
            description={item.url}
            onPress={handlePressChannel}
          />
        )}
      />
      <Text>Add a new channel</Text>
      <FAB icon="plus" onPress={handleAddChannel} />
    </View>
  );
};

export default ChannelList;
