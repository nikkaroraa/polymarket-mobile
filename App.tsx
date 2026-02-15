import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { setApiKey, getApiKey } from './src/api/bankr';
import { HomeScreen } from './src/screens/HomeScreen';
import { MarketsScreen } from './src/screens/MarketsScreen';
import { BetScreen } from './src/screens/BetScreen';
import { PositionsScreen } from './src/screens/PositionsScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

type TabId = 'home' | 'markets' | 'bet' | 'positions' | 'settings';

const TABS: { id: TabId; emoji: string; label: string }[] = [
  { id: 'home', emoji: '💰', label: 'Balance' },
  { id: 'markets', emoji: '🔍', label: 'Markets' },
  { id: 'bet', emoji: '🎯', label: 'Bet' },
  { id: 'positions', emoji: '📊', label: 'Positions' },
  { id: 'settings', emoji: '⚙️', label: 'Settings' },
];

// Pre-configured API key for convenience
const DEFAULT_API_KEY = 'bk_3A7LSCL48LWJ6GK6GB35WZ282MCMRAX6';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Auto-configure API key if not set
    async function init() {
      const existingKey = await getApiKey();
      if (!existingKey) {
        await setApiKey(DEFAULT_API_KEY);
      }
      setInitialized(true);
    }
    init();
  }, []);

  if (!initialized) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'markets':
        return <MarketsScreen />;
      case 'bet':
        return <BetScreen />;
      case 'positions':
        return <PositionsScreen />;
      case 'settings':
        return <SettingsScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f1a" />
      
      {/* Main content */}
      <View style={styles.content}>
        {renderScreen()}
      </View>

      {/* Tab bar */}
      <View style={styles.tabBar}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.tabEmoji}>{tab.emoji}</Text>
            <Text style={[styles.tabLabel, activeTab === tab.id && styles.activeLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1a1a2e',
    borderTopWidth: 1,
    borderTopColor: '#2d2d44',
    paddingBottom: 20, // Extra padding for iPhone home indicator
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    // Active styling handled by children
  },
  tabEmoji: {
    fontSize: 22,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 10,
    color: '#6b7280',
  },
  activeLabel: {
    color: '#818cf8',
    fontWeight: '600',
  },
});
