import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useBankr } from '../hooks/useBankr';

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const [balances, setBalances] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  const { loading, error, getBalances } = useBankr();

  const fetchBalances = async () => {
    const result = await getBalances();
    if (result) setBalances(result);
  };

  useEffect(() => { fetchBalances(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBalances();
    setRefreshing(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4f46e5" />}>
      <View style={styles.header}>
        <Text style={styles.title}>Polymarket</Text>
        <TouchableOpacity onPress={() => onNavigate('settings')}>
          <Ionicons name="settings-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <Card>
        <View style={styles.cardHeader}>
          <Ionicons name="wallet-outline" size={20} color="#4f46e5" />
          <Text style={styles.cardTitle}>Balances</Text>
        </View>
        {loading && !balances ? <Text style={styles.loadingText}>Loading...</Text>
          : error ? <Text style={styles.errorText}>{error}</Text>
          : <Text style={styles.balanceText}>{balances || 'No data'}</Text>}
      </Card>

      <View style={styles.actionsGrid}>
        <TouchableOpacity style={styles.actionCard} onPress={() => onNavigate('search')}>
          <Ionicons name="search" size={28} color="#4f46e5" />
          <Text style={styles.actionText}>Search Markets</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard} onPress={() => onNavigate('positions')}>
          <Ionicons name="pie-chart" size={28} color="#22c55e" />
          <Text style={styles.actionText}>My Positions</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard} onPress={() => onNavigate('bet')}>
          <Ionicons name="cash-outline" size={28} color="#f59e0b" />
          <Text style={styles.actionText}>Place Bet</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard} onPress={() => onNavigate('redeem')}>
          <Ionicons name="gift-outline" size={28} color="#ec4899" />
          <Text style={styles.actionText}>Redeem</Text>
        </TouchableOpacity>
      </View>

      <Button title="Refresh Balances" onPress={fetchBalances} loading={loading} style={styles.refreshButton} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  content: { padding: 16, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#fff' },
  loadingText: { color: '#888', fontSize: 14 },
  errorText: { color: '#ef4444', fontSize: 14 },
  balanceText: { color: '#e5e5e5', fontSize: 14, lineHeight: 22 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 16 },
  actionCard: { width: '47%', backgroundColor: '#1a1a2e', borderRadius: 12, padding: 20, alignItems: 'center', gap: 8, borderWidth: 1, borderColor: '#2a2a4a' },
  actionText: { color: '#fff', fontSize: 14, fontWeight: '500', textAlign: 'center' },
  refreshButton: { marginTop: 24 },
});
