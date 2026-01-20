
import React, { useState, useRef } from 'react';
import { extractReceiptData } from '../../services/geminiService';
import { ExtractionResult } from '../../types';
import { Camera, Upload, AlertCircle, Loader2 } from 'lucide-react';

interface ScannerProps {
  onDataExtracted: (data: ExtractionResult, imageBase64: string, mimeType: string) => void;
}

const Scanner: React.FC<ScannerProps> = ({ onDataExtracted }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64String = (reader.result as string).split(',')[1];
        try {
          const result = await extractReceiptData(base64String, file.type);
          onDataExtracted(result, base64String, file.type);
        } catch (err) {
          setError("Falha na análise. Verifique se a foto está legível.");
        } finally {
          setIsScanning(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("Erro ao processar arquivo.");
      setIsScanning(false);
    }
  };

  return (
    <div className="bg-brand-surface rounded-3xl border border-brand-border p-12 text-center shadow-2xl relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-md mx-auto relative z-10">
        <div className="mb-10">
          <div className="w-24 h-24 bg-orange-500/10 border border-orange-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-orange-950/20 rotate-3">
            <Camera className="w-12 h-12 text-brand-primary" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">Scanner de Carga</h2>
          <p className="text-zinc-500 mt-3 font-medium">Extraia dados de notas fiscais e canhotos instantaneamente.</p>
        </div>

        <div className="relative group">
          <input 
            type="file" 
            accept="image/*,application/pdf"
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={isScanning}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isScanning}
            className={`w-full py-8 px-6 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-4 ${
              isScanning 
                ? 'bg-zinc-900 border-zinc-800 cursor-not-allowed' 
                : 'border-brand-border bg-brand-dark hover:bg-zinc-900 hover:border-brand-primary group cursor-pointer shadow-inner'
            }`}
          >
            {isScanning ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
                <span className="font-black text-zinc-300 uppercase tracking-widest text-xs">Processando com Gemini AI</span>
              </div>
            ) : (
              <>
                <div className="bg-zinc-800 p-4 rounded-xl group-hover:bg-brand-primary transition-colors">
                  <Upload className="w-6 h-6 text-zinc-400 group-hover:text-white" />
                </div>
                <div>
                  <span className="block font-black text-white text-lg">Selecionar Arquivo</span>
                  <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">JPG, PNG ou PDF</span>
                </div>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl flex items-center gap-3 font-bold">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="mt-12 flex items-center justify-between px-4">
          <div className="flex flex-col items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-lg shadow-orange-500/50 animate-pulse"></div>
             <span className="text-[10px] font-black text-zinc-600 uppercase tracking-tighter">Real-time</span>
          </div>
          <div className="h-px bg-brand-border flex-1 mx-6"></div>
          <div className="flex flex-col items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-lg shadow-orange-500/50"></div>
             <span className="text-[10px] font-black text-zinc-600 uppercase tracking-tighter">OCR Engine</span>
          </div>
          <div className="h-px bg-brand-border flex-1 mx-6"></div>
          <div className="flex flex-col items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-lg shadow-orange-500/50 animate-pulse"></div>
             <span className="text-[10px] font-black text-zinc-600 uppercase tracking-tighter">Vision Pro</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scanner;
