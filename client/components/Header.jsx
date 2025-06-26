import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import Svg, { Rect, Circle, Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const Header = ({
  title = 'AausadiAI',
}) => {
  const { width } = useWindowDimensions();

  // Responsive logo and title size
  const logoWidth = width > 400 ? 90 : 70;
  const logoHeight = width > 400 ? 90 : 70;
  const titleFontSize = width > 400 ? 38 : 30;

  return (
    <View style={styles.gradientBg}>
      <View style={styles.container}>
        {/* SVG Medicine Logo with advanced gradient and accent */}
        <Svg
          width={logoWidth}
          height={logoHeight}
          viewBox="0 0 90 90"
          style={styles.logo}
        >
          <Defs>
            <LinearGradient id="blueGradient" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#60a5fa" />
              <Stop offset="100%" stopColor="#2563eb" />
            </LinearGradient>
            <LinearGradient id="pinkGradient" x1="0" y1="1" x2="1" y2="0">
              <Stop offset="0%" stopColor="#f472b6" />
              <Stop offset="100%" stopColor="#fb7185" />
            </LinearGradient>
            <LinearGradient id="greenGradient" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#6ee7b7" />
              <Stop offset="100%" stopColor="#22d3ee" />
            </LinearGradient>
          </Defs>
          {/* Blue pill shape with gradient */}
          <Rect
            x="18"
            y="36"
            rx="22"
            ry="22"
            width="54"
            height="22"
            fill="url(#blueGradient)"
            opacity="0.95"
          />
          {/* Pink highlight */}
          <Rect
            x="18"
            y="36"
            rx="22"
            ry="22"
            width="27"
            height="22"
            fill="url(#pinkGradient)"
            opacity="0.55"
          />
          {/* Green highlight */}
          <Rect
            x="45"
            y="36"
            rx="22"
            ry="22"
            width="18"
            height="22"
            fill="url(#greenGradient)"
            opacity="0.45"
          />
          {/* Circle for tablet */}
          <Circle
            cx="45"
            cy="57"
            r="12"
            fill="#FFF"
            stroke="#2563eb"
            strokeWidth="2"
            opacity="0.96"
          />
          {/* Medicine cross */}
          <Path
            d="M45 51 v12 M39 57 h12"
            stroke="#fb7185"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </Svg>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { fontSize: titleFontSize }]}>
            {title}
          </Text>
          <Text style={styles.subtitle}>
            Your AI Medicine Companion
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  gradientBg: {
    backgroundColor: '#e0f2fe',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    paddingBottom: 8,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.13,
    shadowRadius: 18,
    elevation: 8,
    // Remove top padding/gap
    marginTop: 0,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 110,
    paddingHorizontal: 18,
    paddingTop: 0, // Remove top padding
    paddingBottom: 10,
    backgroundColor: 'transparent',
  },
  logo: {
    marginRight: 18,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: '900',
    color: '#2563eb',
    letterSpacing: 0.5,
    textAlign: 'left',
    textShadowColor: '#e0e7ef',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  subtitle: {
    color: '#fb7185',
    fontWeight: '600',
    fontSize: 15,
    marginTop: 2,
    letterSpacing: 0.2,
    textAlign: 'left',
  },
});
