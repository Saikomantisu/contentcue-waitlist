interface ImportMetaEnv {
  readonly GOOGLE_APPLICATION_CREDENTIALS_JSON: string;
  readonly SHEET_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
