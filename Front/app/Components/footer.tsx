import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { RelativePathString } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { getLastPath, useSavePathOnNavigate } from '../Functions/useLastPath'; // adjust path
import { useFonts, NunitoSans_900Black, NunitoSans_400Regular_Italic, NunitoSans_700Bold } from '@expo-google-fonts/nunito-sans';

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();
  const [breadcrumbParts, setBreadcrumbParts] = useState<string[]>([]);

  const [fontsLoaded] = useFonts({
    NunitoSans_900Black,
    NunitoSans_400Regular_Italic,
    NunitoSans_700Bold
  });

  const nameMap: { [key: string]: string } = {
    "chicago": "Chicago",
    "artwork": "Artwork",
    "index": "Home",
    "collection": "Collection",
  };

  useSavePathOnNavigate(pathname); // Save path unless it's /Collection

  useEffect(() => {
    const generateBreadcrumbs = async () => {
      const segments = pathname.split('/').filter(Boolean);

      if (pathname === '/Collection') {
        const lastPath = await getLastPath();
        const lastSegments = lastPath?.split('/').filter(Boolean) || [];
        setBreadcrumbParts(['Home', ...lastSegments, '']);
      } else {
        setBreadcrumbParts(['Home', ...segments]);
      }
    };

    generateBreadcrumbs();
  }, [pathname]);

  return (
    <View style={styles.container}>
      <View style={styles.footer}>
        {/* Breadcrumb navigation */}
        <View style={styles.breadcrumbContainer}>
          {breadcrumbParts.map((segment, index) => {
            const isLast = index === breadcrumbParts.length - 1;
            const title = nameMap[segment.toLowerCase()] || segment;

            const path = segment.toLowerCase() === 'home'
              ? '/'
              : `/${breadcrumbParts.slice(1, index + 1).join('/')}`;

            return (
              <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  style={[styles.footerText, isLast && styles.activeText]}
                  onPress={() => {
                    if (!isLast) {
                      router.push(path as any); // replace RelativePathString with `any` or `as const` to avoid TS error
                    }
                  }}
                >
                  {title}
                </Text>
                {index < breadcrumbParts.length - 1 && breadcrumbParts[index + 1] !== '' && (
                  <Text style={styles.separator}> {'>'} </Text>
                )}
              </View>
            );
          })}

        </View>

        {/* Right side links */}
        <View style={styles.rightLinks}>
          <Text
            style={styles.footerText}
            onPress={() => router.push('/Collection')}
          >
            <Text style={styles.collection}>Collection</Text>
          </Text>
          <TouchableOpacity>
            <Text style={styles.footerText}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    borderColor: 'grey',
    shadowColor: 'black',  // Shadow color (black here)
    shadowOffset: { width: 0, height: 0 },  // x: 0 (no horizontal offset), y: 10 (vertical offset)
    shadowOpacity: 1,  // Set shadow opacity (0-1 range)
    shadowRadius: 2,  // Set blur radius
    elevation: 2,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',  // Ensures space between the left and right sections
    alignItems: 'center',
  },
  breadcrumbContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    justifyContent: 'flex-start',
    textAlign: 'left',
    color: "#333",
    fontSize: 16,
    fontFamily:'NunitoSans_700Bold'
  },
  activeText: {
    fontWeight: 'bold',
    color: '#000',  // Darker color for the active page
  },
  separator: {
    color: '#888',
    fontSize: 16,
  },
  rightLinks: {
    flexDirection: 'row',
    gap: 5,  // Adds space between "Collection" and "Profile"
  },
  collection:{
    color:'brown',

  }
});

