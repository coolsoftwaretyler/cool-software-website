```tsx
/**
 * https://coolsoftware.dev/blog/hide-tab-bar-expo-router-nested-stack/
 */
import React, { useCallback, useEffect } from "react";
import { BottomTabBar, BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useFancyTabBar } from "@hooks/FancyTabBarContext";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, View } from "react-native";
import { grey50, richBlack, white } from "@constants/Colors";

const FancyTabBar: React.FC<BottomTabBarProps> = (props: BottomTabBarProps) => {
  const { bottom } = useSafeAreaInsets();
  const { isTabBarVisible } = useFancyTabBar();
  const translateY = useSharedValue(0);
  const { state } = props;
  const { index } = state;

  const firstIndicatorColor = {
    backgroundColor: index === 0 ? richBlack : grey50,
  };
  const secondIndicatorColor = {
    backgroundColor: index === 1 ? richBlack : grey50,
  };
  const thirdIndicatorColor = {
    backgroundColor: index === 2 ? richBlack : grey50,
  };
  const fourthIndicatorColor = {
    backgroundColor: index === 3 ? richBlack : grey50,
  };

  const TAB_BAR_HEIGHT = bottom + 56;

  useEffect(() => {
    onAnimationStart();
    translateY.value = withTiming(
      isTabBarVisible ? 0 : TAB_BAR_HEIGHT,
      {
        duration: 250,
      },
      () => {
        runOnJS(onAnimationEnd)();
      }
    );
  }, [isTabBarVisible, translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const onAnimationStart = useCallback(() => {
    if (isTabBarVisible) {
    }
  }, [isTabBarVisible]);

  const onAnimationEnd = useCallback(() => {
    if (!isTabBarVisible) {
    }
  }, [isTabBarVisible]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.animatedContainer,
          { height: TAB_BAR_HEIGHT },
          animatedStyle,
        ]}
      >
        <View style={styles.indicatorContainer}>
          <View style={styles.indicator}>
            <View style={[styles.innerIndicator, firstIndicatorColor]}></View>
          </View>
          <View style={styles.indicator}>
            <View style={[styles.innerIndicator, secondIndicatorColor]}></View>
          </View>
          <View style={styles.indicator}>
            <View style={[styles.innerIndicator, thirdIndicatorColor]}></View>
          </View>
          <View style={styles.indicator}>
            <View style={[styles.innerIndicator, fourthIndicatorColor]}></View>
          </View>
        </View>
        <BottomTabBar {...props} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 0,
    position: "relative",
    width: "100%",
  },
  animatedContainer: {
    position: "absolute",
    width: "100%",
    backgroundColor: white,
    bottom: 0,
  },
  indicatorContainer: {
    backgroundColor: grey50,
    height: 2,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  indicator: {
    height: 2,
    backgroundColor: grey50,
    flexDirection: "row",
    justifyContent: "center",
    width: "25%",
  },
  innerIndicator: {
    width: "50%",
    height: 2,
  },
});

export default FancyTabBar;
```

```tsx
/**
 * https://coolsoftware.dev/blog/hide-tab-bar-expo-router-nested-stack/
 */
import React, { createContext, useContext, useState } from "react";

const FancyTabBarContext = createContext({
  isTabBarVisible: true,
  hideTabBar: () => {},
  showTabBar: () => {},
});

/**
 * This custom hook will provide the context to its consuming component.
 * This is what we give to the `FancyTabBar` so it can know if it should render or not.
 */
export const useFancyTabBar = () => {
  return useContext(FancyTabBarContext);
};

export const FancyTabBarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);

  const value = {
    isTabBarVisible,
    hideTabBar: () => setIsTabBarVisible(false),
    showTabBar: () => setIsTabBarVisible(true),
  };

  return (
    <FancyTabBarContext.Provider value={value}>
      {children}
    </FancyTabBarContext.Provider>
  );
};
```
