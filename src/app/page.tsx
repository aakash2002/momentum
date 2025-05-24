'use client'

// User-Defined Imports
import LandingScreen from '@/components/screens/LandingScreen';


export default function Home() {
  const hasPlanForToday = false;
  const userName = "Aakash";

  return <LandingScreen name={userName} hasPlanForToday={hasPlanForToday} />;
}