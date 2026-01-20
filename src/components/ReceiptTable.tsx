import React from "react";
import { Receipt } from "../../types";
import { FileText, User, Calendar, Box, MoreVertical } from "lucide-react";

interface ReceiptTableProps {
  receipts: Receipt[];
}

const ReceiptTable: React.FC<ReceiptTableProps> = ({ receipts }) => {
  if (receipts.length === 0) {
    return (
      <div className="text-center py-24 bg-brand-surface rounded-3xl border border-dashed border-brand-border">
        <Box className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">
          Pátio Vazio
        </p>
        <p className="text-zinc-600 text-sm mt-1">
          Nenhum registro de carga encontrado.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-brand-surface rounded-2xl shadow-xl border border-brand-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-900/50 border-b border-brand-border">
              <th className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                Referência NF
              </th>
              <th className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                Recebedor
              </th>
              <th className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                Manifesto
              </th>
              <th className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                Data / Hora
              </th>
              <th className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] text-right">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {receipts.map((r) => (
              <tr
                key={r.id}
                className="hover:bg-zinc-900/30 transition-colors group"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/10 rounded-lg group-hover:bg-brand-primary transition-colors">
                      <FileText className="w-4 h-4 text-brand-primary group-hover:text-white" />
                    </div>
                    <span className="font-black text-white text-sm tracking-tight">
                      #{r.nf_number}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-zinc-600" />
                    <span className="text-zinc-300 text-sm font-medium">
                      {r.receiver_name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-zinc-500 text-xs line-clamp-1 max-w-[200px] italic">
                    "{r.product_description}"
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    {r.delivery_date && (
                      <>
                        <span className="text-zinc-300 text-xs font-bold">
                          {new Date(r.delivery_date).toLocaleDateString(
                            "pt-BR",
                          )}
                        </span>
                        <span className="text-zinc-600 text-[10px] font-black uppercase">
                          {new Date(r.delivery_date).toLocaleTimeString(
                            "pt-BR",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </span>
                      </>
                    )}
                  </div>
                </td>

                <td className="px-6 py-5 text-right">
                  <button className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-all">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReceiptTable;
