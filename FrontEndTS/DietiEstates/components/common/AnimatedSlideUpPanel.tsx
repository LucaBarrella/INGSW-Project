import React, { useEffect, useState } from 'react';
import { View, Modal, Pressable, useWindowDimensions } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS } from 'react-native-reanimated';
import { useThemeColor } from '../../hooks/useThemeColor';

interface AnimatedSlideUpPanelProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  initialHeightRatio?: number;
  panelStyle?: object;
}

const AnimatedSlideUpPanel: React.FC<AnimatedSlideUpPanelProps> = ({
  isVisible,
  onClose,
  children,
  initialHeightRatio = 0.7,
  panelStyle = {},
}) => {
  const { height: windowHeight } = useWindowDimensions();
  const [panelHeight, setPanelHeight] = useState(windowHeight * initialHeightRatio);
  
  const translateY = useSharedValue(windowHeight);
  const opacity = useSharedValue(0);
  
  const backgroundColor = useThemeColor({}, 'propertyCardBackground');
  const borderColor = useThemeColor({}, 'border');
  const subduedText = useThemeColor({}, 'propertyCardDetail');


  useEffect(() => {
    if (isVisible) {
      translateY.value = withTiming(0, { duration: 300 });
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      translateY.value = withTiming(windowHeight, { duration: 300 });
      opacity.value = withTiming(0, { duration: 300 });
    }
  }, [isVisible, windowHeight]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  const dragGesture = Gesture.Pan()
    .onUpdate((event) => {
      const newY = translateY.value + event.translationY;
      if (newY > 0 && newY < windowHeight) {
        translateY.value = newY;
      }
    })
    .onEnd((event) => {
      const velocity = event.velocityY;
      const position = translateY.value;
      
      if (velocity > 300 || position > windowHeight * 0.3) {
        translateY.value = withTiming(windowHeight, { duration: 300 }, () => {
          runOnJS(onClose)();
        });
        opacity.value = withTiming(0, { duration: 300 });
      } else {
        translateY.value = withSpring(0, { damping: 15, stiffness: 300 });
      }
    });

  const handleLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setPanelHeight(height);
  };

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/50 justify-end"
        onPress={onClose}
      >
        <Pressable>
        <Animated.View
          className="rounded-t-3xl border-t border-l border-r overflow-hidden"
          style={[
            animatedStyle,
            {
              height: panelHeight,
              backgroundColor: backgroundColor,
              borderColor: borderColor,
            },
            panelStyle,
          ]}
          onLayout={handleLayout}
        >
          <GestureDetector gesture={dragGesture}>
            <Animated.View
              className="w-10 h-1 rounded-full self-center mt-2 mb-4"
              style={{
                backgroundColor: subduedText,
              }}
            >
              <View className="w-8 h-0.75 rounded-full self-center" />
            </Animated.View>
          </GestureDetector>
          
          <View className="flex-1 px-4 pt-2">
            {children}
          </View>
        </Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};


export default AnimatedSlideUpPanel;