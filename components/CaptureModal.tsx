
// Copyright © 2024 Floxhub. Todos os direitos reservados.
import React, { useState, useRef, useEffect } from 'react';
import { Camera, FileText, X, Check, Loader2, Upload, AlertCircle, FileDigit, Calendar } from 'lucide-react';
import { extractReceiptData } from '../services/geminiService';
import { uploadReceipt } from '../services/receiptService';
import { ExtractionResult, Receipt } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converte uma string de data (ISO ou similar) para o formato aceito pelo input datetime-local (yyyy-MM-ddThh:mm)
 */
const formatToDateTimeLocal = (dateStr?: string) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    const tzOffset = date.getTimezoneOffset() * 60000;
    const localISOTime = new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
    return localISOTime;
  } catch {
    return '';
  }
};

interface CaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newReceipt: Receipt) => void;
}

const CaptureModal: React.FC<CaptureModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nfError, setNfError] = useState(false);
  
  const [formData, setFormData] = useState<ExtractionResult>({
    nf_number: '',
    receiver_name: '',
    product_description: '',
    delivery_date: ''
  });

  const photoInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when closing
      setFile(null);
      setPreviewUrl(null);
      setImageBase64(null);
      setFormData({ nf_number: '', receiver_name: '', product_description: '', delivery_date: '' });
      setError(null);
      setNfError(false);
      setIsExtracting(false);
      setIsUploading(false);
    }
  }, [isOpen]);

  const handleFileSelection = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError(null);
    setNfError(false);
    setIsExtracting(true);

    // Create preview only for images
    if (selectedFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      setImageBase64(base64);

      try {
        const result = await extractReceiptData(base64, selectedFile.type);
        setFormData({
          nf_number: result.nf_number || '',
          receiver_name: result.receiver_name || '',
          product_description: result.product_description || '',
          delivery_date: result.delivery_date ? formatToDateTimeLocal(result.delivery_date) : formatToDateTimeLocal(new Date().toISOString())
        });
      } catch (err) {
        console.error("Erro no processamento:", err);
        setError("Não foi possível processar os dados automaticamente. Preencha manualmente.");
        setFormData(prev => ({ ...prev, delivery_date: formatToDateTimeLocal(new Date().toISOString()) }));
      } finally {
        setIsExtracting(false);
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleConfirm = async () => {
    if (!formData.nf_number.trim()) {
      setNfError(true);
      return;
    }
    if (!file) {
      setError("Nenhum arquivo selecionado.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const newReceipt = await uploadReceipt(
        file,
        formData.nf_number,
        formData.receiver_name,
        formData.product_description,
        formData.delivery_date ? new Date(formData.delivery_date).toISOString() : undefined
      );
      onConfirm(newReceipt);
    } catch (err: any) {
      setError(err.message || "Erro ao enviar para a Nuvem. Verifique sua conexão e configurações do sistema.");
      setIsUploading(false);
    }
  };

  const isPdf = file?.type === 'application/pdf';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-brand-surface rounded-t-3xl sm:rounded-3xl border-t sm:border border-brand-border shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-8 duration-500">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-brand-border flex justify-between items-center bg-zinc-900/50">
          <h3 className="text-lg font-black text-white flex items-center gap-2 uppercase tracking-tight">
            <Camera className="w-5 h-5 text-brand-primary" />
            Capturar Carga
          </h3>
          <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[80vh]">
          {!file ? (
            <div className="space-y-4">
              <p className="text-zinc-500 text-sm font-medium mb-2">Escolha como deseja registrar o comprovante:</p>
              
              <div className="grid grid-cols-1 gap-4">
                <button 
                  onClick={() => photoInputRef.current?.click()}
                  className="group relative flex items-center gap-4 p-6 bg-brand-dark border border-brand-border rounded-2xl hover:border-brand-primary transition-all active:scale-[0.98]"
                >
                  <div className="w-14 h-14 bg-orange-500/10 rounded-xl flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
                    <Camera className="w-8 h-8" />
                  </div>
                  <div className="text-left">
                    <span className="block text-white font-black text-lg">Nova Foto</span>
                    <span className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Câmera em tempo real</span>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    capture="environment" 
                    className="hidden" 
                    ref={photoInputRef}
                    onChange={handleFileSelection} 
                  />
                </button>

                <button 
                  onClick={() => galleryInputRef.current?.click()}
                  className="group relative flex items-center gap-4 p-6 bg-brand-dark border border-brand-border rounded-2xl hover:border-brand-primary transition-all active:scale-[0.98]"
                >
                  <div className="w-14 h-14 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-400 group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div className="text-left">
                    <span className="block text-white font-black text-lg">Arquivo / Galeria</span>
                    <span className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Imagens ou PDF</span>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*,application/pdf" 
                    className="hidden" 
                    ref={galleryInputRef}
                    onChange={handleFileSelection} 
                  />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Preview Area */}
              <div className="relative aspect-video w-full bg-brand-dark rounded-2xl border border-brand-border overflow-hidden flex items-center justify-center group">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                ) : (
                  <div className="flex flex-col items-center gap-3 p-4">
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center",
                      isPdf ? "bg-red-500/10 text-red-500" : "bg-zinc-800 text-zinc-500"
                    )}>
                      {isPdf ? <FileText className="w-10 h-10" /> : <FileDigit className="w-10 h-10" />}
                    </div>
                    <div className="text-center">
                      <span className="block text-white text-sm font-black truncate max-w-[240px]">{file.name}</span>
                      {isPdf && <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Documento PDF</span>}
                    </div>
                  </div>
                )}
                
                {(isExtracting || isUploading) && (
                  <div className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
                    <span className="text-xs font-black text-white uppercase tracking-widest animate-pulse">
                      {isUploading ? "Enviando para Nuvem..." : "Analisando com IA..."}
                    </span>
                  </div>
                )}
              </div>

              {/* Form Metadata */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="group">
                    <label className={cn(
                      "block text-[10px] font-black uppercase tracking-widest mb-1.5 transition-colors",
                      nfError ? "text-red-500" : "text-zinc-500 group-focus-within:text-brand-primary"
                    )}>
                      Número da NF *
                    </label>
                    <input 
                      type="text" 
                      placeholder="Ex: 001245"
                      value={formData.nf_number}
                      onChange={(e) => {
                        setFormData({...formData, nf_number: e.target.value});
                        if(e.target.value.trim()) setNfError(false);
                      }}
                      className={cn(
                        "w-full bg-brand-dark border rounded-xl px-4 py-3 focus:ring-2 focus:outline-none text-white font-bold transition-all",
                        nfError ? "border-red-500 focus:ring-red-500/20" : "border-brand-border focus:ring-brand-primary"
                      )}
                    />
                    {nfError && (
                      <span className="text-[10px] text-red-500 font-bold mt-1 block">O número da NF é obrigatório</span>
                    )}
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 group-focus-within:text-brand-primary transition-colors">Data Entrega</label>
                    <div className="relative">
                       <input 
                        type="datetime-local" 
                        value={formData.delivery_date}
                        onChange={(e) => setFormData({...formData, delivery_date: e.target.value})}
                        className="w-full bg-brand-dark border border-brand-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-primary focus:outline-none text-white font-bold transition-all appearance-none"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="group">
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 group-focus-within:text-brand-primary transition-colors">Nome do Recebedor</label>
                  <input 
                    type="text" 
                    placeholder="Quem recebeu a carga?"
                    value={formData.receiver_name}
                    onChange={(e) => setFormData({...formData, receiver_name: e.target.value})}
                    className="w-full bg-brand-dark border border-brand-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-primary focus:outline-none text-zinc-300 transition-all"
                  />
                </div>

                <div className="group">
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 group-focus-within:text-brand-primary transition-colors">Descrição dos Produtos</label>
                  <textarea 
                    rows={2}
                    placeholder="O que está sendo entregue?"
                    value={formData.product_description}
                    onChange={(e) => setFormData({...formData, product_description: e.target.value})}
                    className="w-full bg-brand-dark border border-brand-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-primary focus:outline-none text-zinc-300 resize-none transition-all"
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm font-bold">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1">{error}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setFile(null)}
                  disabled={isUploading}
                  className="flex-1 py-4 rounded-xl border border-brand-border text-zinc-400 font-bold hover:bg-zinc-800 transition-all disabled:opacity-50"
                >
                  Mudar Arquivo
                </button>
                <button 
                  onClick={handleConfirm}
                  disabled={isExtracting || isUploading}
                  className="flex-[2] py-4 rounded-xl bg-brand-primary text-white font-black shadow-xl shadow-orange-950/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                  {isUploading ? "Enviando..." : "Confirmar Envio"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaptureModal;
