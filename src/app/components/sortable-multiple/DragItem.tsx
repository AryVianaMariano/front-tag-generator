'use client'

import React from 'react'
import { ItemData } from './Item'

export function DragItem({ item }: { item: ItemData }) {
  return (
    <div
      style={{
        padding: '10px 12px',
        marginBottom: '8px',
        background: '#ffffff',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
      }}
      className="text-sm pointer-events-none"
    >
      {item.name}
    </div>
  )
}