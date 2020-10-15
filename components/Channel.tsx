import React, { useEffect, useState } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Button, List, TextInput } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { sb } from "../lib/sendbird";
import { Text, View } from "../components/Themed";
import { ChannelNavigatorParamList } from "../types";
import { OpenChannel, UserMessage } from "sendbird";
import { FlatList } from "react-native";
import styles, {
  messageInputStyles,
  messageListStyles,
  sendButtonStyles,
} from "./Channel.styles";

const Channel = () => {
  const [channel, setChannel] = useState<OpenChannel>();
  const [messages, setMessages] = useState<UserMessage[]>([]);

  const route = useRoute<
    RouteProp<ChannelNavigatorParamList, "ChannelScreen">
  >();

  const handleNewMessage = (message: UserMessage) => {
    setMessages([message, ...messages]);
  };

  useEffect(() => {
    sb.connect("sean", () => {
      sb.OpenChannel.getChannel(route.params.url, (openChannel) => {
        openChannel.enter(() => {
          let messageListQuery = openChannel.createPreviousMessageListQuery();
          messageListQuery.messageTypeFilter = 0; // "user"?
          messageListQuery.limit = 10;
          messageListQuery.reverse = true;

          messageListQuery.load((messageList, error) => {
            setChannel(openChannel);
            setMessages(messageList as UserMessage[]);
          });
        });
      });
    });
  }, []);

  useEffect(() => {
    if (channel && messages) {
      const channelHandler = new sb.ChannelHandler();
      channelHandler.onMessageReceived = (channel, message) => {
        if (message.messageType === "user") {
          handleNewMessage(message);
        }
      };
      console.log("Adding channel handler");
      sb.addChannelHandler(channel.url, channelHandler);

      return () => {
        console.log("Removing channel handler");
        sb.removeChannelHandler(channel.url);
      };
    }
  }, [channel, messages]);

  return (
    <View style={styles}>
      {messages && <MessageList messages={messages} />}
      {channel && (
        <MessageInput channel={channel} onNewMessage={handleNewMessage} />
      )}
    </View>
  );
};

interface MessageListProps {
  messages: UserMessage[];
}

const MessageList = (props: MessageListProps) => {
  return (
    <View style={messageListStyles}>
      <FlatList<UserMessage>
        data={props.messages}
        keyExtractor={(item, index) => item.messageId.toString()}
        renderItem={({ item }) => (
          <List.Item title={item.sender.userId} description={item.message} />
        )}
      />
    </View>
  );
};

interface MessageInputProps {
  channel: OpenChannel;
  onNewMessage: (message: UserMessage) => void;
}

const MessageInput = (props: MessageInputProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { control, handleSubmit, errors, reset } = useForm({
    defaultValues: { input: "" },
  });

  const onSubmit = async (data: { input: string }) => {
    setLoading(true);

    let params = new sb.UserMessageParams();
    params.message = data.input;
    props.channel.sendUserMessage(params, (message, error) => {
      reset();
      props.onNewMessage(message as UserMessage);
      setLoading(false);
    });
  };

  return (
    <View style={messageInputStyles}>
      <Controller
        control={control}
        render={({ onChange, onBlur, value }) => (
          <TextInput
            dense
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

      <Button
        style={sendButtonStyles}
        mode="contained"
        disabled={loading}
        onPress={handleSubmit(onSubmit)}
      >
        Send
      </Button>
    </View>
  );
};

export default Channel;
