import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  setReturnPath,
  getReturnPath,
  clearReturnPath
} from '../Functions/useLastPath';
import {
  useFonts,
  NunitoSans_900Black,
  NunitoSans_400Regular_Italic,
  NunitoSans_700Bold,
} from '@expo-google-fonts/nunito-sans';

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();
  const [breadcrumbParts, setBreadcrumbParts] = useState<string[]>([]);
  const [routeGroup, setRouteGroup] = useState<string>('');

  const [fontsLoaded] = useFonts({
    NunitoSans_900Black,
    NunitoSans_400Regular_Italic,
    NunitoSans_700Bold,
  });

  const nameMap: { [key: string]: string } = {
    chicago: 'Chicago',
    artwork: 'Artwork',
    index: 'Home',
    collection: 'Collection',
  };

  // useSavePathOnNavigate(pathname);

  useEffect(() => {
    const generateBreadcrumbs = async () => {
      const segments = pathname.split('/').filter(Boolean);
      const clean = (s: string) => s.replace(/\[|\]/g, '');
      const visibleSegments = segments
        .filter((s: string) => !s.startsWith('('))
        .map(clean);
  
      // Find raw group segment (with parentheses)
      const rawGroup = segments.find((s: string) => s.startsWith('(')) || '';
      let group = rawGroup.replace(/[()]/g, ''); // remove parentheses
  
      // If last segment is a number, force group to 'artwork'
      const lastSegment = visibleSegments[visibleSegments.length - 1] || '';
      const isLastSegmentNumber = /^\d+$/.test(lastSegment);
  
      if (isLastSegmentNumber) {
        group = 'artwork';
      }
  
      if (pathname === '/Collection') {
        const returnPath = await getReturnPath();
        const returnSegments = returnPath
          ?.split('/')
          .filter((s: string) => !s.startsWith('(') && s)
          .map(clean) || [];
  
        setBreadcrumbParts(['Home', ...returnSegments, '']);
        setRouteGroup(group);
      } else {
        setRouteGroup(group);
        setBreadcrumbParts(['Home', ...visibleSegments]);
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

            const basePath =
              segment.toLowerCase() === 'home'
                ? '/'
                : `/${breadcrumbParts.slice(1, index + 1).join('/')}`;

            const isIdLike = /^\d+$/.test(segment);

            const pathWithGroup =
            routeGroup && isLast && isIdLike
              ? `/Chicago/${routeGroup}/${segment}`
              : basePath;

            return (
              <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  style={[styles.footerText, isLast && styles.activeText]}
                  onPress={() => {
                    if (!isLast) {
                      router.push(pathWithGroup as any);
                    }
                  }}
                >
                  {title}
                </Text>
                {index < breadcrumbParts.length - 1 &&
                  breadcrumbParts[index + 1] !== '' && (
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
  onPress={async () => {
    await setReturnPath(pathname); // save where we’re coming from
    router.push('/Collection');
  }}
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

