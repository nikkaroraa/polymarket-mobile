import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { setApiKey, getApiKey, hasApiKey } from '../services/bankr';

interface SettingsScreenProps {
  onBack: () => void;
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const [apiKeyState, setApiKeyState] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { checkApiKey(); }, []);

  const checkApiKey = async () => {
    const exists = await hasApiKey();
    setHasKey(exists);
    if (exists) { const key = await getApiKey(); if (key) setApiKeyState(key); }
  };

  const handleSave = async () => {
    if (!apiKeyState.trim()) { Alert.alert('Error', 'Please enter an API key'); return; }
    setLoading(true);
    try { await setApiKey(apiKeyState.trim()); setHasKey(true); Alert.alert('✅ Saved', 'API key saved securely'); }
    catch { Alert.alert('Error', 'Failed to save API key'); }
    finally { setLoading(false); }
  };

  const handleClear = () => {
    Alert.alert('Clear API Key', 'Are you sure you want to remove your API key?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: async () => { await setApiKey(''); setApiKeyState(''); setHasKey(false); }},
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Card>
          <View style={styles.cardHeader}>
            <Ionicons name="key-outline" size={20} color="#4f46e5" />
            <Text style={styles.cardTitle}>Bankr API Key</Text>
          </View>
          <Text style={styles.description}>Enter your Bankr API key to connect to Polymarket. Your key is stored securely on your device.</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.input} placeholder="bk_xxxxxxxxxxxx" placeholderTextColor="#666" value={apiKeyState} onChangeText={setApiKeyState} secureTextEntry={!showKey} autoCapitalize="none" autoCorrect={false} />
            <TouchableOpacity style={styles.eyeButton} onPress={() => setShowKey(!showKey)}>
              <Ionicons name={showKey ? 'eye-off' : 'eye'} size={20} color="#666" />
            </TouchableOpacity>
          </View>
          <View style={styles.buttonRow}>
            <Button title="Save" onPress={handleSave} loading={loading} style={styles.saveButton} />
            {hasKey && <Button title="Clear" onPress={handleClear} variant="danger" style={styles.clearButton} />}
          </View>
          {hasKey && <View style={styles.statusRow}><Ionicons name="checkmark-circle" size={16} color="#22c55e" /><Text style={styles.statusText}>API key configured</Text></View>}
        </Card>

        <Card>
          <View style={styles.cardHeader}><Ionicons name="wallet-outline" size={20} color="#22c55e" /><Text style={styles.cardTitle}>Wallet</Text></View>
          <Text style={styles.walletAddress}>0x65e68...fa1e2</Text>
          <Text style={styles.description}>Your Polymarket trades are executed through this wallet via Bankr.</Text>
        </Card>

        <Card>
          <View style={styles.cardHeader}><Ionicons name="information-circle-outline" size={20} color="#888" /><Text style={styles.cardTitle}>About</Text></View>
          <Text style={styles.description}>Polymarket Mobile v1.0.0{'\n'}Powered by Bankr API</Text>
        </Card>
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
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0f0f1a', borderWidth: 1, borderColor: '#2a2a4a', borderRadius: 10, marginTop: 16 },
  input: { flex: 1, paddingHorizontal: 14, paddingVertical: 12, color: '#fff', fontSize: 16 },
  eyeButton: { padding: 12 },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  saveButton: { flex: 1 },
  clearButton: { flex: 1 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
  statusText: { color: '#22c55e', fontSize: 14 },
  walletAddress: { color: '#fff', fontSize: 16, fontFamily: 'monospace', marginBottom: 8 },
});
