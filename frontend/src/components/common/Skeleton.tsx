import React from 'react';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  count?: number;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '20px',
  borderRadius = 'var(--radius-md)',
  className = '',
  count = 1,
  style,
}) => {
  const items = Array.from({ length: count });

  return (
    <>
      {items.map((_, i) => (
        <div
          key={i}
          className={`skeleton ${className}`}
          style={{
            width,
            height,
            borderRadius,
            marginBottom: count > 1 && i < count - 1 ? '8px' : 0,
            ...style,
          }}
        />
      ))}
    </>
  );
};
