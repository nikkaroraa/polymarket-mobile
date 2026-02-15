import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useBankr } from '../hooks/useBankr';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

export function BetScreen() {
  const { execute, loading } = useBankr();
  const [betCommand, setBetCommand] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const handlePlaceBet = async () => {
    if (!betCommand.trim()) return;

    // CONFIRMATION PROMPT - Critical!
    Alert.alert(
      '⚠️ Confirm Bet',
      `Are you sure you want to place this bet?\n\n"${betCommand}"`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Place Bet',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await execute(betCommand);
              setResult(response);
              setBetCommand('');
              Alert.alert('✅ Bet Placed', 'Your bet has been submitted!');
            } catch (e) {
              const msg = e instanceof Error ? e.message : 'Unknown error';
              Alert.alert('❌ Error', msg);
            }
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>🎯 Place Bet</Text>

        <Card>
          <Text style={styles.label}>Bet Command</Text>
          <TextInput
            style={styles.input}
            placeholder='e.g. "bet $5 on bitcoin above 100k"'
            placeholderTextColor="#6b7280"
            value={betCommand}
            onChangeText={setBetCommand}
            multiline
            numberOfLines={3}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Button
            title="Place Bet"
            onPress={handlePlaceBet}
            loading={loading}
            disabled={!betCommand.trim()}
            variant="primary"
            style={{ marginTop: 16 }}
          />
        </Card>

        {result && (
          <Card>
            <Text style={styles.resultTitle}>Result</Text>
            <Text style={styles.resultText}>{result}</Text>
          </Card>
        )}

        <Card style={styles.examplesCard}>
          <Text style={styles.examplesTitle}>📝 Example Bets</Text>
          <Text style={styles.example}>• "bet $5 on yes for bitcoin above 100k"</Text>
          <Text style={styles.example}>• "bet $10 on chiefs to win super bowl"</Text>
          <Text style={styles.example}>• "bet $2 on no for trump to pardon xyz"</Text>
        </Card>

        <Card style={styles.warningCard}>
          <Text style={styles.warningTitle}>⚠️ Warning</Text>
          <Text style={styles.warningText}>
            Bets use real USDC on Polygon. Double-check your bet before confirming.
            All bets are final and cannot be reversed.
          </Text>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  scrollView: {
    flex: 1,
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
  label: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#252538',
    borderRadius: 8,
    padding: 14,
    color: '#fff',
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  resultTitle: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  resultText: {
    color: '#e5e7eb',
    fontSize: 15,
    lineHeight: 24,
  },
  examplesCard: {
    backgroundColor: '#1e1e32',
  },
  examplesTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  example: {
    color: '#9ca3af',
    fontSize: 13,
    marginVertical: 2,
  },
  warningCard: {
    backgroundColor: '#2d1f1f',
    borderColor: '#7f1d1d',
    borderWidth: 1,
  },
  warningTitle: {
    color: '#fca5a5',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  warningText: {
    color: '#fecaca',
    fontSize: 13,
    lineHeight: 20,
  },
});
