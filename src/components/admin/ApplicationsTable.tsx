"use client";

import { useState } from "react";
import { Eye, Trash2, Edit, MoreHorizontal } from "lucide-react";
import { formatDate, getStatusLabel, getStatusColor } from "@/lib/utils";
import Link from "next/link";
import type { RentalApplication } from "@/types/application";

interface ApplicationsTableProps {
  applications: RentalApplication[];
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}

export default function ApplicationsTable({ applications, onStatusChange, onDelete }: ApplicationsTableProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <>
      {/* Vue mobile : cartes */}
      <div className="sm:hidden space-y-3">
        {applications.map((app) => (
          <div key={app._id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0">
                <p className="font-medium text-gray-900 truncate">{app.fullName}</p>
                <p className="text-xs text-gold">{app.dossierId}</p>
              </div>
              <span className={`flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                {getStatusLabel(app.status)}
              </span>
            </div>
            <p className="text-sm text-gray-500">{app.phone}</p>
            <p className="text-xs text-gray-400 mb-2">{app.email}</p>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold">{app.maxBudget?.toLocaleString("fr-CA")} $</p>
              <p className="text-xs text-gray-400">{formatDate(app.createdAt)}</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Link href={`/admin/demandes/${app._id}`} className="text-xs px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100">
                Voir détails
              </Link>
              <button onClick={() => onStatusChange(app._id, "en_cours")} className="text-xs px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                En cours
              </button>
              <button onClick={() => onStatusChange(app._id, "approuve")} className="text-xs px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100">
                Approuver
              </button>
              <button onClick={() => onDelete(app._id)} className="text-xs px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                Supprimer
              </button>
            </div>
          </div>
        ))}
        {applications.length === 0 && (
          <div className="text-center py-12 text-gray-400">Aucune demande trouvée</div>
        )}
      </div>

      {/* Vue desktop : tableau */}
      <div className="hidden sm:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Dossier</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Candidat</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Contact</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Budget</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Statut</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {applications.map((app) => (
                <tr key={app._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gold">{app.dossierId}</td>
                  <td className="px-4 py-3">{app.fullName}</td>
                  <td className="px-4 py-3">
                    <p className="text-gray-900">{app.phone}</p>
                    <p className="text-gray-400 text-xs">{app.email}</p>
                  </td>
                  <td className="px-4 py-3">{app.maxBudget?.toLocaleString("fr-CA")} $</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                      {getStatusLabel(app.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(app.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="relative">
                      <button onClick={() => setOpenMenu(openMenu === app._id ? null : app._id)} className="p-1 hover:bg-gray-100 rounded">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {openMenu === app._id && (
                        <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10 py-1">
                          <Link href={`/admin/demandes/${app._id}`} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50">
                            <Eye className="w-4 h-4" /> Voir détails
                          </Link>
                          <button onClick={() => { onStatusChange(app._id, "en_cours"); setOpenMenu(null); }} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 w-full text-left">
                            <Edit className="w-4 h-4" /> Marquer en cours
                          </button>
                          <button onClick={() => { onStatusChange(app._id, "approuve"); setOpenMenu(null); }} className="flex items-center gap-2 px-3 py-2 text-sm text-green-600 hover:bg-gray-50 w-full text-left">
                            <Edit className="w-4 h-4" /> Approuver
                          </button>
                          <button onClick={() => { onDelete(app._id); setOpenMenu(null); }} className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-50 w-full text-left">
                            <Trash2 className="w-4 h-4" /> Supprimer
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {applications.length === 0 && (
          <div className="text-center py-12 text-gray-400">Aucune demande trouvée</div>
        )}
      </div>
    </>
  );
}
