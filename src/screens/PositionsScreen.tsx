import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { useBankr } from '../hooks/useBankr';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Loading } from '../components/Loading';

export function PositionsScreen() {
  const { execute, loading } = useBankr();
  const [positions, setPositions] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [redeeming, setRedeeming] = useState(false);

  const fetchPositions = useCallback(async () => {
    try {
      const response = await execute('show my polymarket positions');
      setPositions(response);
    } catch (e) {
      console.error('Failed to fetch positions:', e);
    }
  }, [execute]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPositions();
    setRefreshing(false);
  }, [fetchPositions]);

  const handleRedeem = () => {
    Alert.alert(
      '💰 Redeem Winnings',
      'This will redeem all your winning positions. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Redeem All',
          onPress: async () => {
            setRedeeming(true);
            try {
              const response = await execute('redeem my winning polymarket positions');
              Alert.alert('✅ Success', response);
              await fetchPositions(); // Refresh positions
            } catch (e) {
              const msg = e instanceof Error ? e.message : 'Unknown error';
              Alert.alert('❌ Error', msg);
            } finally {
              setRedeeming(false);
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  if (loading && !refreshing && !positions) {
    return <Loading message="Loading positions..." />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366f1" />
      }
    >
      <Text style={styles.title}>📊 Positions</Text>

      <Button
        title="💰 Redeem Winnings"
        onPress={handleRedeem}
        loading={redeeming}
        variant="secondary"
        style={{ marginBottom: 16 }}
      />

      <Card>
        {positions ? (
          <Text style={styles.positionsText}>{positions}</Text>
        ) : (
          <Text style={styles.placeholder}>No positions found. Place some bets!</Text>
        )}
      </Card>

      <Text style={styles.hint}>Pull down to refresh positions</Text>
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
  positionsText: {
    color: '#e5e7eb',
    fontSize: 15,
    lineHeight: 24,
  },
  placeholder: {
    color: '#6b7280',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20,
  },
  hint: {
    color: '#4b5563',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
  },
});
