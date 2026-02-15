import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useBankr } from '../hooks/useBankr';

interface BetScreenProps {
  onBack: () => void;
  initialMarket?: string;
}

export function BetScreen({ onBack, initialMarket = '' }: BetScreenProps) {
  const [market, setMarket] = useState(initialMarket);
  const [position, setPosition] = useState('');
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState<string>('');
  const { loading, error, placeBet } = useBankr();

  const handlePlaceBet = () => {
    if (!market.trim() || !position.trim() || !amount.trim()) {
      Alert.alert('Missing Info', 'Please fill in all fields');
      return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }
    // CONFIRMATION PROMPT
    Alert.alert('⚠️ Confirm Bet', `Are you sure you want to bet $${numAmount} on "${position}" for "${market}"?\n\nThis action cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Place Bet', style: 'destructive', onPress: async () => {
        const res = await placeBet(numAmount, position, market);
        if (res) { setResult(res); Alert.alert('✅ Bet Placed', 'Your bet has been submitted!'); }
      }},
    ]);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Place Bet</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Card>
          <View style={styles.cardHeader}>
            <Ionicons name="cash-outline" size={20} color="#f59e0b" />
            <Text style={styles.cardTitle}>Bet Details</Text>
          </View>

          <Text style={styles.label}>Market</Text>
          <TextInput style={styles.input} placeholder='e.g., "Trump wins 2024 election"' placeholderTextColor="#666" value={market} onChangeText={setMarket} />

          <Text style={styles.label}>Your Position</Text>
          <TextInput style={styles.input} placeholder='e.g., "Yes" or "Trump"' placeholderTextColor="#666" value={position} onChangeText={setPosition} />

          <Text style={styles.label}>Amount (USD)</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.dollarSign}>$</Text>
            <TextInput style={styles.amountInput} placeholder="0.00" placeholderTextColor="#666" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" />
          </View>

          <View style={styles.quickAmounts}>
            {['5', '10', '25', '50', '100'].map((val) => (
              <TouchableOpacity key={val} style={styles.quickButton} onPress={() => setAmount(val)}>
                <Text style={styles.quickButtonText}>${val}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {error && <Card><Text style={styles.errorText}>{error}</Text></Card>}
        {result && <Card><Text style={styles.resultLabel}>Result</Text><Text style={styles.resultText}>{result}</Text></Card>}

        <Button title="Place Bet" onPress={handlePlaceBet} loading={loading} disabled={!market.trim() || !position.trim() || !amount.trim()} style={styles.betButton} />
        <Text style={styles.disclaimer}>⚠️ You will be asked to confirm before the bet is placed.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a', paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 20 },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  content: { flex: 1 },
  scrollContent: { padding: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#fff' },
  label: { color: '#888', fontSize: 14, marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#0f0f1a', borderWidth: 1, borderColor: '#2a2a4a', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, color: '#fff', fontSize: 16 },
  amountContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0f0f1a', borderWidth: 1, borderColor: '#2a2a4a', borderRadius: 10, paddingHorizontal: 14 },
  dollarSign: { color: '#888', fontSize: 20, marginRight: 4 },
  amountInput: { flex: 1, paddingVertical: 12, color: '#fff', fontSize: 20, fontWeight: '600' },
  quickAmounts: { flexDirection: 'row', gap: 8, marginTop: 12 },
  quickButton: { flex: 1, backgroundColor: '#0f0f1a', borderWidth: 1, borderColor: '#2a2a4a', borderRadius: 8, paddingVertical: 8, alignItems: 'center' },
  quickButtonText: { color: '#fff', fontSize: 14, fontWeight: '500' },
  errorText: { color: '#ef4444', fontSize: 14 },
  resultLabel: { color: '#888', fontSize: 12, marginBottom: 6 },
  resultText: { color: '#e5e5e5', fontSize: 14, lineHeight: 22 },
  betButton: { marginTop: 16 },
  disclaimer: { color: '#888', fontSize: 12, textAlign: 'center', marginTop: 12, marginBottom: 24 },
});
