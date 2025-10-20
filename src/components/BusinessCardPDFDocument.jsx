import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';

// Create styles for A4 PDF with business card layout
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
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
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
  // Front card styles
  frontCard: {
    width: '100%',
    height: '100%',
    position: 'relative',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  frontWaveBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '75%',
    height: '100%',
    backgroundColor: '#2d4263',
  },
  frontWhiteSection: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '25%',
    height: '100%',
    backgroundColor: '#ffffff',
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frontPersonalInfo: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '75%',
    height: '100%',
    padding: 12,
    justifyContent: 'center',
    zIndex: 2,
  },
  personalName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    fontFamily: 'Helvetica',
  },
  contactInfo: {
    marginTop: 10,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  contactIcon: {
    fontSize: 12,
    marginRight: 8,
    color: '#ffffff',
    width: 15,
  },
  contactText: {
    fontSize: 10,
    color: '#ffffff',
    fontFamily: 'Helvetica',
    flex: 1,
  },
  companyLogo: {
    width: 50,
    height: 35,
    objectFit: 'contain',
    marginBottom: 8,
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
    position: 'relative',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  backContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  backLogo: {
    width: 80,
    height: 60,
    objectFit: 'contain',
    marginBottom: 15,
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
