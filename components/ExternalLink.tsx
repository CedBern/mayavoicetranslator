import { openBrowserAsync } from 'expo-web-browser';
import { type ComponentProps } from 'react';
import { Platform, Linking, TouchableOpacity, Text } from 'react-native';

type Props = ComponentProps<typeof TouchableOpacity> & { 
  href: string;
  children: React.ReactNode;
};

export function ExternalLink({ href, children, ...rest }: Props) {
  const handlePress = async (event: any) => {
    if (Platform.OS !== 'web') {
      // Prevent the default behavior of linking to the default browser on native.
      event.preventDefault();
      // Open the link in an in-app browser.
      await openBrowserAsync(href);
    } else {
      // Sur web, utiliser window.open
      window.open(href, '_blank');
    }
  };

  return (
    <TouchableOpacity
      {...rest}
      onPress={handlePress}
    >
      {typeof children === 'string' ? <Text>{children}</Text> : children}
    </TouchableOpacity>
  );
}
