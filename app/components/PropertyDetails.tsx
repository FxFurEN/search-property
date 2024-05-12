import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Pressable, StyleSheet, PanResponder } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function PropertyDetails({ isVisible, children, onClose }) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setOffset(0); 
    }
  }, [isVisible]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      const newOffset = offset + gestureState.dy;
      if (newOffset >= 0) {
        setOffset(newOffset);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 100 || offset >= 300) {
        onClose();
      } else {
        setOffset(0);
      }
    },
  });

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View style={[styles.modalContent, { transform: [{ translateY: offset }] }]} {...panResponder.panHandlers}>
          <Pressable onPress={onClose}>
            <MaterialIcons name="close" color="#fff" size={22} />
          </Pressable>
        {children}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    height: '55%',
    width: '100%',
    backgroundColor: 'white',
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    position: 'absolute',
    bottom: 0,
  },
  title: {
    color: '#fff',
    fontSize: 16,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 50,
    paddingVertical: 20,
  },
});
