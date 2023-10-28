import { readFileSync } from 'fs';

export const privateKey = readFileSync('private.pub');
export const publicKey = readFileSync('public.pub');
