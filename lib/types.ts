export type Lang = "fr" | "en";

export type Work = {
  id: string;
  title: string;
  category: string;
  image_url: string;
  image_path: string;
  width: number | null;
  height: number | null;
  created_at: string;
};

export type PublicSettings = {
  whatsapp: string;
  phone: string;
  email: string;
  location: string;
};

export type SettingsRow = PublicSettings & {
  password_hash: string;
};
