import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Image, StyleSheet, useColorScheme, Dimensions, NativeSyntheticEvent, NativeScrollEvent, Modal, Platform, StatusBar, useWindowDimensions, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { PropertyDTO } from '@/components/Agent/PropertyDashboard/types';
import { Colors } from '@/constants/Colors';
import { ThemedIcon } from '@/components/ThemedIcon';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useTranslation } from 'react-i18next';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Gallery from 'react-native-awesome-gallery';
import VisitSchedulerPanel from '../../../components/Buyer/VisitSchedulerPanel';
import OfferPanel from '../../../components/Offer/OfferPanel';
import httpClient from '@/src/core/httpClient';
import { PlaceDTO } from '@/src/dto/response/PlaceDTO';
import { ServiceCard } from '@/components/Property/ServiceCard';
import MapView, { Marker } from 'react-native-maps';
import { generatePropertyImageUrls } from '@/src/utils/imageUtils';
import VisitApiService from '@/src/api/VisitApi';
import { AvailabilityDTO } from '@/src/dto/response/AvailabilityDTO';

const { width: screenWidth } = Dimensions.get('window');

function formatAddress(address: PropertyDTO['address']): string {
  return `${address?.city} (${address?.province}, ${address?.country}) - ${address.street} ${address?.streetNumber}`;
}

const PropertyDetailScreen: React.FC = () => {
  const { propertyId } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isVisitPanelVisible, setVisitPanelVisible] = useState(false);
  const [isOfferPanelVisible, setOfferPanelVisible] = useState(false);
  const [isGalleryVisible, setIsGalleryVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [property, setProperty] = useState<PropertyDTO>();
  const [places, setPlaces] = useState<PlaceDTO[]>([]);
  const [fetchingProperty, setFetchingProperty] = useState(false);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [agentAvailabilities, setAgentAvailabilities] = useState<AvailabilityDTO[]>([]);

  const scrollViewRef = useRef<ScrollView>(null);
  const { t } = useTranslation();

  const iconNames: { [key: string]: string } = {
    'education': 'material-symbols:school',
    'healthcare': 'material-symbols:local-hospital',
    'commercial': 'material-symbols:material-symbols:shopping-bag',
    'public_transport': 'material-symbols:train',
    'leisure': 'material-symbols:park',
  }

  function parseLocalDateTime(dateArray: number[]): Date {
    const [year, month, day, hour, minute, second, nanosecond] = dateArray;
    // Note: JavaScript months are 0-indexed, but Java months are 1-indexed
    return new Date(year, month - 1, day, hour, minute, second, nanosecond / 1000000);
}

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      if (!propertyId) return;
      setFetchingProperty(true);
      try {
        const response = await httpClient.get<PropertyDTO>(`/properties/details/${propertyId}`);
        console.log("Property: ", response.data);
        setProperty(response.data);
      } catch (error) {
        // no alert, continue silently (error message is shown anyway when not fetching anymore)
        console.error('Error fetching property details:', error);
      } finally {
        setFetchingProperty(false);
      }
    }
    const fetchNearbyServices = async () => {
      if (!propertyId) return;
      httpClient.get<PlaceDTO[]>(`/api/properties/${propertyId}/places`).then(response => {
        console.log('Fetched nearby services:', response.data);
        setPlaces(response.data);
      }).catch(error => {
        // no alert, continue silently
        console.error('Error fetching nearby services:', error);
      });
    };
    
    fetchPropertyDetails();
    fetchNearbyServices();
  }, []);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!propertyId || !property) {
        return;
      }
      const availabilities = await VisitApiService.getAvailableSlots(property.agent.id);
      setAgentAvailabilities(availabilities);
    };
    fetchAvailability();
  }, [property, propertyId]);

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

  const styles = createStyles(themeColors);

  if (fetchingProperty) {
    return (
      <ThemedView style={styles.centeredContainer}>
        <ThemedText style={styles.loadingText}>{t('loading')}</ThemedText>
      </ThemedView>
    );
  }
  else if (!property) {
    return (
      <ThemedView style={styles.centeredContainer}>
        <ThemedText style={styles.errorText}>{t('propertyNotFound')}</ThemedText>
        <TouchableOpacity style={styles.backButtonError} onPress={handleBack}>
          <ThemedText style={styles.backButtonText}>{t('goBack')}</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const images = (() => {
    // Prefer generated URLs when available; fall back to placeholder
    const generated = property ? generatePropertyImageUrls((property as any).firstImageUrl, (property as any).numberOfImages) : [];
    // DEBUG: log generated array from imageUtils and final images used in the UI
    console.log('property-detail: property.firstImageUrl ->', (property as any)?.firstImageUrl);
    console.log('property-detail: property.numberOfImages ->', (property as any)?.numberOfImages);
    console.log('property-detail: generated image URLs ->', generated);
    const imgs = (generated && generated.length > 0) ? generated : ['https://via.placeholder.com/400x250'];
    console.log('property-detail: final images array ->', imgs);
    return imgs;
  })();

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
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelectedImageIndex(index);
                  setIsGalleryVisible(true);
                }}
                activeOpacity={0.7}
              >
                <Image
                  source={{ uri: uri || 'https://via.placeholder.com/400x250' }}
                  style={styles.coverImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
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
          <ThemedText style={styles.title}>{formatAddress(property.address) || 'Immobile'}</ThemedText>
          <ThemedText style={styles.address}>
            {property.address?.city || 'Indirizzo non disponibile'}
          </ThemedText>
          <ThemedText style={styles.price}>{formatPrice(property.price)}</ThemedText>
        </View>

        {/* Dettagli principali */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <ThemedIcon icon="material-symbols:home-outline" size={24} lightColor={themeColors.text} darkColor={themeColors.text} accessibilityLabel="Proprietà" />
            <ThemedText style={styles.detailText}>
              {t('property_category.sub.' + property.propertyCategory)}
            </ThemedText>
          </View>
          <View style={styles.detailItem}>
            <ThemedIcon icon="material-symbols:calendar-today" size={24} lightColor={themeColors.text} darkColor={themeColors.text} accessibilityLabel="Creato" />
            <ThemedText style={styles.detailText}>
              { parseLocalDateTime(property.createdAt).toLocaleDateString('it-IT')}
            </ThemedText>
          </View>
          <View style={styles.detailItem}>
            <ThemedIcon icon="material-symbols:update" size={24} lightColor={themeColors.text} darkColor={themeColors.text} accessibilityLabel="Aggiornato" />
            <ThemedText style={styles.detailText}>
              {parseLocalDateTime(property.updatedAt).toLocaleDateString('it-IT')}
            </ThemedText>
          </View>
        </View>

        {/*Description */}
        <View style={styles.descriptionContainer}>
          <ThemedText style={styles.descriptionText}>
            {property.description || t('noDescriptionAvailable')}
          </ThemedText>
        </View>

        {/* Tag/Badge */}
        <View style={styles.tagsContainer}>
          <View style={styles.tag}>
            <ThemedText style={styles.tagText}>
              {t("property_status." + property.condition)}
            </ThemedText>
          </View>
          <View style={styles.tag}>
            <ThemedText style={styles.tagText}>
              {property.contractType === 'rent' ? t('forRent') : t('forSale')}
            </ThemedText>
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

        {/* Mappa */}
        {property.address.latitude && property.address.longitude && (
        <View style={styles.mapContainer}>
          <ThemedText style={styles.sectionTitle}>{t('position')}</ThemedText>
          <MapView style={styles.map} region={{ latitudeDelta: 0.1, longitudeDelta:0.1, latitude: property.address.latitude, longitude: property.address.longitude }} >
            <Marker coordinate={{latitude: property.address.latitude, longitude: property.address.longitude}} pinColor={ "#c7f4ffff" }/>
          </MapView>
        </View>)}

        {/* Nearby Services */}
        <View style={styles.nearbyServices}>
          <ThemedText style={styles.sectionTitle}>{t('nearbyServices')}</ThemedText>
          <View style={styles.servicesGrid}>
            {places.filter((place) => place.name).map((place, index) => (
              <ServiceCard key={index} place={place} iconName={iconNames[place.category] ? iconNames[place.category] : 'material-symbols:push-pin'} />
            ))}
          </View>
        </View>

        {/* Agente immobiliare */}
        {property.agent && property.agent.firstName && property.agent.lastName && property.agent.email &&
        <View style={styles.agentCard}>
          <View style={styles.agentInfo}>
            <ThemedText style={styles.agentName}>{`${property.agent.firstName} ${property.agent.lastName}`}</ThemedText>
            <ThemedText style={styles.agentRole}>{property.agent.agency?.name}</ThemedText>
          </View>
          <TouchableOpacity style={styles.contactButton} onPress={() => Linking.openURL(`mailto:${property.agent.email}`)}>
            <ThemedText style={styles.contactButtonText}>{t('getInTouch')}</ThemedText>
          </TouchableOpacity>
        </View>
        }
      </ScrollView>
      <VisitSchedulerPanel
        isVisible={isVisitPanelVisible}
        onClose={() => setVisitPanelVisible(false)}
        availableDates={agentAvailabilities}
        propertyId={property.id}
        agentId={property.agent.id}
      />
      <OfferPanel
        isVisible={isOfferPanelVisible}
        onClose={() => setOfferPanelVisible(false)}
        propertyAddress={formatAddress(property?.address) || 'Indirizzo non disponibile'}
        askingPrice={property?.price ? property.price.toString() : '0'}
      />

      {/* Gallery Modal */}
      <Modal
        visible={isGalleryVisible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setIsGalleryVisible(false)}
        supportedOrientations={['portrait', 'landscape']}
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Gallery
            data={images.map(uri => ({ uri }))}
            renderItem={({ item }) => {
              return (
                <Image
                  source={{ uri: item.uri }}
                  style={{ width: windowWidth, height: windowHeight }}
                  resizeMode="contain"
                />
              );
            }}
            keyExtractor={(_item, index) => index.toString()}
            initialIndex={selectedImageIndex}
            onIndexChange={(index) => setSelectedImageIndex(index)}
            swipeEnabled={true}
            pinchEnabled={true}
            doubleTapEnabled={true}
            maxScale={6}
            doubleTapScale={3}
            onSwipeToClose={() => setIsGalleryVisible(false)}
            hideAdjacentImagesOnScaledImage={false}
            disableTransitionOnScaledImage={false}
          />
          {/* Overlay Controls */}
          <View style={styles.galleryOverlay}>
            <TouchableOpacity
              onPress={() => setIsGalleryVisible(false)}
              style={styles.closeButton}
            >
              <ThemedText style={styles.closeButtonTextTop}>✕</ThemedText>
            </TouchableOpacity>
            <ThemedText style={styles.galleryCounter}>
              {selectedImageIndex + 1} / {images.length}
            </ThemedText>
          </View>
        </GestureHandlerRootView>
      </Modal>
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
  descriptionContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 14,
    color: themeColors.tint,
    lineHeight: 20,
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
  imageTouchable: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  galleryOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 50,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 50,
    right: 20, /* Spostato a destra */
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  galleryCounter: {
    position: 'absolute',
    top: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 50,
    left: 20, /* Spostato a sinistra */
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    fontSize: 14,
    fontWeight: '600',
    zIndex: 1000,
  },
  closeButtonTextTop: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default PropertyDetailScreen;