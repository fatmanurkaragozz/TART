import React from 'react';
import { BookOpen, User } from 'lucide-react-native';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2C2C28",
        tabBarInactiveTintColor: "#9B9B8F",
        tabBarStyle: {
          backgroundColor: "#F5F5F0",
          borderTopWidth: 1,
          borderTopColor: "#D4D2C8",
        },
        headerStyle: {
          backgroundColor: "#FAFAF5",
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: "#D4D2C8",
        },
        headerTitleStyle: { 
          fontFamily: 'Courier', 
          fontWeight: 'bold',
          color: "#2C2C28"
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Keşfet',
          tabBarIcon: ({ color }) => <BookOpen size={24} color={color} style={{ marginBottom: -3 }} />,
          headerTitle: 'TART',
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <User size={24} color={color} style={{ marginBottom: -3 }} />,
          headerTitle: 'Profilim',
        }}
      />
    </Tabs>
  );
}
