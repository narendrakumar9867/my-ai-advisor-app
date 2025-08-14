import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

export default function ProductCard({ product, reasoning, matchScore, rank }) {
  if (!product) {
    return null;
  }

  const handleProductPress = () => {
    Alert.alert(
      product.name,
      `Price: ₹${product.price.toLocaleString()}\n\nFeatures:\n${product.features.join(', ')}\n\nSpecifications:\n${Object.entries(product.specifications)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n')}`,
      [{ text: 'OK' }]
    );
  };

  const getMatchColor = (score) => {
    if (score >= 0.8) return '#4CAF50';
    if (score >= 0.6) return '#FF9800';
    return '#F44336';
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handleProductPress}>
      <View style={styles.rankContainer}>
        <Text style={styles.rankText}>#{rank}</Text>
        <View style={[styles.matchBadge, { backgroundColor: getMatchColor(matchScore) }]}>
          <Text style={styles.matchText}>{Math.round(matchScore * 100)}% Match</Text>
        </View>
      </View>

      <Image source={{ uri: product.image }} style={styles.productImage} />

      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productPrice}>₹{product.price.toLocaleString()}</Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {product.description}
        </Text>

        <View style={styles.featuresContainer}>
          {product.features.slice(0, 3).map((feature, index) => (
            <View key={index} style={styles.featureTag}>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
          {product.features.length > 3 && (
            <Text style={styles.moreFeatures}>+{product.features.length - 3} more</Text>
          )}
        </View>

        <View style={styles.reasoningContainer}>
          <Text style={styles.reasoningTitle}>Why this matches:</Text>
          <Text style={styles.reasoningText}>{reasoning}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rankContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  rankText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#667eea',
  },
  matchBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  matchText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  productInfo: {
    marginTop: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#667eea',
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 10,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTag: {
    backgroundColor: '#f0f7ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  featureText: {
    fontSize: 12,
    color: '#667eea',
  },
  moreFeatures: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  reasoningContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#667eea',
  },
  reasoningTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  reasoningText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
  },
});