// app/(tabs)/_layout.tsx - ИСПРАВЛЕННАЯ ВЕРСИЯ
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Главная',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home'} color={color} />
          ),
        }}
      />
      {/* ИСПРАВЛЕНО: Используем 'gamepad' вместо 'gamecontroller' */}
      <Tabs.Screen
        name="games"
        options={{
          title: 'Игры',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'gamepad' : 'gamepad'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: 'Магазин',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'shopping-bag' : 'shopping-bag'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Статистика',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'bar-chart' : 'bar-chart'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}