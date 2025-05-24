// Three base colors per theme
const lightPrimary = '#EBF2FA';    // Light blue - backgrounds
const lightSecondary = '#c1deff';   // Medium blue - accents
const lightTertiary = '#1e3a8a';    // Dark blue - text

const darkPrimary = '#050A16';      // Dark blue - backgrounds
const darkSecondary = '#0b2138';    // Medium blue - accents
const darkTertiary = '#D0E1F9';     // Light blue - text

export const Colors = {
  light: {
    text: lightTertiary,
    background: lightPrimary,
    error : '#D32F2F', // Darker red for better contrast on light bg
    success: '#2E7D32', // Standard green
    info: '#0288D1',    // Standard blue
    tint: lightTertiary,
    tabBarBackground: lightSecondary, // Sfondo TabBar light
    tabIconDefault: lightTertiary, // Icone non selezionate light
    tabIconSelected: lightTertiary, // Icone selezionate light

    roleCardText: lightPrimary,
    roleCardBackground: lightTertiary,
    iconColor: lightPrimary,

    loginCardBackground: lightSecondary,
    loginCardTextField: lightTertiary,
    loginCardLabel: lightTertiary,
    buttonBackground: lightTertiary,
    buttonTextColor: lightPrimary,

    visitStatusPending: '#FFA500',
    visitStatusAccepted: '#008000',
    visitStatusRejected: '#FF0000',
    visitStatusDeleted: '#A9A9A9',

    // Property card colors
    propertyCardBackground: '#FFFFFF',
    propertyCardText: lightTertiary,
    propertyCardDetail: lightTertiary,
    propertyCardActionButton: lightPrimary,
    border: '#e5e7eb',
  },
  dark: {
    text: darkTertiary,
    background: darkPrimary,
    error : '#EF5350', // Lighter red for dark bg
    success: '#66BB6A', // Lighter green for dark bg
    info: '#4FC3F7',    // Lighter blue for dark bg
    tint: darkTertiary,
    tabBarBackground: darkSecondary, // Sfondo TabBar dark
    tabIconDefault: darkTertiary, // Icone non selezionate dark
    tabIconSelected: darkTertiary,
    
    roleCardText: darkPrimary,
    roleCardBackground: darkTertiary,
    iconColor: darkPrimary,
    
    loginCardBackground: darkSecondary,
    loginCardTextField: darkTertiary,
    loginCardLabel: darkTertiary,
    buttonBackground: darkTertiary,
    buttonTextColor: darkPrimary,

    visitStatusPending: '#FFA500',
    visitStatusAccepted: '#00FF00',
    visitStatusRejected: '#FF3333',
    visitStatusDeleted: '#C0C0C0',

    // Property card colors
    propertyCardBackground: darkSecondary,
    propertyCardText: darkTertiary,
    propertyCardDetail: darkTertiary,
    propertyCardActionButton: darkPrimary,
    border: '#374151',
  },
};
