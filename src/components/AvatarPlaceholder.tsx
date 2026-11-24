import React from 'react';
import { User } from 'lucide-react';

interface AvatarPlaceholderProps {
  name: string;
  photoDataUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const AvatarPlaceholder: React.FC<AvatarPlaceholderProps> = ({
  name,
  photoDataUrl,
  size = 'md',
  className = '',
}) => {
  const sizeClasses: Record<NonNullable<AvatarPlaceholderProps['size']>, string> = {
    sm: 'w-9 h-9 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-20 h-20 text-xl',
    xl: 'w-24 h-24 text-2xl',
  };

  const initials = (name || 'User')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  if (photoDataUrl) {
    return (
      <div
        className={`relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shrink-0 ${sizeClasses[size]} ${className}`}
      >
        <img
          src={photoDataUrl}
          alt={`${name} profile portrait`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-indigo-200/80 bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-900 text-white font-display font-semibold flex items-center justify-center shrink-0 select-none ${sizeClasses[size]} ${className}`}
      aria-label={`${name} avatar`}
    >
      {initials || <User className="w-5 h-5" />}
    </div>
  );
};
