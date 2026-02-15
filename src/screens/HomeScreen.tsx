import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useBankr } from '../hooks/useBankr';
import { Card } from '../components/Card';
import { Loading } from '../components/Loading';

export function HomeScreen() {
  const { execute, loading } = useBankr();
  const [balances, setBalances] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBalances = useCallback(async () => {
    try {
      const response = await execute('what are my balances?');
      setBalances(response);
    } catch (e) {
      console.error('Failed to fetch balances:', e);
    }
  }, [execute]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchBalances();
    setRefreshing(false);
  }, [fetchBalances]);

  useEffect(() => {
    fetchBalances();
  }, []);

  if (loading && !refreshing && !balances) {
    return <Loading message="Fetching balances..." />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366f1" />
      }
    >
      <Text style={styles.title}>💰 Balances</Text>
      
      <Card>
        <Text style={styles.wallet}>
          Wallet: 0x65e6...a1e2
        </Text>
      </Card>

      <Card>
        {balances ? (
          <Text style={styles.balanceText}>{balances}</Text>
        ) : (
          <Text style={styles.placeholder}>Pull to refresh</Text>
        )}
      </Card>

      <Text style={styles.hint}>Pull down to refresh balances</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  content: {
    padding: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  wallet: {
    color: '#9ca3af',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  balanceText: {
    color: '#e5e7eb',
    fontSize: 15,
    lineHeight: 24,
  },
  placeholder: {
    color: '#6b7280',
    fontSize: 14,
    textAlign: 'center',
  },
  hint: {
    color: '#4b5563',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
  },
});
