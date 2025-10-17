import 'dotenv/config';

import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

import { GoogleAuth } from 'google-auth-library';
import { google } from 'googleapis';

export const server = {
  addNewWaitlist: defineAction({
    accept: 'form',
    input: z.object({
      email: z.string().email(),
    }),
    handler: async ({ email }) => {
      if (!import.meta.env.SHEET_ID) {
        return { success: false, error: 'Missing SHEET_ID environment variable' };
      }

      const credentials = JSON.parse(import.meta.env.GOOGLE_APPLICATION_CREDENTIALS_JSON!);

      const auth = new GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      const sheets = google.sheets({
        version: 'v4',
        auth,
      });

      const values = [[email, new Date().toISOString()]];

      const locationRes = await fetch('https://ipapi.co/json/');
      const locationData = await locationRes.json();

      if (locationData && locationData.country_name) {
        values[0].push(locationData.country_name);
      }

      try {
        const response = await sheets.spreadsheets.values.append({
          spreadsheetId: import.meta.env.SHEET_ID,
          range: 'Sheet1!A2',
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values,
          },
        });

        if (response.status !== 200) {
          return { success: false, error: 'Failed to append to Google Sheet' };
        }

        return { success: true };
      } catch (error) {
        console.error('Google API Error:', error);
        return { success: false, error: (error as Error).message };
      }
    },
  }),
};
