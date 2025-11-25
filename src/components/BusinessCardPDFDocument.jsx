import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';

// Create styles matching the actual BusinessCard component
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#2d4263',
    fontFamily: 'Helvetica',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666666',
    fontFamily: 'Helvetica',
  },
  cardContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 40,
  },
  cardWrapper: {
    width: '85.6mm',
    height: '53.98mm',
    border: '2px solid #e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#2d4263',
    fontFamily: 'Helvetica',
  },
  
  // Front card styles - matching the wave design
  frontCard: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    backgroundColor: '#ffffff',
  },
  frontLeftSection: {
    width: '75%',
    height: '100%',
    backgroundColor: '#2d4263',
    padding: 12,
    justifyContent: 'center',
  },
  frontRightSection: {
    width: '25%',
    height: '100%',
    backgroundColor: '#ffffff',
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  personalName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    fontFamily: 'Helvetica',
  },
  contactInfo: {
    marginTop: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  contactIcon: {
    fontSize: 10,
    marginRight: 6,
    color: '#ffffff',
  },
  contactText: {
    fontSize: 9,
    color: '#ffffff',
    fontFamily: 'Helvetica',
  },
  companyLogo: {
    width: 45,
    height: 30,
    objectFit: 'contain',
  },
  companyName: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#2d4263',
    textAlign: 'center',
    fontFamily: 'Helvetica',
  },
  // Back card styles
  backCard: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    backgroundColor: '#f5f5f5',
  },
  backMainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  backLogo: {
    width: 70,
    height: 50,
    objectFit: 'contain',
  },
  backCompanyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Helvetica',
  },
  backWebsite: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
    backgroundColor: '#2d4263',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backWebsiteText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Helvetica',
  },
  
  // Details section
  detailsSection: {
    marginTop: 50,
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2d4263',
    fontFamily: 'Helvetica',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    width: '48%',
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333333',
    marginRight: 8,
    fontFamily: 'Helvetica',
    width: 80,
  },
  detailValue: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'Helvetica',
    flex: 1,
  },
});

const BusinessCardPDFDocument = ({ data }) => {
  const themeColor = data?.themeColor || '#2d4263';
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Title */}
        <Text style={styles.title}>Professional Business Card</Text>
        <Text style={styles.subtitle}>Digital Business Card Design</Text>
        
        {/* Business Cards Container */}
        <View style={styles.cardContainer}>
          
          {/* Front Side */}
          <View>
            <Text style={styles.cardLabel}>Front Side</Text>
            <View style={styles.cardWrapper}>
              {data.frontImg ? (
                <Image src={data.frontImg} style={styles.cardImage} />
              ) : (
                <View style={styles.frontCard}>
                  <View style={{...styles.frontWaveBackground, backgroundColor: themeColor}} />
                  <View style={{...styles.backWebsite, backgroundColor: themeColor, height: 18}}>
                    <Text style={styles.backWebsiteText}>ONEXPROPERTY.COM</Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Back Side */}
          <View>
            <Text style={styles.cardLabel}>Back Side</Text>
            <View style={styles.cardWrapper}>
              {data.backImg ? (
                <Image src={data.backImg} style={styles.cardImage} />
              ) : (
                <View style={styles.backCard}>
                  <View style={{...styles.backWebsite, backgroundColor: themeColor}}>
                    <Text style={styles.backWebsiteText}>ONEXPROPERTY.COM</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Removed contact details grid as requested */}
      </Page>
    </Document>
  );
};

export default BusinessCardPDFDocument;
