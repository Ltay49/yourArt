import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  setReturnPath,
  getReturnPath,
  clearReturnPath
} from '../../utils/useLastPath';

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
    chicago: 'chicago',
    artwork: 'Artwork',
    index: 'Home',
    collection: 'collection',
    themet: 'themet'
  };

  useEffect(() => {
    const generateBreadcrumbs = async () => {
      const clean = (s: string) => s.replace(/\[|\]/g, '');

      let workingPath = pathname;

      if (pathname === '/collection' || pathname === '/login') {
        const returnPath = await getReturnPath();
        workingPath = returnPath || '/';
      }

      const segments = workingPath.split('/').filter(Boolean);
      const visibleSegments = segments
        .filter((s: string) => !s.startsWith('('))
        .map(clean);

      const rawGroup = segments.find((s: string) => s.startsWith('(')) || '';
      let group = rawGroup.replace(/[()]/g, '');

      const lastSegment = visibleSegments[visibleSegments.length - 1] || '';
      const isLastSegmentNumber = /^\d+$/.test(lastSegment);
      if (isLastSegmentNumber) {
        group = 'artwork';
      }

      const breadcrumbTrail =
        pathname === '/collection' || pathname === '/login'
          ? ['Home', ...visibleSegments, '']
          : ['Home', ...visibleSegments];

      setBreadcrumbParts(breadcrumbTrail);
      setRouteGroup(group);
    };

    generateBreadcrumbs();
  }, [pathname]);

  return (
    <View style={styles.container}>
      <View style={styles.footer}>
        <View style={styles.breadcrumbContainer}>
          {breadcrumbParts.map((segment, index) => {
            const isLast = index === breadcrumbParts.length - 1;
            let rawTitle = nameMap[segment] || segment;
            const title = rawTitle.length > 10 ? rawTitle.slice(0, 10) + '…' : rawTitle;


            const basePath =
            segment.toLowerCase() === 'home'
              ? '/'
              : `/${breadcrumbParts.slice(1, index + 1).join('/')}`;

            const isIdLike = /^\d+$/.test(segment);

            const pathWithGroup =
              routeGroup && isLast && isIdLike
                ? `/chicago/${routeGroup}/${segment}`
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
        <View style={styles.rightLinks}>
        <Text
            style={styles.footerText}
            onPress={async () => {
              if (pathname !== '/collection' && pathname !== '/login') {
                await setReturnPath(pathname);
              }
              router.push('/collection');
            }}
          >
            <Text style={styles.collection}>Collection</Text>
          </Text>
          <TouchableOpacity>
            <Text style={styles.footerText}
              onPress={async () => {
                if (pathname !== '/collection' && pathname !== '/login') {
                  await setReturnPath(pathname); 
                }
                router.push('/login');
              }}
            >Log In</Text>
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
    shadowColor: 'black', 
    shadowOffset: { width: 0, height: 0 },  
    shadowOpacity: 1,
    shadowRadius: 2, 
    elevation: 2,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    fontFamily: 'NunitoSans_700Bold'
  },
  activeText: {
    fontWeight: 'bold',
    color: '#000',  
  },
  separator: {
    color: '#888',
    fontSize: 16,
  },
  rightLinks: {
    flexDirection: 'row',
    gap: 5,  
  },
  collection: {
    color: 'brown',
  }
});

