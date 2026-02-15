import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useBankr } from '../hooks/useBankr';

interface PositionsScreenProps {
  onBack: () => void;
}

export function PositionsScreen({ onBack }: PositionsScreenProps) {
  const [positions, setPositions] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  const { loading, error, getPositions } = useBankr();

  const fetchPositions = async () => {
    const result = await getPositions();
    if (result) setPositions(result);
  };

  useEffect(() => { fetchPositions(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPositions();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>My Positions</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4f46e5" />}>
        {loading && !positions ? <Card><Text style={styles.loadingText}>Loading positions...</Text></Card>
          : error ? <Card><Text style={styles.errorText}>{error}</Text></Card>
          : positions ? (
            <Card>
              <View style={styles.cardHeader}>
                <Ionicons name="pie-chart" size={20} color="#22c55e" />
                <Text style={styles.cardTitle}>Open Positions</Text>
              </View>
              <Text style={styles.positionsText}>{positions}</Text>
            </Card>
          ) : (
            <Card>
              <View style={styles.emptyState}>
                <Ionicons name="folder-open-outline" size={48} color="#444" />
                <Text style={styles.emptyText}>No positions yet</Text>
                <Text style={styles.emptySubtext}>Search for markets and place your first bet!</Text>
              </View>
            </Card>
          )}
        <Button title="Refresh" onPress={fetchPositions} loading={loading} variant="secondary" style={styles.refreshButton} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a', paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 20 },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  content: { flex: 1 },
  scrollContent: { padding: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#fff' },
  loadingText: { color: '#888', fontSize: 14, textAlign: 'center' },
  errorText: { color: '#ef4444', fontSize: 14 },
  positionsText: { color: '#e5e5e5', fontSize: 14, lineHeight: 22 },
  emptyState: { alignItems: 'center', paddingVertical: 24 },
  emptyText: { color: '#fff', fontSize: 16, fontWeight: '500', marginTop: 12 },
  emptySubtext: { color: '#888', fontSize: 14, marginTop: 4, textAlign: 'center' },
  refreshButton: { marginTop: 16 },
});
