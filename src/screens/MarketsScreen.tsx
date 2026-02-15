import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useBankr } from '../hooks/useBankr';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Loading } from '../components/Loading';

export function MarketsScreen() {
  const { execute, loading } = useBankr();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    try {
      const response = await execute(`search polymarket for ${query}`);
      setResults(response);
    } catch (e) {
      console.error('Search failed:', e);
    }
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
        <Text style={styles.title}>🔍 Markets</Text>

        <Card>
          <TextInput
            style={styles.input}
            placeholder="Search markets (e.g. bitcoin, election, sports)"
            placeholderTextColor="#6b7280"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Button
            title="Search"
            onPress={handleSearch}
            loading={loading}
            disabled={!query.trim()}
            style={{ marginTop: 12 }}
          />
        </Card>

        {loading && !results && <Loading message="Searching markets..." />}

        {results && (
          <Card>
            <Text style={styles.resultsTitle}>Results</Text>
            <Text style={styles.resultsText}>{results}</Text>
          </Card>
        )}

        <Card style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Search Tips</Text>
          <Text style={styles.tip}>• "bitcoin price above 100k"</Text>
          <Text style={styles.tip}>• "super bowl winner"</Text>
          <Text style={styles.tip}>• "will trump win"</Text>
          <Text style={styles.tip}>• "fed rate cut march"</Text>
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
  input: {
    backgroundColor: '#252538',
    borderRadius: 8,
    padding: 14,
    color: '#fff',
    fontSize: 16,
  },
  resultsTitle: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  resultsText: {
    color: '#e5e7eb',
    fontSize: 15,
    lineHeight: 24,
  },
  tipsCard: {
    backgroundColor: '#1e1e32',
    marginTop: 8,
  },
  tipsTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  tip: {
    color: '#9ca3af',
    fontSize: 13,
    marginVertical: 2,
  },
});
