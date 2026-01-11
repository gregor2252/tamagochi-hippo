// app/index.tsx
import { storage } from '@/utils/storage';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';

export default function Index() {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState<string>('/onboarding');

  useEffect(() => {
    checkHippo();
  }, []);

  const checkHippo = async () => {
    try {
      const hasCreatedHippo = await storage.getItem('hasCreatedHippo');

      if (hasCreatedHippo === 'true') {
        setShouldRedirect('/(tabs)');
      } else {
        setShouldRedirect('/onboarding');
      }
    } catch (error) {
      console.error('Failed to check hippo:', error);
      setShouldRedirect('/onboarding');
    } finally {
      setHasLoaded(true);
    }
  };

  if (!hasLoaded) {
    return null;
  }

  if (shouldRedirect === '/(tabs)') {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/onboarding" />;
  }
}