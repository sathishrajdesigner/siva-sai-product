import type { CollectionConfig } from 'payload'

export const Enquiries: CollectionConfig = {
  slug: 'enquiries',

  admin: {
    useAsTitle: 'name',
    group: 'Enquiries',
    defaultColumns: ['name', 'mobile', 'type', 'product', 'status', 'createdAt'],
    listSearchableFields: ['name', 'mobile', 'email'],
  },

  // Enquiries are created via frontend API only — not from admin
  access: {
    create: () => true,                        // frontend form posts here
    read:   ({ req }) => Boolean(req.user),    // admin only
    update: ({ req }) => Boolean(req.user),    // admin only
    delete: ({ req }) => {
      if (!req.user) return false
      return (req.user as { role?: string }).role === 'super_admin'
    },
  },

  fields: [
    // ── READ-ONLY — captured from frontend ────────────────────────────
    {
      name: 'type',
      type: 'select',
      defaultValue: 'single_enquiry',
      options: [
        { label: 'Single Enquiry', value: 'single_enquiry' },
        { label: 'Quotation',      value: 'quotation' },
      ],
      admin: { readOnly: true },
    },
    {
      name: 'items',
      type: 'array',
      label: 'Quoted Items',
      admin: {
        readOnly: true,
        description: 'Products requested in this quotation.',
        condition: (data) => data.type === 'quotation',
      },
      fields: [
        { name: 'productName', type: 'text', label: 'Product' },
        { name: 'qty',         type: 'number', label: 'Quantity' },
      ],
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'mobile',
      type: 'text',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'email',
      type: 'email',
      admin: { readOnly: true },
    },
    {
      name: 'product',
      type: 'text',
      label: 'Product Enquired',
      admin: { readOnly: true },
    },
    {
      name: 'message',
      type: 'textarea',
      admin: { readOnly: true },
    },
    {
      name: 'source',
      type: 'text',
      defaultValue: 'website',
      admin: { readOnly: true },
    },
    {
      name: 'ipAddress',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'referrerUrl',
      type: 'text',
      admin: { readOnly: true },
    },

    // ── EDITABLE — admin follow-up ────────────────────────────────────
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: '🆕 New',       value: 'new' },
        { label: '📞 Contacted', value: 'contacted' },
        { label: '✅ Converted', value: 'converted' },
        { label: '❌ Closed',    value: 'closed' },
      ],
      admin: {
        description: 'Update this as you follow up with the customer.',
      },
    },
    {
      name: 'adminNotes',
      type: 'textarea',
      label: 'Admin Notes',
      admin: {
        description: 'Internal notes — not visible to the customer.',
      },
    },
    {
      name: 'contactedAt',
      type: 'date',
      label: 'Date Contacted',
      admin: {
        description: 'Date you first contacted this customer.',
      },
    },
  ],
}
