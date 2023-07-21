import { serve } from 'inngest/next';
import { inngest, manageQueue } from '@/inngest';

export const { GET, POST, PUT } = serve(inngest, [manageQueue]);
