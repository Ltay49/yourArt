import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { RelativePathString } from 'expo-router';
import React from 'react';

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();

  const nameMap: { [key: string]: string } = {
    "chicago": "Chicago",
    "artwork": "Artwork",
    "index": "Home",
  };

  // Function to construct breadcrumb parts
  const getBreadcrumbParts = (pathname: string) => {
    const segments = pathname.split('/').filter(Boolean);

    if (segments.length === 0) {
      return ['Home'];  // For the root path, return ["Home"]
    }

    return ['Home', ...segments];  // For other paths, prepend "Home"
  };

  const breadcrumbParts = getBreadcrumbParts(pathname);
  console.log("pathname:", pathname);
console.log("breadcrumbParts:", breadcrumbParts);

  return (
    <View style={styles.container}>
      <View style={styles.footer}>
        {/* Left side: Breadcrumb navigation */}
        <View style={styles.breadcrumbContainer}>
          {breadcrumbParts.map((segment, index) => {
            const isLast = index === breadcrumbParts.length - 1;
            const title = nameMap[segment.toLowerCase()] || (segment.charAt(0).toUpperCase() + segment.slice(1));
            
            // Only link the segment if it's not the last one
            const path = segment.toLowerCase() === 'home' 
            ? '/' 
            : `/${breadcrumbParts.slice(1, index + 1).join('/')}` as RelativePathString; 

            return (
              <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  style={[styles.footerText, isLast && styles.activeText]}
                  onPress={() => !isLast && router.push(path)} 
                >
                  {title}
                </Text>
                {index < breadcrumbParts.length - 1 && (
                  <Text style={styles.separator}> {'>'} </Text>
                )}
              </View>
            );
          })}
        </View>

        {/* Right side: Collection and Profile links */}
        <View style={styles.rightLinks}>
          <Text style={styles.footerText}>Collection</Text>
          <TouchableOpacity>
          <Text style={styles.footerText}
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
    shadowColor: 'black',  // Shadow color (black here)
    shadowOffset: { width: 0, height: 0 },  // x: 0 (no horizontal offset), y: 10 (vertical offset)
    shadowOpacity: 1,  // Set shadow opacity (0-1 range)
    shadowRadius: 2,  // Set blur radius
    elevation: 2,
    padding: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',  // Ensures space between the left and right sections
    alignItems: 'center',
  },
  breadcrumbContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    justifyContent:'flex-start',
    textAlign:'left',
    color: "#333",
    fontSize: 16,
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
});

