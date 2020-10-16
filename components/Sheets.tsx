import React from "react";
import Animated from "react-native-reanimated";
import BottomSheet from "reanimated-bottom-sheet";
import { Text, View } from "./Themed";
import styles, { sheetsContentStyles } from "./Sheets.styles";
import { useRef } from "react";

const Sheets = () => {
  const sheetRef = useRef(null);
  const sheet2Ref = useRef(null);

  const renderContent = (x: number) => {
    return (
      <View style={sheetsContentStyles}>
        <Text>{x}: Swipe down to close</Text>
      </View>
    );
  };

  return (
    <View style={styles}>
      <Text>Hey</Text>
      <BottomSheet
        ref={sheetRef}
        initialSnap={0}
        snapPoints={["81%", "20%"]}
        enabledBottomClamp
        renderContent={() => renderContent(1)}
      />
      <BottomSheet
        ref={sheet2Ref}
        initialSnap={0}
        snapPoints={["75%", "10%"]}
        borderRadius={10}
        enabledBottomClamp
        renderContent={() => renderContent(2)}
      />
    </View>
  );
};

export default Sheets;
