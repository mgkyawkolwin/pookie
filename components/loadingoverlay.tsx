import React from "react";
import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";

interface LoadingOverlayProps {
  visible: boolean;
}

export default function LoadingOverlay({ visible }: LoadingOverlayProps) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      statusBarTranslucent
    >
      <View style={styles.backdrop}>
        <View style={styles.spinnerContainer}>
          <Text style={styles.text}>로딩 중</Text>
          <ActivityIndicator size="large" color="#0a0" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)", // semi-transparent background
    justifyContent: "center",
    alignItems: "center",
  },
  spinnerContainer: {
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#060",
    borderRadius: 12,
    padding: 24,
    elevation: 5, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  text: {
    marginBottom: 16,
    fontSize: 16,
    fontWeight: "bold",
  }
});
