import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, useColorScheme, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getPropertyDetails } from '@/app/_services/api.service';
import { PropertyDetail } from '@/components/Agent/PropertyDashboard/types';
import { Colors } from '@/constants/Colors';
import { ThemedIcon } from '@/components/ThemedIcon';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useTranslation } from 'react-i18next';
import VisitSchedulerPanel from '../../../components/Buyer/VisitSchedulerPanel';
import OfferPanel from '../../../components/Offer/OfferPanel';

const { width: screenWidth } = Dimensions.get('window');

const PropertyDetailScreen: React.FC = () => {
  const { propertyId } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'features'>('description');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isVisitPanelVisible, setVisitPanelVisible] = useState(false);
  const [isOfferPanelVisible, setOfferPanelVisible] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        if (!propertyId) {
          setError('ID immobile non specificato');
          return;
        }
        
        const propertyData = await getPropertyDetails(propertyId as string);
        setProperty(propertyData);
      } catch (err) {
        console.error('Errore nel recupero dei dettagli immobile:', err);
        setError('Impossibile caricare i dettagli dell\'immobile');
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [propertyId]);

  const handleBack = () => {
    router.back();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slide = Math.ceil(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width);
    if (slide !== activeImageIndex) {
      setActiveImageIndex(slide);
    }
  };

  const renderTabContent = () => {
    if (!property) return null;

    const styles = createStyles(themeColors);
    switch (activeTab) {
      case 'description':
        return (
          <ThemedText style={styles.tabContentText}>
            {property.description || 'Nessuna descrizione disponibile per questo immobile.'}
          </ThemedText>
        );
      case 'details':
        return (
          <View style={styles.tabContent}>
            <ThemedText style={styles.tabContentText}>
              <ThemedText style={styles.detailLabel}>Stato: </ThemedText>
              {property.status}
            </ThemedText>
            <ThemedText style={styles.tabContentText}>
              <ThemedText style={styles.detailLabel}>Contratto: </ThemedText>
              {property.contractType === 'rent' ? 'Affitto' : 'Vendita'}
            </ThemedText>
            <ThemedText style={styles.tabContentText}>
              <ThemedText style={styles.detailLabel}>Anno costruzione: </ThemedText>
              {property.yearBuilt || 'Non specificato'}
            </ThemedText>
            <ThemedText style={styles.tabContentText}>
              <ThemedText style={styles.detailLabel}>Classificazione energetica: </ThemedText>
              {property.energyRating || 'Non specificata'}
            </ThemedText>
          </View>
        );
      case 'features':
        return (
          <View style={styles.tabContent}>
            {property.features && property.features.length > 0 ? (
              property.features.map((feature, index) => (
                <ThemedText key={index} style={styles.tabContentText}>
                  • {feature}
                </ThemedText>
              ))
            ) : (
              <ThemedText style={styles.tabContentText}>Nessuna caratteristica disponibile</ThemedText>
            )}
          </View>
        );
      default:
        return null;
    }
  };

  const styles = createStyles(themeColors);

  if (loading) {
    return (
      <ThemedView style={styles.centeredContainer}>
        <ThemedText style={styles.loadingText}>Caricamento...</ThemedText>
      </ThemedView>
    );
  }

  if (error || !property) {
    return (
      <ThemedView style={styles.centeredContainer}>
        <ThemedText style={styles.errorText}>{error || 'Immobile non trovato'}</ThemedText>
        <TouchableOpacity style={styles.backButtonError} onPress={handleBack}>
          <ThemedText style={styles.backButtonText}>Torna indietro</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const images = property.images && property.images.length > 0 ? property.images : (property.imageUrl ? [property.imageUrl] : []);

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
            style={{ width: screenWidth }}
            scrollEnabled={images.length > 1}
          >
            {images.map((uri, index) => (
              <Image 
                key={index}
                source={{ uri: uri || 'https://via.placeholder.com/400x250' }} 
                style={styles.coverImage} 
                resizeMode="cover"
              />
            ))}
          </ScrollView>
          {images.length > 1 && (
            <View style={styles.imageIndicators}>
              {images.map((_, index) => (
                <View 
                  key={index} 
                  style={[styles.indicator, activeImageIndex === index && styles.indicatorActive]} 
                />
              ))}
            </View>
          )}
        </View>

        {/* Titolo, indirizzo e prezzo */}
        <View style={styles.propertyInfo}>
          <ThemedText style={styles.title}>{t('property_category.'+property.propertyCategory) || 'Immobile'}</ThemedText>
          <ThemedText style={styles.address}>
            {property.city || 'Indirizzo non disponibile'}
          </ThemedText>
          <ThemedText style={styles.price}>{formatPrice(property.price)}</ThemedText>
        </View>

        {/* Dettagli principali */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <ThemedIcon icon="material-symbols:bed" size={24} lightColor={themeColors.text} darkColor={themeColors.text} accessibilityLabel="Letto" />
            <ThemedText style={styles.detailText}>
              {property.numberOfBedrooms || 0} {property.numberOfBedrooms === 1 ? 'Letto' : 'Letti'}
            </ThemedText>
          </View>
          <View style={styles.detailItem}>
            <ThemedIcon icon="material-symbols:bathtub" size={24} lightColor={themeColors.text} darkColor={themeColors.text} accessibilityLabel="Bagno" />
            <ThemedText style={styles.detailText}>
              {property.numberOfBathrooms || 0} {property.numberOfBathrooms === 1 ? 'Bagno' : 'Bagni'}
            </ThemedText>
          </View>
          <View style={styles.detailItem}>
            <ThemedIcon icon="material-symbols:square-foot" size={24} lightColor={themeColors.text} darkColor={themeColors.text} accessibilityLabel="Superficie" />
            <ThemedText style={styles.detailText}>
              {property.area.toLocaleString('it-IT')} m²
            </ThemedText>
          </View>
          <View style={styles.detailItem}>
            <ThemedIcon icon="material-symbols:directions-car" size={24} lightColor={themeColors.text} darkColor={themeColors.text} accessibilityLabel="Posti auto" />
              <ThemedText style={styles.detailText}>
                Posti auto: 2
              </ThemedText>
          </View>
        </View>

        {/* Tag/Badge */}
        <View style={styles.tagsContainer}>
          <View style={styles.tag}>
            <ThemedText style={styles.tagText}>
              {property.contractType === 'rent' ? 'Affitto' : 'Vendita'}
            </ThemedText>
          </View>
          <View style={styles.tag}>
            <ThemedText style={styles.tagText}>
             {t('property_status.'+property.status)}
            </ThemedText>
          </View>
          <View style={styles.tag}>
            <ThemedText style={styles.tagText}>Premium</ThemedText>
          </View>
        </View>

        {/* Pulsanti di azione */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => setVisitPanelVisible(true)}>
            <ThemedText style={styles.primaryButtonText}>Pianifica una visita</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => setOfferPanelVisible(true)}>
            <ThemedText style={styles.secondaryButtonText}>Fai un'offerta</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Tab */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabs}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'description' && styles.tabActive]}
              onPress={() => setActiveTab('description')}
            >
              <ThemedText style={[styles.tabText, activeTab === 'description' && styles.tabTextActive]}>
                Descrizione
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'details' && styles.tabActive]}
              onPress={() => setActiveTab('details')}
            >
              <ThemedText style={[styles.tabText, activeTab === 'details' && styles.tabTextActive]}>
                Dettagli
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'features' && styles.tabActive]}
              onPress={() => setActiveTab('features')}
            >
              <ThemedText style={[styles.tabText, activeTab === 'features' && styles.tabTextActive]}>
                Caratteristiche
              </ThemedText>
            </TouchableOpacity>
          </View>
          <View style={styles.tabContentContainer}>
            {renderTabContent()}
          </View>
        </View>

        {/* Mappa */}
        <View style={styles.mapContainer}>
          <ThemedText style={styles.sectionTitle}>Posizione</ThemedText>
          <View style={styles.map}>
            <Image 
              source={{ 
                uri: 'https://via.placeholder.com/400x200' 
              }} 
              style={styles.mapImage} 
              resizeMode="cover"
            />
            <View style={styles.mapMarker}>
              <View style={styles.mapMarkerPin} />
            </View>
          </View>
        </View>

        {/* Nearby Services */}
        <View style={styles.nearbyServices}>
          <ThemedText style={styles.sectionTitle}>Servizi vicini</ThemedText>
          <View style={styles.servicesGrid}>
            <View style={styles.serviceCard}>
              <ThemedIcon icon="material-symbols:school" size={24} lightColor={themeColors.text} darkColor={themeColors.text} accessibilityLabel="Scuola" />
              <ThemedText style={styles.serviceName}>Scuola</ThemedText>
              <ThemedText style={styles.serviceDistance}>1.2 km</ThemedText>
            </View>
            <View style={styles.serviceCard}>
              <ThemedIcon icon="material-symbols:local-hospital" size={24} lightColor={themeColors.text} darkColor={themeColors.text} accessibilityLabel="Ospedale" />
              <ThemedText style={styles.serviceName}>Ospedale</ThemedText>
              <ThemedText style={styles.serviceDistance}>2.5 km</ThemedText>
            </View>
            <View style={styles.serviceCard}>
              <ThemedIcon icon="material-symbols:shopping-bag" size={24} lightColor={themeColors.text} darkColor={themeColors.text} accessibilityLabel="Centro commerciale" />
              <ThemedText style={styles.serviceName}>Centro commerciale</ThemedText>
              <ThemedText style={styles.serviceDistance}>3.1 km</ThemedText>
            </View>
            <View style={styles.serviceCard}>
              <ThemedIcon icon="material-symbols:train" size={24} lightColor={themeColors.text} darkColor={themeColors.text} accessibilityLabel="Stazione" />
              <ThemedText style={styles.serviceName}>Stazione</ThemedText>
              <ThemedText style={styles.serviceDistance}>4.0 km</ThemedText>
            </View>
          </View>
        </View>

        {/* Agente immobiliare */}
        <View style={styles.agentCard}>
          <Image 
            source={{ 
              uri: property.agent?.profileImageUrl || 'https://via.placeholder.com/64x64' 
            }} 
            style={styles.agentAvatar} 
            resizeMode="cover"
          />
          <View style={styles.agentInfo}>
            <ThemedText style={styles.agentName}>{property.agent?.name || 'Agente immobiliare'}</ThemedText>
            <ThemedText style={styles.agentRole}>{property.agent?.agencyName || 'Agenzia immobiliare'}</ThemedText>
          </View>
          <TouchableOpacity style={styles.contactButton}>
            <ThemedText style={styles.contactButtonText}>Contatta</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <VisitSchedulerPanel
        isVisible={isVisitPanelVisible}
        onClose={() => setVisitPanelVisible(false)}
      />
      <OfferPanel
        isVisible={isOfferPanelVisible}
        onClose={() => setOfferPanelVisible(false)}
        propertyAddress={property?.city || 'Indirizzo non disponibile'}
        askingPrice={property?.price ? property.price.toString() : '0'}
      />
    </ThemedView>
  );
};

const createStyles = (themeColors: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.background,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: themeColors.background,
    borderBottomWidth: 1,
    borderBottomColor: themeColors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 8,
  },
  backButtonError: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: themeColors.buttonBackground,
    borderRadius: 8,
  },
  imageContainer: {
    position: 'relative',
    height: 250,
    backgroundColor: themeColors.backgroundMuted,
  },
  coverImage: {
    width: screenWidth,
    height: '100%',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  indicatorActive: {
    backgroundColor: themeColors.white,
  },
  propertyInfo: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    lineHeight: 30,
  },
  address: {
    fontSize: 16,
    color: themeColors.tint,
    marginBottom: 8,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 38,
  },
  detailsContainer: {
    backgroundColor: themeColors.backgroundMuted,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  detailItem: {
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  tag: {
    backgroundColor: themeColors.tabBarBackground,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionButtons: {
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: themeColors.buttonBackground,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: themeColors.buttonTextColor,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: themeColors.text,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: themeColors.text,
  },
  tabsContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: themeColors.border,
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: themeColors.text,
  },
  tabText: {
    fontSize: 14,
    color: themeColors.tint,
  },
  tabTextActive: {
    color: themeColors.text,
    fontWeight: '500',
  },
  tabContentContainer: {
    paddingVertical: 8,
  },
  tabContent: {
    gap: 8,
  },
  tabContentText: {
    fontSize: 14,
    color: themeColors.tint,
    lineHeight: 20,
  },
  detailLabel: {
    fontWeight: '500',
    color: themeColors.text,
  },
  mapContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  map: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: themeColors.backgroundMuted,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapMarker: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -20 }],
  },
  mapMarkerPin: {
    width: 20,
    height: 20,
    backgroundColor: '#ff0000',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  nearbyServices: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  serviceCard: {
    width: '48%',
    backgroundColor: themeColors.backgroundMuted,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  serviceDistance: {
    fontSize: 12,
    color: themeColors.tint,
    marginTop: 4,
  },
  agentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: themeColors.backgroundMuted,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 32,
  },
  agentAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  agentInfo: {
    flex: 1,
  },
  agentName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  agentRole: {
    fontSize: 14,
    color: themeColors.tint,
  },
  contactButton: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: themeColors.text,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: themeColors.text,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
  errorText: {
    fontSize: 16,
    color: themeColors.error,
    textAlign: 'center',
    marginTop: 50,
  },
  backButtonText: {
    fontSize: 14,
    color: themeColors.buttonTextColor,
  },
});

export default PropertyDetailScreen;