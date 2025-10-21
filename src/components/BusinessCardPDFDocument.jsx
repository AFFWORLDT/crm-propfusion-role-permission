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
    fontFamily: 'Helvetica-Bold',
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
  cardLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#2d4263',
    fontFamily: 'Helvetica-Bold',
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
    fontFamily: 'Helvetica-Bold',
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
  
  // Back card styles - matching the grid pattern design
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
  backFooter: {
    height: 25,
    backgroundColor: '#2d4263',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backWebsiteText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
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
    fontFamily: 'Helvetica-Bold',
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
    fontFamily: 'Helvetica-Bold',
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
              <View style={styles.frontCard}>
                {/* Left Section - Personal Info with Dark Blue Background */}
                <View style={styles.frontLeftSection}>
                  <Text style={styles.personalName}>
                    {data?.name || 'Name'}
                  </Text>
                  
                  <View style={styles.contactInfo}>
                    <View style={styles.contactItem}>
                      <Text style={styles.contactText}>{data?.phone || 'Phone'}</Text>
                    </View>
                    <View style={styles.contactItem}>
                      <Text style={styles.contactText}>{data?.email || 'Email'}</Text>
                    </View>
                    <View style={styles.contactItem}>
                      <Text style={styles.contactText}>{data?.website || 'Website'}</Text>
                    </View>
                  </View>
                </View>

                {/* Right Section - Company Logo */}
                <View style={styles.frontRightSection}>
                  {data?.company_logo_url && (
                    <Image
                      src={data.company_logo_url}
                      style={styles.companyLogo}
                    />
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* Back Side */}
          <View>
            <Text style={styles.cardLabel}>Back Side</Text>
            <View style={styles.cardWrapper}>
              <View style={styles.backCard}>
                {/* Company Logo Centered */}
                <View style={styles.backMainContent}>
                  {data?.company_logo_url && (
                    <Image
                      src={data.company_logo_url}
                      style={styles.backLogo}
                    />
                  )}
                </View>
                
                {/* Bottom Dark Blue Footer with Website */}
                <View style={styles.backFooter}>
                  <Text style={styles.backWebsiteText}>
                    {data?.website || 'Website'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Detailed Information Section */}
        <View style={styles.detailsSection}>
          <Text style={styles.detailsTitle}>Contact Information</Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Full Name:</Text>
              <Text style={styles.detailValue}>{data?.name || 'N/A'}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Email:</Text>
              <Text style={styles.detailValue}>{data?.email || 'N/A'}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Phone:</Text>
              <Text style={styles.detailValue}>{data?.phone || 'N/A'}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Website:</Text>
              <Text style={styles.detailValue}>{data?.website || 'N/A'}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Company:</Text>
              <Text style={styles.detailValue}>{data?.company_name || 'N/A'}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default BusinessCardPDFDocument;
