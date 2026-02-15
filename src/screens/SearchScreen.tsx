import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useBankr } from '../hooks/useBankr';

interface SearchScreenProps {
  onBack: () => void;
  onSelectMarket: (market: string) => void;
}

export function SearchScreen({ onBack, onSelectMarket }: SearchScreenProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string>('');
  const { loading, error, searchMarkets } = useBankr();

  const handleSearch = async () => {
    if (!query.trim()) return;
    const result = await searchMarkets(query);
    if (result) setResults(result);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Search Markets</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for markets..."
          placeholderTextColor="#666"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoFocus
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      <Button
        title="Search"
        onPress={handleSearch}
        loading={loading}
        disabled={!query.trim()}
        style={styles.searchButton}
      />

      {/* Results */}
      <ScrollView style={styles.results} contentContainerStyle={styles.resultsContent}>
        {error && (
          <Card>
            <Text style={styles.errorText}>{error}</Text>
          </Card>
        )}

        {results && (
          <Card>
            <Text style={styles.resultsLabel}>Results for "{query}"</Text>
            <Text style={styles.resultsText}>{results}</Text>
            <Button
              title="Bet on this market"
              onPress={() => onSelectMarket(query)}
              variant="secondary"
              style={styles.betButton}
            />
          </Card>
        )}

        {/* Quick Searches */}
        {!results && !loading && (
          <View style={styles.quickSearches}>
            <Text style={styles.quickLabel}>Popular searches:</Text>
            {['Bitcoin price', 'Trump', 'Super Bowl', 'Fed rate'].map((term) => (
              <TouchableOpacity
                key={term}
                style={styles.quickChip}
                onPress={() => {
                  setQuery(term);
                }}
              >
                <Text style={styles.quickChipText}>{term}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    color: '#fff',
    fontSize: 16,
  },
  searchButton: {
    marginHorizontal: 16,
    marginTop: 12,
  },
  results: {
    flex: 1,
    marginTop: 16,
  },
  resultsContent: {
    padding: 16,
  },
  resultsLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  resultsText: {
    color: '#e5e5e5',
    fontSize: 14,
    lineHeight: 22,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
  },
  betButton: {
    marginTop: 16,
  },
  quickSearches: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  quickLabel: {
    color: '#888',
    fontSize: 14,
    width: '100%',
    marginBottom: 8,
  },
  quickChip: {
    backgroundColor: '#1a1a2e',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  quickChipText: {
    color: '#fff',
    fontSize: 14,
  },
});
