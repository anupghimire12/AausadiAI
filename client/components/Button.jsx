import * as React from 'react';
import { Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Entypo } from '@expo/vector-icons';

const Button = ({
  title,
  onPress,
  icon,
  color,           // icon color override
  backgroundColor, // button background override
  textColor,       // text color override
  style,           // any additional container styles
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.button,
        { backgroundColor: backgroundColor || '#4A90E2' },
        style,
      ]}
    >
      <Text style={[styles.text, { color: textColor || '#FFF' }]}>
        {title}
      </Text>
      {icon ? (
        <Entypo
          name={icon}
          size={24}
          color={color || textColor || '#FFF'}
          style={styles.icon}
        />
      ) : null}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    paddingHorizontal: 22,
    borderRadius: 12,
    backgroundColor: '#2563eb', // modern blue as default

    // Subtle shadow for both platforms
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,

    // Minimal border for contrast
    borderWidth: 1,
    borderColor: 'rgba(37,99,235,0.08)',
  },
  text: {
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 0.5,
    color: '#fff',
  },
  icon: {
    marginLeft: 10,
  },
});
