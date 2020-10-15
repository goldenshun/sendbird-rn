import React, { useEffect, useRef, useState } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Button, List, TextInput } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { sb } from "../lib/sendbird";
import { Text, View } from "../components/Themed";
import { ChannelNavigatorParamList } from "../types";
import { OpenChannel, PreviousMessageListQuery, UserMessage } from "sendbird";
import { FlatList } from "react-native";
import styles, {
  messageInputStyles,
  messageListStyles,
  sendButtonStyles,
} from "./Channel.styles";
import { FlatListProps } from "react-native";

const Channel = () => {
  const [channel, setChannel] = useState<OpenChannel>();
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [messageListQuery, setMessageListQuery] = useState<
    PreviousMessageListQuery
  >();

  const route = useRoute<
    RouteProp<ChannelNavigatorParamList, "ChannelScreen">
  >();

  const handleNewMessage = (message: UserMessage) => {
    setMessages([message, ...messages]);
  };

  const loadPreviousMessages = () => {
    if (messageListQuery) {
      if (messageListQuery.hasMore) {
        messageListQuery.load((messageList, error) => {
          setMessages([...messages, ...(messageList as UserMessage[])]);
        });
      }
    }
  };

  useEffect(() => {
    loadPreviousMessages();
  }, [messageListQuery]);

  useEffect(() => {
    sb.connect("sean", () => {
      sb.OpenChannel.getChannel(route.params.url, (openChannel) => {
        openChannel.enter(() => {
          let messageListQuery = openChannel.createPreviousMessageListQuery();
          messageListQuery.messageTypeFilter = 0; // "user"?
          messageListQuery.limit = 20;
          messageListQuery.reverse = true;

          setMessageListQuery(messageListQuery);
          setChannel(openChannel);
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
      {messages && (
        <MessageList messages={messages} onEndReached={loadPreviousMessages} />
      )}
      {channel && (
        <MessageInput channel={channel} onNewMessage={handleNewMessage} />
      )}
    </View>
  );
};

interface MessageListProps {
  messages: UserMessage[];
  onEndReached: FlatListProps<UserMessage>["onEndReached"];
}

const MessageList = (props: MessageListProps) => {
  return (
    <FlatList<UserMessage>
      style={messageListStyles}
      inverted
      data={props.messages}
      keyExtractor={(item, index) => item.messageId.toString()}
      renderItem={({ item }) => (
        <List.Item
          key={item.messageId}
          title={item.sender.userId}
          description={item.message}
        />
      )}
      onEndReachedThreshold={0.1}
      onEndReached={props.onEndReached}
    />
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
