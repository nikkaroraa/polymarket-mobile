import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';
import { setApiKey, getApiKey, clearApiKey } from '../api/bankr';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

export function SettingsScreen() {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    checkKey();
  }, []);

  const checkKey = async () => {
    const key = await getApiKey();
    setHasKey(!!key);
    if (key) {
      // Show masked key
      setApiKeyInput('••••••••' + key.slice(-8));
    }
  };

  const handleSave = async () => {
    if (!apiKeyInput.trim() || apiKeyInput.startsWith('••••')) {
      Alert.alert('Error', 'Please enter a valid API key');
      return;
    }

    setSaving(true);
    try {
      await setApiKey(apiKeyInput.trim());
      setHasKey(true);
      setApiKeyInput('••••••••' + apiKeyInput.trim().slice(-8));
      Alert.alert('✅ Saved', 'API key saved securely');
    } catch (e) {
      Alert.alert('Error', 'Failed to save API key');
    } finally {
      setSaving(false);
    }
  };

  const handleClear = () => {
    Alert.alert(
      'Clear API Key',
      'Are you sure? You will need to re-enter it to use the app.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearApiKey();
            setApiKeyInput('');
            setHasKey(false);
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>⚙️ Settings</Text>

      <Card>
        <Text style={styles.label}>Bankr API Key</Text>
        <TextInput
          style={styles.input}
          placeholder="bk_..."
          placeholderTextColor="#6b7280"
          value={apiKeyInput}
          onChangeText={setApiKeyInput}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={!apiKeyInput.startsWith('bk_')}
        />
        <View style={styles.buttonRow}>
          <Button
            title="Save Key"
            onPress={handleSave}
            loading={saving}
            style={{ flex: 1, marginRight: 8 }}
          />
          {hasKey && (
            <Button
              title="Clear"
              onPress={handleClear}
              variant="danger"
              style={{ flex: 1, marginLeft: 8 }}
            />
          )}
        </View>
        {hasKey && (
          <Text style={styles.status}>✅ API key configured</Text>
        )}
      </Card>

      <Card style={styles.infoCard}>
        <Text style={styles.infoTitle}>ℹ️ About</Text>
        <Text style={styles.infoText}>
          This app connects to the Bankr API to interact with Polymarket.
        </Text>
        <Text style={styles.infoText}>
          Your API key is stored securely on-device using iOS Keychain.
        </Text>
      </Card>

      <Card style={styles.infoCard}>
        <Text style={styles.infoTitle}>🔗 Wallet</Text>
        <Text style={styles.walletAddress}>
          0x65e68d20dd434dbe13cd1ec9e6714ad5896fa1e2
        </Text>
      </Card>
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
    fontFamily: 'monospace',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  status: {
    color: '#10b981',
    fontSize: 13,
    marginTop: 12,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#1e1e32',
  },
  infoTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    color: '#9ca3af',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 4,
  },
  walletAddress: {
    color: '#818cf8',
    fontSize: 12,
    fontFamily: 'monospace',
  },
});
