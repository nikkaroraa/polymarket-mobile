import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { HomeScreen, SearchScreen, PositionsScreen, BetScreen, RedeemScreen, SettingsScreen } from './src/screens';
import { hasApiKey, setApiKey } from './src/services/bankr';

const DEFAULT_API_KEY = 'bk_3A7LSCL48LWJ6GK6GB35WZ282MCMRAX6';

type Screen = 'home' | 'search' | 'positions' | 'bet' | 'redeem' | 'settings';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedMarket, setSelectedMarket] = useState('');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function init() {
      const exists = await hasApiKey();
      if (!exists) await setApiKey(DEFAULT_API_KEY);
      setIsReady(true);
    }
    init();
  }, []);

  const handleNavigate = (screen: string) => setCurrentScreen(screen as Screen);
  const handleSelectMarket = (market: string) => { setSelectedMarket(market); setCurrentScreen('bet'); };
  const handleBack = () => { setCurrentScreen('home'); setSelectedMarket(''); };

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={styles.loadingText}>Loading...</Text>
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      {currentScreen === 'home' && <HomeScreen onNavigate={handleNavigate} />}
      {currentScreen === 'search' && <SearchScreen onBack={handleBack} onSelectMarket={handleSelectMarket} />}
      {currentScreen === 'positions' && <PositionsScreen onBack={handleBack} />}
      {currentScreen === 'bet' && <BetScreen onBack={handleBack} initialMarket={selectedMarket} />}
      {currentScreen === 'redeem' && <RedeemScreen onBack={handleBack} />}
      {currentScreen === 'settings' && <SettingsScreen onBack={handleBack} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  loadingContainer: { flex: 1, backgroundColor: '#0f0f1a', alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: '#888', fontSize: 14, marginTop: 12 },
});
