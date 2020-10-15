import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FAB, List } from "react-native-paper";
import { OpenChannel } from "sendbird";
import styles, { addButtonStyles } from "./ChannelList.styles";
import { sb } from "../lib/sendbird";
import { Text, View } from "../components/Themed";

const ChannelList = () => {
  const [channels, setChannels] = useState<OpenChannel[]>([]);
  const navigation = useNavigation();

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

  const handlePressChannel = (channel: OpenChannel) => {
    navigation.navigate("ChannelScreen", { url: channel.url });
  };

  return (
    <View style={styles}>
      <FlatList<OpenChannel>
        data={channels}
        keyExtractor={(item, index) => item.url}
        renderItem={({ item }) => (
          <View>
            <List.Item
              title={item.name}
              description={item.url}
              onPress={() => handlePressChannel(item)}
              descriptionNumberOfLines={1}
              descriptionEllipsizeMode="tail"
            />
          </View>
        )}
      />
      <FAB icon="plus" onPress={handleAddChannel} style={addButtonStyles} />
    </View>
  );
};

export default ChannelList;
