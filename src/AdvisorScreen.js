import { useState } from "react";
import { Dimensions, Alert, View, StyleSheet, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import PRODUCT_CATALOG from "./catalog";
import { getAIRecommendations } from "./api/geminiAPI";


const { width } = Dimensions.get("window");

export default function AdvisorScreen() {
    const [query, setQuery] = useState("");
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async () => {
        if (!query.trim()) {
            Alert.alert("Error", "Please enter your requirements.");
            return;
        }

        setLoading(true);

        try {
            
            const aiResponse = await getAIRecommendations(query, PRODUCT_CATALOG);
            setRecommendations(aiResponse.recommendations || []);
            setHasSearched(true);
        } catch (error) {
            console.log("Search error:", error);
            Alert.alert("Error", "failed to get recommendations. please try again.");
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setQuery("");
        setRecommendations([]);
        setHasSearched(false);
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={[ "#667eea", "#764ba2"]} style={styles.header}>
                <Text style={styles.title}>AI Product Advisor</Text>
                <Text style={styles.subtitle}>
                    Describe what you need in plain english
                </Text>
            </LinearGradient>

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="e.g., I need a lightweight laptop for travel with long battery life..."
                    value={query}
                    onChangeText={setQuery}
                    multiline
                    textAlignVertical="top"
                />

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.searchButton, loading && styles.disabledButton]}
                        onPress={handleSearch}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <Text style={styles.searchButtonText}>Get Recommendation</Text>
                        )}
                    </TouchableOpacity>

                    {hasSearched && (
                        <TouchableOpacity
                            style={styles.clearButton}
                            onPress={clearSearch}
                        >
                            <Text style={styles.clearButtonText}>Clear</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <ScrollView style={styles.resultContainer} showsVerticalScrollIndicator={false}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#667eea" />
                        <Text style={styles.loadingText}>Finding perfect products for you...</Text>
                    </View>
                    ) : recommendations.length > 0 ? (
                    <>
                        <Text style={styles.resultsTitle}>Recommended Products ({recommendations.length})
                        </Text>
                        {recommendations.map((item, index) => (
                        <ProductCard
                            key={item.product?.id || index}
                            product={item.product}
                            reasoning={item.reasoning}
                            matchScore={item.matchScore}
                            rank={index + 1}
                        />
                        ))}
                    </>
                    ) : hasSearched ? (
                    <View style={styles.noResultsContainer}>
                        <Text style={styles.noResultsText}>
                        No products found matching your requirements.
                        </Text>
                        <Text style={styles.noResultsSubtext}>
                        Try rephrasing your query or being more specific.
                        </Text>
                    </View>
                    ) : (
                    <View style={styles.welcomeContainer}>
                        <Text style={styles.welcomeTitle}>Welcome!</Text>
                        <Text style={styles.welcomeText}>
                        Describe what kind of product you're looking for and I'll help you find the perfect match.
                        </Text>
                        
                        <Text style={styles.exampleTitle}>Example queries:</Text>
                        <View style={styles.exampleContainer}>
                        <Text style={styles.exampleText}>
                            "I need a laptop for gaming with good graphics"
                        </Text>
                        <Text style={styles.exampleText}>
                            "Looking for a budget smartphone with good camera"
                        </Text>
                        <Text style={styles.exampleText}>
                            "Need noise-canceling headphones for work"
                        </Text>
                        </View>
                    </View>
                    )}
            </ScrollView>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa"
    },
    header: {
        padding: 20,
        paddingTop: 40,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        opacity: 0.9,
    },
    searchContainer: {
        padding: 20,
        backgroundColor: '#fff',
        margin: 15,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        minHeight: 80,
        backgroundColor: '#f8f9fa',
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 15,
        gap: 10,
    },
    searchButton: {
        backgroundColor: '#667eea',
        padding: 15,
        borderRadius: 10,
        flex: 1,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    searchButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    clearButton: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#667eea',
        minWidth: 80,
        alignItems: 'center',
    },
    clearButtonText: {
        color: '#667eea',
        fontSize: 16,
        fontWeight: '600',
    },
    resultsContainer: {
        flex: 1,
        padding: 15,
  },
  loadingContainer: {
        alignItems: 'center',
        marginTop: 50,
  },
  loadingText: {
        marginTop: 15,
        fontSize: 16,
        color: '#666',
  },
  resultsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
  },
  noResultsContainer: {
        alignItems: 'center',
        marginTop: 50,
  },
  noResultsText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
  },
  noResultsSubtext: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        marginTop: 10,
  },
  welcomeContainer: {
        padding: 20,
        alignItems: 'center',
  },
  welcomeTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
  },
  welcomeText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 25,
  },
  exampleTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 15,
  },
  exampleContainer: {
        backgroundColor: '#f0f7ff',
        padding: 15,
        borderRadius: 10,
        width: '100%',
  },
  exampleText: {
        fontSize: 14,
        color: '#667eea',
        marginBottom: 8,
        lineHeight: 20,
  },
});
