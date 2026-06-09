import React, { useEffect, useState } from 'react';
import { BookOpen, User } from 'lucide-react-native';
import { Tabs, useRouter } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import authService from '../../src/services/authService';

export default function TabLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await authService.getToken();
      if (!token) {
        setIsAuthenticated(false);
        router.replace('/');
      } else {
        setIsAuthenticated(true);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F0' }}>
        <ActivityIndicator size="large" color="#6B6B5F" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

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
