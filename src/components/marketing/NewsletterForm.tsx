'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState('todos');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-400/30 text-white flex items-center gap-3">
        <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
        <div className="text-left">
          <div className="font-display font-bold text-sm">
            ¡Suscripción registrada en MenteLúdica!
          </div>
          <p className="text-xs text-brand-neutral-200 mt-0.5">
            Enviaremos novedades, lanzamientos y cupones exclusivos a{' '}
            <strong>{email}</strong>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-2xl mx-auto"
    >
      <select
        value={interest}
        onChange={(e) => setInterest(e.target.value)}
        aria-label="Categoría de interés"
        className="h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-semibold focus:outline-none focus:border-brand-accent"
      >
        <option value="todos" className="text-brand-navy">
          Todo el catálogo
        </option>
        <option value="construccion" className="text-brand-navy">
          Juegos de construcción
        </option>
        <option value="rompecabezas" className="text-brand-navy">
          Rompecabezas
        </option>
        <option value="mesa" className="text-brand-navy">
          Juegos de mesa
        </option>
        <option value="personalizados" className="text-brand-navy">
          Souvenirs y Regalos Corporativos
        </option>
      </select>

      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Ingresa tu correo electrónico..."
        className="flex-1 h-12 px-4 rounded-xl bg-white text-brand-navy text-sm placeholder:text-brand-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand-accent"
      />

      <Button type="submit" variant="accent" size="md" className="h-12 px-6">
        <Send className="w-4 h-4" />
        Suscribirme
      </Button>
    </form>
  );
}

