import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';

const API_BASE = 'https://api.bankr.bot';
const API_KEY = 'bk_3A7LSCL48LWJ6GK6GB35WZ282MCMRAX6';

// Simple API call helper
async function bankrPrompt(prompt: string): Promise<string> {
  // Submit prompt
  const submitRes = await fetch(`${API_BASE}/agent/prompt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
    },
    body: JSON.stringify({ prompt }),
  });
  
  if (!submitRes.ok) throw new Error('API error');
  const { jobId } = await submitRes.json();

  // Poll for result
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 1000));
    
    const pollRes = await fetch(`${API_BASE}/agent/job/${jobId}`, {
      headers: { 'X-API-Key': API_KEY },
    });
    
    if (!pollRes.ok) continue;
    const result = await pollRes.json();
    
    if (result.status === 'completed') return result.response || '';
    if (result.status === 'failed') throw new Error(result.error || 'Failed');
  }
  
  throw new Error('Timeout');
}

export default function App() {
  const [positions, setPositions] = useState<string | null>(null);
  const [balances, setBalances] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const [pos, bal] = await Promise.all([
        bankrPrompt('show my polymarket positions with current prices and pnl'),
        bankrPrompt('what are my balances?'),
      ]);
      setPositions(pos);
      setBalances(bal);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading portfolio...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366f1" />
        }
      >
        <Text style={styles.title}>📊 Portfolio</Text>

        {error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}

        {/* Balances */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>💰 Balances</Text>
          <Text style={styles.cardContent}>{balances || 'No data'}</Text>
        </View>

        {/* Positions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎯 Positions</Text>
          <Text style={styles.cardContent}>{positions || 'No positions'}</Text>
        </View>

        <Text style={styles.hint}>Pull down to refresh</Text>
        <Text style={styles.wallet}>Wallet: 0x65e6...a1e2</Text>
      </ScrollView>
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
    color: '#9ca3af',
    marginTop: 12,
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#818cf8',
    marginBottom: 12,
  },
  cardContent: {
    fontSize: 15,
    color: '#e5e7eb',
    lineHeight: 24,
  },
  errorCard: {
    backgroundColor: '#2d1f1f',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#7f1d1d',
  },
  errorText: {
    color: '#fca5a5',
    fontSize: 14,
  },
  hint: {
    color: '#4b5563',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
  },
  wallet: {
    color: '#374151',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 8,
    fontFamily: 'monospace',
  },
});
