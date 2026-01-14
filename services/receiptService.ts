
// Copyright © 2024 Floxhub. Todos os direitos reservados.
import { supabase } from '../lib/supabase';
import { Receipt } from '../types';

/**
 * Faz o upload de um comprovante para o Banco de Dados e Storage.
 * Desenvolvido por Floxhub.
 */
export async function uploadReceipt(
  file: File, 
  nf: string, 
  receiver: string, 
  description: string,
  deliveryDate?: string
): Promise<Receipt> {
  const finalDeliveryDate = deliveryDate || new Date().toISOString();

  // Fallback se o servidor não estiver configurado
  if (!supabase) {
    console.warn("Banco de Dados não configurado. Executando em modo de demonstração.");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: Math.random().toString(36).substr(2, 9),
          created_at: new Date().toISOString(),
          nf_number: nf,
          receiver_name: receiver,
          product_description: description,
          delivery_date: finalDeliveryDate,
          image_path: 'mock-path',
          content_type: file.type,
          user_id: 'mock-user'
        });
      }, 1000);
    });
  }

  // 1. Criar nome único para o arquivo
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${nf.replace(/\s+/g, '_')}.${fileExt}`;
  const filePath = fileName;

  // 2. Upload para a nuvem
  const { error: uploadError } = await supabase.storage
    .from('receipt-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    console.error('Erro de upload na nuvem:', uploadError);
    throw new Error(`Falha no envio do arquivo: ${uploadError.message}`);
  }

  // 3. Inserção no Banco de Dados
  const { data, error: insertError } = await supabase
    .from('receipts')
    .insert([
      {
        nf_number: nf,
        receiver_name: receiver,
        product_description: description,
        delivery_date: finalDeliveryDate,
        image_path: filePath,
        content_type: file.type,
      }
    ])
    .select()
    .single();

  if (insertError) {
    console.error('Erro de registro no banco:', insertError);
    throw new Error(`Erro ao salvar dados no servidor: ${insertError.message}`);
  }

  return data as Receipt;
}
