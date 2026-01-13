import { storage } from '@/utils/storage';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';

export default function Index() {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasHippo, setHasHippo] = useState(false);

  useEffect(() => {
    checkHippo();
  }, []);

  const checkHippo = async () => {
    try {
      const hasCreatedHippo = await storage.getItem('hasCreatedHippo');
      setHasHippo(hasCreatedHippo === 'true');
    } catch (error) {
      console.error('Failed to check hippo:', error);
      setHasHippo(false);
    } finally {
      setHasLoaded(true);
    }
  };

  if (!hasLoaded) {
    return null;
  }

  if (hasHippo) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/onboarding" />; // Просто /onboarding
  }
}