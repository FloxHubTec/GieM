
export interface Receipt {
  id: string;
  created_at: string;
  nf_number: string;
  receiver_name: string;
  product_description: string;
  delivery_date: string;
  image_path: string;
  content_type: string;
  user_id: string;
}

export interface ExtractionResult {
  nf_number: string;
  receiver_name: string;
  product_description: string;
  delivery_date?: string;
}

export type UserRole = 'admin' | 'operator';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
}
