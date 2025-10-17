interface ImportMetaEnv {
  readonly GOOGLE_APPLICATION_CREDENTIALS: string;
  readonly SHEET_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
