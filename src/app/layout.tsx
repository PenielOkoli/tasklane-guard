import type { Metadata } from 'next';
import '@fontsource-variable/dm-sans';
import './globals.css';
export const metadata: Metadata = { title: 'Tasklane Guard — Trust with boundaries', description: 'Run golden tasks, inspect evidence, review feedback and compare AI versions.' };
export default function Layout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }

