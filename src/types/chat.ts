export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  content: string;
  role: MessageRole;
  tx_hash?: string;
}

export interface DisplayValue {
  value: number;
  display_value: string;
}

export interface TokenData {
  token_address: string;
  balance: DisplayValue;
  name: string;
  symbol: string;
  decimals: number;
  logo_url: string;
  price?: DisplayValue;
  usd_value?: DisplayValue;
}

export interface ApiResponse {
  holdings: TokenData[];
  total_usd_value?: DisplayValue;
}