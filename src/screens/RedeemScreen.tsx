import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useBankr } from '../hooks/useBankr';

interface RedeemScreenProps {
  onBack: () => void;
}

export function RedeemScreen({ onBack }: RedeemScreenProps) {
  const [result, setResult] = useState<string>('');
  const { loading, error, redeemWinnings, getPositions } = useBankr();
  const [positions, setPositions] = useState<string>('');
  const [loadingPositions, setLoadingPositions] = useState(false);

  const fetchPositions = async () => {
    setLoadingPositions(true);
    const res = await getPositions();
    if (res) setPositions(res);
    setLoadingPositions(false);
  };

  const handleRedeem = () => {
    Alert.alert('💰 Redeem Winnings', 'This will redeem all your winning Polymarket positions. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Redeem All', onPress: async () => {
        const res = await redeemWinnings();
        if (res) { setResult(res); Alert.alert('✅ Success', 'Winnings redeemed!'); }
      }},
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Redeem Winnings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Card>
          <View style={styles.cardHeader}>
            <Ionicons name="gift-outline" size={20} color="#ec4899" />
            <Text style={styles.cardTitle}>Claim Your Winnings</Text>
          </View>
          <Text style={styles.description}>If you have winning positions on markets that have resolved, you can redeem them here to receive your payout in USDC.</Text>
        </Card>

        <Button title="Check Redeemable Positions" onPress={fetchPositions} loading={loadingPositions} variant="secondary" style={styles.checkButton} />

        {positions && <Card><Text style={styles.positionsLabel}>Your Positions</Text><Text style={styles.positionsText}>{positions}</Text></Card>}
        {error && <Card><Text style={styles.errorText}>{error}</Text></Card>}
        {result && (
          <Card>
            <View style={styles.successHeader}>
              <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
              <Text style={styles.successTitle}>Redemption Complete</Text>
            </View>
            <Text style={styles.resultText}>{result}</Text>
          </Card>
        )}

        <Button title="Redeem All Winnings" onPress={handleRedeem} loading={loading} style={styles.redeemButton} />
        <Text style={styles.note}>Note: Only resolved winning positions can be redeemed.</Text>
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
  description: { color: '#888', fontSize: 14, lineHeight: 22 },
  checkButton: { marginTop: 8 },
  positionsLabel: { color: '#888', fontSize: 12, marginBottom: 8 },
  positionsText: { color: '#e5e5e5', fontSize: 14, lineHeight: 22 },
  errorText: { color: '#ef4444', fontSize: 14 },
  successHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  successTitle: { color: '#22c55e', fontSize: 16, fontWeight: '600' },
  resultText: { color: '#e5e5e5', fontSize: 14, lineHeight: 22 },
  redeemButton: { marginTop: 24 },
  note: { color: '#666', fontSize: 12, textAlign: 'center', marginTop: 12 },
});
