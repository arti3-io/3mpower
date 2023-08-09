import { serve } from 'inngest/next';
import { inngest, manageQueue } from '@/inngest';
import { scapper } from '@/inngest/scrapper';

export const { GET, POST, PUT } = serve(inngest, [scapper, manageQueue]);
