import React, { useEffect, useState } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Button, TextInput } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import styles from "./ChannelList.styles";
import { sb } from "../lib/sendbird";
import { Text, View } from "../components/Themed";
import { ChannelNavigatorParamList } from "../types";
import { OpenChannel } from "sendbird";

const Channel = () => {
  const [channel, setChannel] = useState<OpenChannel>();
  const route = useRoute<
    RouteProp<ChannelNavigatorParamList, "ChannelScreen">
  >();

  useEffect(() => {
    sb.connect("sean", () => {
      sb.OpenChannel.getChannel(route.params.url, (openChannel) => {
        openChannel.enter(() => {
          setChannel(openChannel);
        });
      });
    });
  }, []);

  return (
    <View style={styles}>
      <Text>Channel</Text>
      {channel && <MessageInput channel={channel} />}
    </View>
  );
};

interface MessageInputProps {
  channel: OpenChannel;
}

const MessageInput = (props: MessageInputProps) => {
  const { control, handleSubmit, errors } = useForm({
    defaultValues: { input: "" },
  });

  const onSubmit = async (data: { input: string }) => {
    let params = new sb.UserMessageParams();
    params.message = data.input;
    props.channel.sendUserMessage(params, (message, error) => {
      console.log(message);
    });
  };

  return (
    <View>
      <Controller
        control={control}
        render={({ onChange, onBlur, value }) => (
          <TextInput
            mode="outlined"
            placeholder="Enter a message"
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
            value={value}
          />
        )}
        name="input"
        rules={{ required: true }}
      />
      {errors.input && <Text>This is required.</Text>}

      <Button mode="contained" onPress={handleSubmit(onSubmit)}>
        Send
      </Button>
    </View>
  );
};

export default Channel;
